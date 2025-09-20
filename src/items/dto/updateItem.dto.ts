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
import { Type, Transform } from 'class-transformer';
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

    @IsOptional()
    isActive?: boolean;

    @IsOptional()
    @IsNumber()
    minQuantity?: number;

    @IsOptional()
    @IsNumber()
    maxQuantity?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    currency?: string;
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
    @IsString()
    @Transform(({ value }) => {
        // If it's already an ObjectId, return as is
        if (mongoose.Types.ObjectId.isValid(value)) {
            return value;
        }
        // If it's a string (category name), we'll handle conversion in service
        return value;
    })
    type?: string;

    @IsOptional()
    @IsString()
    subType : string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    location?: string;
}
