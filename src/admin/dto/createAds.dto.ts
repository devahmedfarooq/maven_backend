import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';


class AdsImageDto {
    @IsString()
    readonly imgSrc: string;

    @IsString()
    readonly title: string;

    @IsOptional()
    @IsNumber()
    readonly clicked?: number;

    @IsOptional()
    @IsNumber()
    readonly viewed?: number;

    @IsString()
    readonly href: string;

    @IsOptional()
    @IsDate()
    readonly campinStart?: Date;

}


export class CreateAdsDto {


    readonly ads: AdsImageDto[]

    @IsOptional()
    @IsNumber()
    readonly clicked?: number;

    @IsOptional()
    @IsNumber()
    readonly viewed?: number;

}