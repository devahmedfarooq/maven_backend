import { IsString, IsArray, IsNumber, IsEnum, IsOptional, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class OrderItemDto {
    @IsString()
    productId: string;

    @IsNumber()
    @Min(1, { message: "Quantity must be at least 1" })
    quantity: number;
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsString()
    userId: string;

    @IsEnum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    status: string;

    @IsNumber()
    totalAmount: number;

    @IsOptional()
    @IsString()
    paymentMethod?: string;

    @IsOptional()
    @IsString()
    address?: string;
}
