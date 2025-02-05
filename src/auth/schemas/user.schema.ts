import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

@Schema({ timestamps: true })
export class OTP {
    @Prop()
    otp: number

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt?: Date

    @Prop({ default: false, required: true })
    verified: boolean

    @Prop()
    expire: Date

}


export const OTPSchema = SchemaFactory.createForClass(OTP)

@Schema({ timestamps: true })
export class User {

    @Prop()
    name: string

    @Prop()
    phone: string

    @Prop({ unique: true })
    email: string

    @Prop({ type: Date })
    dateOfBirth?: Date

    @Prop()
    password: string

    @Prop({ type: OTPSchema })
    otp: OTP

    @Prop()
    role: string

    @Prop()
    createdAt: Date

    @Prop()
    gender?: string

    @Prop()
    address?: string

    @Prop({ type: String, required: false })
    image: string

    @Prop()
    updatedAt?: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
export type UserDocumentOveride = {
    otp: mongoose.Types.Subdocument<mongoose.Types.ObjectId & OTP>
}

export type UserDocument = HydratedDocument<User, UserDocumentOveride>



