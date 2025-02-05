import { IsString, IsArray, IsOptional, IsNumber, MinLength, Min } from "class-validator";

export class CreateArticleDto {
    @IsArray()
    @IsString({ each: true })
    imgs: string[];

    @IsString()
    @MinLength(3, { message: "Title must be at least 3 characters long" })
    title: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    subTitle?: string;

    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsNumber()
    @Min(1, { message: "Quantity must be at least 1" })
    quantity: number;
}
