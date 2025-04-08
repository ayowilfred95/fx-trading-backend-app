import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../auth/schemas/register-user.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { Role } from 'src/auth/enums/role.enum';
import { Wallet } from 'src/entities/wallet.entity';
import { WalletBalance } from 'src/entities/wallet-balance.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private UserRepo: Repository<User>,
    private entityManager: EntityManager, 
  ) {}

  async register(createUserDto: RegisterUserDto): Promise<User> {
    return this.entityManager.transaction(async (transactionalEntityManager) => {
      // Create User
      const user = this.UserRepo.create({ ...createUserDto, role: Role.USER });
      await transactionalEntityManager.save(user);
  
      // Create Wallet (no balances yet)
      const wallet = new Wallet();
      wallet.user = user;
      await transactionalEntityManager.save(wallet);
  
      // Create initial NGN balance (0.00)
      const ngnBalance = new WalletBalance();
      ngnBalance.wallet = wallet;
      ngnBalance.currencyCode = 'NGN';
      ngnBalance.balance = 0;
      await transactionalEntityManager.save(ngnBalance);
  
      // Link balance to wallet (optional but clean)
      wallet.balances = [ngnBalance];
      await transactionalEntityManager.save(wallet);
  
      return user;
    });
  }

  // Other business logic methods (findByEmail, findOne, etc.)
  async findByEmail(email: string) {
    const user = await this.UserRepo.findOne({ where: { email } });
    return user;
  }

  async findOne(id: number) {
    return this.UserRepo.findOne({ where: { id } });
  }


  async update(id: number, data: Partial<User>) {
    // First update the record
    await this.UserRepo.update(id, data);
    
    return this.UserRepo.findOne({ where: { id } });
  }
}
