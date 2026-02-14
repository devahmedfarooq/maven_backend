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

    @Prop({ 
        type: String, 
        enum: ['islamabad', 'mirpur', null], 
        default: null,
        required: false 
    })
    location?: string | null

    @Prop({ 
        type: Boolean, 
        default: false 
    })
    isGlobal?: boolean
}

export type BlogDocument = HydratedDocument<Blog>
export const BlogScehema = SchemaFactory.createForClass(Blog)

