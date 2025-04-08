import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './auth/config/jwt.config';  
import { AppDataSource } from './config/db';
import { EmailModule } from './email/email.module';
import { OtpModule } from './otp/otp.module';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';
import { WalletModule } from './wallet/wallet.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { TransactionModule } from './transaction/transaction.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    ConfigModule.forRoot({
      load: [jwtConfig], 
      isGlobal: true,   
    }),
    AuthModule,
    UserModule,
    EmailModule,
    OtpModule,
    ExchangeRateModule,
    WalletModule,
    ScheduleModule.forRoot(),
    HttpModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService ],
  exports: [AppService],
})
export class AppModule {}
