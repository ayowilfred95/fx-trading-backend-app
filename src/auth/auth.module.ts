import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; 
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { ValidationService } from 'lib/helpers/zod';
import { OtpModule } from '../otp/otp.module';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';


@Module({
  imports: [
    JwtModule,
    UserModule,
    OtpModule,
    EmailModule,
  ],
  providers: [ValidationService, AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [JwtModule]
})
export class AuthModule {}