import { PartialType } from "@nestjs/mapped-types";
import { CreateOrderDto } from "./create-order.dto";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @IsOptional()
    @IsEnum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    status?: string;
}
