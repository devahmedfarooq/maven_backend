import { IsArray, IsString, IsNumber, ValidateNested, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class Price {
    @IsOptional()
    @IsNumber()
    cost?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    type?: string;
}

export class UpdateItemDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true }) // Ensures each element in the array is a string
    @IsNotEmpty({ each: true }) // Ensures no empty strings
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
    @ValidateNested({ each: true }) // Validates each Price object if provided
    @Type(() => Price) // Transforms plain objects into class instances
    price?: Price[];

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    about?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    type?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    location?: string

}
