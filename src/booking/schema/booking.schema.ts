import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type BookingDocument = Booking & Document;

@Schema({ _id: false, versionKey: false })
export class IdProof {
    @Prop()
    idCardfront?: string;

    @Prop()
    idCardback?: string;

    @Prop()
    passport?: string;
}

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

    @Prop({ type: IdProof, required: false })
    idproof?: IdProof
}

@Schema({ _id: false, versionKey: false })
export class Items {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, type: Number })
    cost: number;

    @Prop({ required: true, type: Number })
    amount: number;

    @Prop({required : true, type : String})
    id : string 
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
    @Prop({ required: true, type: Date })
    date: Date;

    @Prop({ required: true })
    time: string;
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
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
