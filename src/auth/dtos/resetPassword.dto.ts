import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsString({ message: 'Token must be a string' })
    token: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    newPassword: string;
}
