import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}

export class ProfileSettingDto {
    @IsOptional()
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    readonly name: string;

    @IsOptional() // Allows the field to be optional
    @Type(() => Date) // Converts input to Date object
    @IsDate({ message: 'Invalid date format' })
    readonly dateOfBirth?: Date;

    @IsOptional()
    @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
    readonly gender?: Gender;

    @IsOptional()
    @IsString({ message: 'Address must be a string' })
    readonly address?: string;
}
