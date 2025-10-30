import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const req: Request = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;
        console.log("authHeader : ", authHeader)
        if (!authHeader) {
            throw new UnauthorizedException('Authorization token missing');
        }

        try {
            const token = authHeader.split(' ')[1];
            const jwtSecret = this.configService.get<string>('JWT_SECRET') || 'REV9TASKAHMED';
            const decoded = jwt.verify(token, jwtSecret);
            if (decoded.role != 'admin') {
                throw new UnauthorizedException('Admin token missing');
            }
            req['user'] = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
