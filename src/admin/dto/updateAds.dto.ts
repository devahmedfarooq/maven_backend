import { IsString, IsOptional, IsNumber, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
    @IsDate()
    readonly campinStart?: Date;
}

export class UpdateAdsDto {
    @IsOptional()
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
