import { IsString, IsOptional, IsNumber, IsDate, ValidateNested, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateAdsImageDto {
    @IsOptional()
    @IsString()
    readonly imgSrc?: string;

    @IsOptional()
    @IsString()
    readonly title?: string;

    @IsOptional()
    @IsNumber()
    readonly clicked?: number;

    @IsOptional()
    @IsNumber()
    readonly viewed?: number;

    @IsOptional()
    @IsString()
    readonly href?: string;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    readonly campinStart?: Date;
}

export class UpdateAdsDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAdsImageDto)
    readonly ads?: UpdateAdsImageDto[];

    @IsOptional()
    @IsNumber()
    readonly clicked?: number;

    @IsOptional()
    @IsNumber()
    readonly viewed?: number;
}
