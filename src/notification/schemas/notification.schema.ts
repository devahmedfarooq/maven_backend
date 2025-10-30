import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  module: string; // e.g., "Booking"

  @Prop({ type: Types.ObjectId, required: true }) 
  entityId: Types.ObjectId; // ID of the object on which the action is performed
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
