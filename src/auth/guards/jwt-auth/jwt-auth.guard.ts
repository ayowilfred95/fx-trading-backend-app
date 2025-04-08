import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // First check JWT token validity
    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) return false;

    // Get the request object
    const request = context.switchToHttp().getRequest();
    
    // Get the user from the request
    const user = request.user;
    // console.log("user..............:",user)


    // Check if user is verified
    if (user.isVerified !== true) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'User account is not verified',
        error: 'Unauthorized'
      });
    }

    return true;
  }
}