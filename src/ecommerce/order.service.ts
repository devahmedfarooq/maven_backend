import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

    async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        const newOrder = new this.orderModel(createOrderDto);
        return await newOrder.save();
    }

    async getUserOrders(userId: string): Promise<Order[]> {
        return await this.orderModel.find({ userId }).populate('items.product').exec();
    }

    async updateOrderStatus(orderId: string, status: string): Promise<Order> {
        const order = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }

    async cancelOrder(orderId: string): Promise<void> {
        const deleted = await this.orderModel.findByIdAndDelete(orderId);
        if (!deleted) {
            throw new NotFoundException('Order not found');
        }
    }
}
