import { Transaction } from '../../entities/transaction.entity';

export interface PaginatedTransactions {
    results: Transaction[];
    total: number;
  }