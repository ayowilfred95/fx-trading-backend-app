import { IsInt, Min, Max, IsOptional, IsEnum } from 'class-validator';
import { TransactionType } from '../../entities/transaction.entity';

export class TransactionQueryDto {
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsInt()
  @Min(1)
  @Max(100) 
  limit: number = 10;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}