import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    DeleteDateColumn,
    UpdateDateColumn,
    CreateDateColumn,
    BaseEntity,
    OneToMany,
    Unique,
    OneToOne,
  } from 'typeorm';
  import { Exclude } from 'class-transformer';
  import { Wallet } from './wallet.entity';
  import { Transaction } from './transaction.entity';
import { Otp } from './otp.entity';
import { Role } from '../auth/enums/role.enum';
  
  @Entity('users') 
  @Unique(['email'])
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id!: number;
  
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column({ unique: true })
    email: string;
  
    @Exclude() 
    @Column({ nullable: true })
    password: string;

    @Column({ type: 'enum', enum: Role,default: Role.USER })
    role: Role;
  
    @Column({ default: false })
    isVerified: boolean;
  
    @Column({ default: 'ACTIVE' })
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
    readonly createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    readonly updatedAt!: Date;
  
    @DeleteDateColumn({ type: 'timestamp' })
    readonly deletedAt: Date;

      // Relationships
      @OneToOne(() => Wallet, (wallet) => wallet.user)
      wallet: Wallet;
      
      @OneToMany(() => Transaction, (transaction) => transaction.user)
      transactions: Transaction[];
      
      @OneToMany(() => Otp, (otp) => otp.user)
      otps: Otp[];
  
    static withPassword() {
        return this.createQueryBuilder('user')
          .select(['user', 'user.password']);
      }
    }