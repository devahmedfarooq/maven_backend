import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose'

@Schema({ timestamps: true })
export class Blog {
    @Prop()
    img?: string

    @Prop()
    title: string

    @Prop()
    subtitle: string


    @Prop()
    about: string

    @Prop()
    description: string
}

export type BlogDocument = HydratedDocument<Blog>
export const BlogScehema = SchemaFactory.createForClass(Blog)

