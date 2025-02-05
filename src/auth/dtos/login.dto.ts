import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
    @IsEmail({}, { message: 'Invalid email format' })
    readonly email: string;

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
