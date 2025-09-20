import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AdsImageDocument = HydratedDocument<AdsImage>;
export type AdsDocument = HydratedDocument<Ads>;

@Schema()
export class AdsImage {
    @Prop({ required: true })
    imgSrc: string;

    @Prop({ required: true })
    title: string;

    @Prop({ type: Number, default: 0 }) // Changed to Number to store click counts
    clicked: number;

    @Prop({ type: Number, default: 0 }) // Changed to Number to store click counts
    viewed: number;

    @Prop({ required: true })
    href: string;

    @Prop({ type: Date, default: () => new Date() }) // FIXED: Dynamic default Date
    campinStart: Date

    @Prop({type : Boolean, default : false})
    active : boolean
}

export const AdsImageSchema = SchemaFactory.createForClass(AdsImage);

@Schema({ timestamps: true })
export class Ads {
    @Prop({ type: [AdsImageSchema], default: [] }) // Correct way to define nested schema array
    ads: AdsImage[];

    @Prop({ type: Number, default: 0 }) // Changed to Number to store click counts
    clicked: number;

    @Prop({ type: Number, default: 0 }) // Changed to Number to store click counts
    viewed: number;

}

export const AdsSchema = SchemaFactory.createForClass(Ads);
