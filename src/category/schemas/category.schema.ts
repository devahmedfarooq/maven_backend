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
}

export const MainCategorySchema = SchemaFactory.createForClass(MainCategory)
