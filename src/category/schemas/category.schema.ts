import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type MainCategoryDocument = HydratedDocument<MainCategory>

@Schema()
export class MainCategory {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ default: false })
  hasSubType: boolean

  @Prop({ type: [String], default: [] }) // ✅ Optional and always an array
  subName: string[]

  @Prop({ default: "Appointment Date" })
  appointmentDateLabel: string

  @Prop({ default: "Appointment Time" })
  appointmentTimeLabel: string

  @Prop({ default: "Select your preferred appointment date and time" })
  appointmentDescription: string

  @Prop({ default: true })
  requiresAppointment: boolean

  @Prop({ default: "bookmark" }) // Default icon name
  icon: string
}

export const MainCategorySchema = SchemaFactory.createForClass(MainCategory)
