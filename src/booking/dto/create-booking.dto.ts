import { Type } from "class-transformer";
import { IsArray, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class AppointmentDto {
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    date?: Date;

    @IsString()
    @IsOptional()
    time?: string;
}

export class KeyValueDto {
    @IsEnum(["checkbox", "options", "select", "date", "time"])
    type: string;

    @IsString()
    @IsNotEmpty()
    key: string;

    value: any;
}

export class ItemsDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    cost: number;

    @IsNumber()
    amount: number;
}

export class SummaryDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemsDto)
    items: ItemsDto[];

    @IsNumber()
    subtotal: number;

    @IsNumber()
    gst: number;

    @IsNumber()
    total: number;
}

export class PersonalInformationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsOptional()
    address?: string;
}

export class CreateBookingDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => AppointmentDto)
    appointment?: AppointmentDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => KeyValueDto)
    details: KeyValueDto[];

    @ValidateNested()
    @Type(() => SummaryDto)
    summary: SummaryDto;

    @ValidateNested()
    @Type(() => PersonalInformationDto)
    personalInfo: PersonalInformationDto;
}
