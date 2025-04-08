import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super(); 
  }

  async validate(payload: any) {
    // Validate user credentials (find the user and compare the password)
    const user = await this.authService.validateUser({ email: payload.email, password: payload.password });
    if (!user) {
        throw new UnauthorizedException();
    }
    return user; 
  }
}