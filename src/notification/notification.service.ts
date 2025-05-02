import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) { }

  async logAction(message: string, module: string, entityId: string) {
    await this.notificationModel.create({ message, module, entityId });
  }


  async getNotifications(query: any) {
    const { module, entityId, startDate, endDate, page = 1, limit = 10 } = query;
    const filter: any = {};

    if (module) filter.module = module;
    if (entityId) filter.entityId = entityId;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const notifications = await this.notificationModel
      .find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalCount = await this.notificationModel.countDocuments(filter);

    return {
      data: notifications,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  }


}
