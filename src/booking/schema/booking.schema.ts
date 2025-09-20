import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Mongoose } from "mongoose";

export type BookingDocument = Booking & Document;

@Schema({ _id: false, versionKey: false })
export class PersonalInformation {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    address: string;
}

@Schema({ _id: false, versionKey: false })
export class Items {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, type: Number })
    cost: number;

    @Prop({ required: true, type: Number })
    amount: number;

    @Prop({ required: true, type: String })
    id: string
}

@Schema({ _id: false, versionKey: false })
export class Summary {
    @Prop({ required: true, type: [Items] })
    items: Items[];

    @Prop({ required: true, type: Number })
    subtotal: number;

    @Prop({ required: true, type: Number })
    gst: number;

    @Prop({ required: true, type: Number })
    total: number;
}

@Schema({ _id: false, versionKey: false })
export class Appointment {
    @Prop({ type: Date })
    startDate?: Date;

    @Prop()
    startTime?: string;

    @Prop({ type: Date })
    endDate?: Date;

    @Prop()
    endTime?: string;
}

@Schema({ _id: false, versionKey: false })
export class KeyValue {
    @Prop({ required: true, enum: ['text', 'number', 'select', 'checkbox', 'date', 'time', 'datetime', 'textarea'] })
    type: string;

    @Prop({ required: true })
    key: string;

    @Prop({ type: mongoose.Schema.Types.Mixed })  // ✅ Allows any type of data
    value: any;
}

@Schema({ timestamps: true }) // Adds createdAt & updatedAt fields automatically
export class Booking {
    @Prop({ type: Appointment })
    appointment?: Appointment;

    @Prop({ type: [KeyValue], required: false })
    details: KeyValue[];

    @Prop({ type: Summary, required: false })
    summary: Summary;

    @Prop({ type: PersonalInformation, required: false })
    personalInfo: PersonalInformation;

    @Prop({ type: mongoose.Types.ObjectId })
    userId: mongoose.Types.ObjectId

    @Prop({ type: 'string', enum: ['pending', 'contacted', 'declinded' ,'confirmed'], default: 'pending' })
    status: string
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
