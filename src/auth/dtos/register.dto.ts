import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches } from 'class-validator';

export class RegisterUserDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    readonly name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    readonly email: string;

    @IsString({ message: 'Phone number must be a string' })
    @Matches(/^(\+?[1-9]\d{1,14}|\d{10,15})$/, { message: 'Invalid phone number format' })
    readonly phone: string;

    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minUppercase: 1,
        minLowercase: 1,
        minSymbols: 1
    }, { message: 'Password is not strong enough' })
    readonly password: string;
}
