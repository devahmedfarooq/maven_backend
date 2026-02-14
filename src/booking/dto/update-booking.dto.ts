import { PartialType } from "@nestjs/mapped-types";
import { CreateBookingDto } from "./create-booking.dto";
import { IsEnum, IsString } from "class-validator";

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    @IsEnum(['pending', 'contacted', 'declinded' ,'confirmed'])
    status: string
}
