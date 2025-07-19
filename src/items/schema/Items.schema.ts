import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import {MainCategory} from '../../category/schemas/category.schema'
export type ItemDocument = HydratedDocument<Item>;

// Review Schema
@Schema({ _id: false }) // No need for a separate _id for subdocuments
export class Review {
    @Prop({ required: true })
    img: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, min: 0, max: 5 })
    rating: number;
}
export class KeyValue {
    @Prop({ enum: ['text', 'number', 'select', 'checkbox', 'date', 'time', 'datetime', 'textarea'] })
    type: string;

    @Prop()
    key: string;

}

// Price Schema
@Schema({ _id: false })
export class Price {
    @Prop({ required: true })
    cost: number;

    @Prop({ required: true })
    type: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: 1 })
    minQuantity: number;

    @Prop()
    maxQuantity?: number;

    @Prop()
    description?: string;

    @Prop({ default: 'PKR' })
    currency: string;
}

// Item Schema
@Schema({ timestamps: true })
export class Item {
    @Prop({ type: [String], required: true })
    imgs: string[];

    @Prop({ required: true })
    title: string;

    @Prop()
    subtitle: string;

    @Prop({ type: [Price], required: true })
    price: Price[];

    @Prop()
    about: string;

    @Prop({ type: [Review], default: [] })
    reviews: Review[];

    @Prop({ type: mongoose.Types.ObjectId, required: true, ref : MainCategory.name  })
    type: mongoose.Types.ObjectId

    @Prop()
    subType : string

    @Prop({ type: String })
    location: string

    @Prop({ type: [KeyValue] })
    keyvalue: [KeyValue]
}

// Generate Mongoose Schemas
export const ReviewSchema = SchemaFactory.createForClass(Review);
export const PriceSchema = SchemaFactory.createForClass(Price);
const ItemSchema = SchemaFactory.createForClass(Item);
ItemSchema.index({ title: 'text', subtitle: 'text' })
export {
    ItemSchema
}