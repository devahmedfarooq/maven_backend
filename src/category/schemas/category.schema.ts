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

  @Prop({ default: "Start Date" })
  appointmentStartDateLabel: string

  @Prop({ default: "Start Time" })
  appointmentStartTimeLabel: string

  @Prop({ default: "End Date" })
  appointmentEndDateLabel: string

  @Prop({ default: "End Time" })
  appointmentEndTimeLabel: string

  @Prop({ default: "Select your preferred start and end dates" })
  appointmentDescription: string

  @Prop({ default: false })
  requiresDuration: boolean

  @Prop({ default: "bookmark" }) // Default icon name
  icon: string
}

export const MainCategorySchema = SchemaFactory.createForClass(MainCategory)
