import { IsArray, IsString, IsNumber, ValidateNested, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class Price {
    @IsNumber()
    cost: number;

    @IsString()
    @IsNotEmpty()
    type: string;
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
    type: string;

    @IsString()
    @IsOptional()
    subType : string

    @IsString()
    @IsNotEmpty()
    location: string
}
