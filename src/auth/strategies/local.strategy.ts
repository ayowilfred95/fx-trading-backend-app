import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    if (!password?.trim()) {
      throw new UnauthorizedException('Please provide the password');
    }

    const user = await this.authService.validateUser({ email, password });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }
}
