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
    @Prop({ enum: ['select', 'checkbox', 'options', 'select', 'date', 'time'] })
    type: string
    @Prop()
    key: string
    @Prop({ type: mongoose.Schema.Types.Mixed })  // ✅ Allows any type of data
    value: any;
}

// Price Schema
@Schema({ _id: false })
export class Price {
    @Prop({ required: true })
    cost: number;

    @Prop({ required: true })
    type: string;
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

    @Prop({ type: String })
    location: string
}

// Generate Mongoose Schemas
export const ReviewSchema = SchemaFactory.createForClass(Review);
export const PriceSchema = SchemaFactory.createForClass(Price);
export const ItemSchema = SchemaFactory.createForClass(Item);
