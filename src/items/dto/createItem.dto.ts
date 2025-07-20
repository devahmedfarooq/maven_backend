import { IsArray, IsString, IsNumber, ValidateNested, IsOptional, IsNotEmpty } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import mongoose from 'mongoose';

class Price {
    @IsNumber()
    cost: number;

    @IsString()
    @IsNotEmpty()
    type: string;

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

export class CreateItemDto {
    @IsArray()
    @IsString({ each: true }) // Ensures every element in array is a string
    @IsNotEmpty({ each: true }) // Ensures no empty strings
    imgs: string[];

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional() // Subtitle is optional
    @IsString()
    subtitle?: string;

    @IsArray()
    @ValidateNested({ each: true }) // Validates each Price object
    @Type(() => Price) // Transforms plain objects into class instances
    price: Price[];

    @IsString()
    @IsNotEmpty()
    about: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => {
        // If it's already an ObjectId, return as is
        if (mongoose.Types.ObjectId.isValid(value)) {
            return value;
        }
        // If it's a string (category name), we'll handle conversion in service
        return value;
    })
    type: string;

    @IsString()
    @IsOptional()
    subType : string

    @IsString()
    @IsNotEmpty()
    location: string
}
