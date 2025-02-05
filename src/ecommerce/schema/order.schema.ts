import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Article } from "./article.schema"; // Product schema
import { PersonalInformation } from "../../booking/schema/booking.schema"; // User details schema

export type OrderDocument = Order & Document;

@Schema({ _id: false, versionKey: false })
export class OrderItem {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true }) // Reference to product
    product: Article;

    @Prop({ required: true, min: 1 })
    quantity: number;

    @Prop({ required: true }) // Price at the time of purchase
    price: number;
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }) // Reference to User
    user: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [OrderItem], required: true }) // List of products in order
    items: OrderItem[];

    @Prop({ type: PersonalInformation, required: true }) // Shipping details
    personalInfo: PersonalInformation;

    @Prop({ required: true }) // Total price (calculated)
    total: number;

    @Prop({ enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], default: "pending" }) // Order status
    status: string;

    @Prop({ type: String }) // Payment method (e.g., "credit_card", "paypal")
    paymentMethod: string;

    @Prop({ default: false }) // Whether the payment was completed
    isPaid: boolean;

    @Prop({ default: Date.now }) // Order creation timestamp
    orderDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
