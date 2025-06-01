import {
    IsArray,
    IsString,
    IsNumber,
    ValidateNested,
    IsOptional,
    IsNotEmpty,
    Min,
    Max,
    isNumber
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

// Review DTO
class Review {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    img?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    rating?: number;
}

// Price DTO
class Price {
    @IsOptional()
    @IsNumber()
    cost?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    type?: string;
}

// KeyValue DTO
class KeyValue {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    type?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    key?: string;
}

// UpdateItemDto
export class UpdateItemDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    imgs?: string[];

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsOptional()
    @IsString()
    subtitle?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Price)
    price?: Price[];

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    about?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Review)
    reviews?: Review[];

    @IsOptional()
    type?: mongoose.Types.ObjectId;

    @IsOptional()
    @IsString()
    subType : string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    location?: string;

    @IsOptional()
    keyvalue?: KeyValue[]
}
