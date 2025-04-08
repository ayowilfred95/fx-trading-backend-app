import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExchangeRateService } from './exchange-rate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from '../../src/entities/exchange.entity';
import { ExchangeRateController } from './exchange-rate.controller';

@Module({
  imports: [
    HttpModule,  
    TypeOrmModule.forFeature([ExchangeRate])
  ],
  providers: [ExchangeRateService],
  exports: [ExchangeRateService],
  controllers: [ExchangeRateController]
})
export class ExchangeRateModule {}