import { Injectable, Req, Res } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../src/user/user.service';
import { AuthJwtPayload } from '../auth/types/auth-jwtPayload';
import { appError } from 'lib/helpers/error';
import {
  RegisterUserDto,
  registerUserSchema,
} from './schemas/register-user.schema';
import { CurrentUser } from '../../src/auth/types/current-user';
import { ValidationService } from '../../lib/helpers/zod';
import { LoginUserDto, loginUserSchema } from './schemas/login-user.schema';
import { hashCompare, hashGenerate } from 'lib/helpers/app';
import { OtpService } from '../../src/otp/otp.service';
import { EmailService } from '../../src/email/email.service';
import { VerifyOtpDto, verifyOtpSchema } from './schemas/verify-otp.schema';
import { Role } from 'src/auth/enums/role.enum';
import { AuthenticatedRequest } from '../common/types/authenticated-request';



@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private validationService: ValidationService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly mailService: EmailService,
    
  ) {}

  async validateUser(data: LoginUserDto) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) throw appError('User not found!');
    // Check password match
    const isPasswordMatch = await hashCompare(data.password, user.password);
    if (!isPasswordMatch) throw appError('Invalid password');
    delete user.password;

    return { id: user.id, user };
  }

  async register(registerUserData: RegisterUserDto) {
    try {
      // Validate input
      this.validationService.validateSchema(
        registerUserSchema,
        registerUserData,
      );

      // Get role from DTO or default to USER
      const role = registerUserData.role || Role.USER;

      // Hash password
      const hashedPassword = await hashGenerate(registerUserData.password);

      // Create user with role
      const user = await this.userService.register({
        ...registerUserData,
        password: hashedPassword,
        role,
      });
      delete user.password;

      // Generate tokens
      const { accessToken } = await this.generateTokens(user.id);

      // Send OTP
      const otp = await this.otpService.generateOtp(user.id);
      await this.mailService.sendEmail({
        to: user.email,
        subject: 'OTP Verification',
        template: 'otp',
        context: { otp: otp.otp },
      });

      return {
        accessToken,
        user,
      };
    } catch (error) {
      throw appError(error);
    }
  }

  async login(loginUserData: LoginUserDto) {
    try {
      // Validate input using Zod schema
      this.validationService.validateSchema(loginUserSchema, loginUserData);

      // Extract validated data from parsed.result
      const { email, password } = loginUserData;

      const { id, user } = await this.validateUser({ email, password });

      // Generate tokens for the user
      const { accessToken } = await this.generateTokens(id);
      return {
        user,
        accessToken,
      };
    } catch (error) {
      throw appError(error);
    }
  }

  async verify(verifyOtp: VerifyOtpDto,  @Req() req: AuthenticatedRequest) {
    try {
      // Validate input using Zod schema
      this.validationService.validateSchema(verifyOtpSchema, verifyOtp);

      // Extract validated data from parsed.result
      const { otp } = verifyOtp;
      const userId = req.user.id;

      if (!userId) throw appError('Invalid token.');

      // console.log("userId.............:",userId)
      // console.log("otp.........:",otp)

      // Validate OTP
      const otpRecord = await this.otpService.verifyOtp(otp, userId);
      // console.log("otp record.......:",otpRecord)
      let userData: any;
      if (otpRecord.isValid) {
        // update user isVerified to true
        userData = await this.userService.update(userId, {
          isVerified: true,
        });

        await this.otpService.deleteOtp(otpRecord.otpRecord);
      }

      delete userData.password;
      const { accessToken } = await this.generateTokens(userId);

      return { userData, accessToken };
    } catch (error) {
      throw appError(error);
    }
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };

    // Get JWT configuration from environment
    const jwtConfig = {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRE_IN,
    };

    // Generate access token
    const accessToken = await this.jwtService.signAsync(payload, jwtConfig);

    return { accessToken };
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw appError('User not found!');
    const currentUser: CurrentUser = { id: user.id, role: user.role };
    return currentUser;
  }
}
