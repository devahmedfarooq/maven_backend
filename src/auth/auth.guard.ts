import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization token missing');
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWTSECRET ?? 'REV9TASKAHMED');
      if (!decoded['validated']) {
        throw new UnauthorizedException('Otp not validated');
      }
      req['user'] = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException(`${error.message}`);
    }
  }
}
