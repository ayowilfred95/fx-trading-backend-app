import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../src/entities/transaction.entity';
import { User } from '../../src/entities/user.entity';
import { Repository } from 'typeorm';
import { TransactionType } from '../../src/entities/transaction.entity';
import { PaginatedTransactions } from './interfaces/paginated-transactions.interface';
import { appError } from 'lib/helpers/error';

interface TransactionCreateInput {
  userId?: number;
  user?: Partial<User>;
  type: TransactionType;
  debitCurrency?: string;
  debitAmount?: number;
  creditCurrency?: string;
  creditAmount?: number;
  rateUsed?: number;
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async create(input: TransactionCreateInput): Promise<Transaction> {
    try {
      const transaction = {
        ...input,
        user: input.userId ? { id: input.userId } : input.user,
      };

      const newTransaction = this.transactionRepo.create(transaction);
      return this.transactionRepo.save(newTransaction);
    } catch (error) {
      throw appError(error);
    }
  }

  async getUserTransactions(
    userId: number,
    page: number = 1,
    limit: number = 10,
    type?: TransactionType,
  ): Promise<PaginatedTransactions> {
    try {
      const [results, total] = await this.transactionRepo.findAndCount({
        where: {
          wallet: {
            user: {
              id: userId,
            },
          },
          ...(type && { type }),
        },
        order: {
          createdAt: 'DESC',
        },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['wallet', 'wallet.user'],
      });

      return {
        results,
        total,
      };
    } catch (error) {
      throw appError(error);
    }
  }
}
