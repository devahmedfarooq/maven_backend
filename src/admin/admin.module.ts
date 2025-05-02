import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ads, AdsSchema } from './schema/ads.schema';
import { Notification, NotificationSchema } from 'src/notification/schemas/notification.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { Booking, BookingSchema } from 'src/booking/schema/booking.schema';
import { Item, ItemSchema } from 'src/items/schema/Items.schema';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [MongooseModule.forFeature([
    { name: Ads.name, schema: AdsSchema },
    { name: Notification.name, schema: NotificationSchema },
    { name: User.name, schema: UserSchema },
    { name: Booking.name, schema: BookingSchema },
    { name: Item.name, schema: ItemSchema }

  ])]
})
export class AdminModule { }
