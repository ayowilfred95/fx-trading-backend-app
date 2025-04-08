import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { TransactionModule } from '../transaction/transaction.module';
import { ExchangeRateModule } from '../exchange-rate/exchange-rate.module';
import { Wallet } from '../../src/entities/wallet.entity';
import { WalletController } from './wallet.controller';

@Module({
  imports: [
    TransactionModule,
    ExchangeRateModule,
    TypeOrmModule.forFeature([Wallet])  
  ],
  providers: [WalletService],
  exports: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}