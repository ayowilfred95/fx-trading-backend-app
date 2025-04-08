import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { RegisterUserDto } from 'src/auth/schemas/register-user.schema';
import { LoginUserDto } from 'src/auth/schemas/login-user.schema';
import { apiResponse } from '../../lib/helpers/app';
import { Response } from 'express';
import { VerifyOtpDto } from 'src/auth/schemas/verify-otp.schema';
import { AuthenticatedRequest } from '../common/types/authenticated-request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    try {
      const response = await this.authService.login(body);
      return apiResponse(res, {
        success: true,
        data: response,
        message: 'Login successful',
      });
    } catch (error) {
      return apiResponse(res, {
        success: false,
        error: error.message,
      });
    }
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterUserDto, @Res() res: Response) {
    try {
      const response = await this.authService.register(body);
      return apiResponse(res, {
        success: true,
        data: response,
        message: 'Please check your email to verify your account',
      });
    } catch (error) {
      return apiResponse(res, {
        success: false,
        error: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verify(
    @Body() body: VerifyOtpDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      const response = await this.authService.verify(body, req);
      return apiResponse(res, {
        success: true,
        data: response,
        message: 'OTP verified successfully',
      });
    } catch (error) {
      return apiResponse(res, {
        success: false,
        error: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    return { id: req.user.id };
  }
}
