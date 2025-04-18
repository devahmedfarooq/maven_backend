import { IsOptional, IsNumber, IsString, IsDate, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAdsDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    readonly page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    readonly limit?: number = 10;

    @IsOptional()
    @IsString()
    readonly title?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    readonly startDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    readonly endDate?: Date;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    readonly minClicks?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    readonly minViews?: number;
} 