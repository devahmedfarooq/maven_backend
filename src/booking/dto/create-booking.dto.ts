import { Type } from "class-transformer";
import { IsArray, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, isString, IsString, ValidateNested } from "class-validator";

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
    @IsEnum(['text', 'number', 'select', 'checkbox', 'date', 'time', 'datetime', 'textarea'])
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

    @IsNotEmpty()
    id : string 
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

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => KeyValueDto)
    details: KeyValueDto[];

    @IsOptional()
    @ValidateNested()
    @Type(() => SummaryDto)
    summary: SummaryDto;   

    @IsOptional()
    @ValidateNested()
    @Type(() => PersonalInformationDto)
    personalInfo: PersonalInformationDto;
}
