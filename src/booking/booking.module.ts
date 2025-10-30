import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schema/booking.schema';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationSchema, Notification } from 'src/notification/schemas/notification.schema';

@Module({
  controllers: [BookingController],
  providers: [BookingService, NotificationService],
  imports: [MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }, { name: Notification.name, schema: NotificationSchema }])]
})
export class BookingModule { }
