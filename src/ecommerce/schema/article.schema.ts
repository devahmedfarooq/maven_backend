import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ArticleDocument = Article & Document;
export type CategoryDocument = Category & Document;

@Schema({ timestamps: true }) // Adds createdAt and updatedAt fields automatically
export class Article {
    @Prop({ type: [String], required: true }) // Array of image URLs
    imgs: string[];

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop()
    subTitle: string;

    @Prop()
    size: string;

    @Prop()
    color: string;

    @Prop({ type: Number, required: true, default: 1 }) // Ensure quantity is a number
    quantity: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

@Schema({ timestamps: true })
export class Category {
    @Prop({ type: [String], required: true }) // Array of category names
    name: string[];

    @Prop({ type: [{ type: Types.ObjectId, ref: "Article" }], default: [] }) // References articles
    products: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
