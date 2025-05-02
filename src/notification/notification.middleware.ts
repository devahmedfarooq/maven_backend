import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationMiddleware implements NestMiddleware {
  constructor(private readonly notificationService: NotificationService) { }

  async use(req: Request, res: Response, next: NextFunction) {

    res.on('finish', async () => {
      console.log("REQ : ", req.method)
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        const message = `${req.method === 'POST' ? 'Created' : req.method === 'PUT' ? 'Updated' : 'Deleted'}`;
        const module = req.baseUrl.split('/')[1]; // Extract module from URL
        const entityId = req.params.id || req.body.id; // Get entity ID from request

        if (entityId) {
          await this.notificationService.logAction(`${message} successfully`, module, entityId);
        }
      }
    });

    next();
  }
}
