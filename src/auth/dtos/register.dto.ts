import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';

export class RegisterUserDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    readonly name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    readonly email: string;

    @IsPhoneNumber("PK", { message: 'Invalid phone number' }) // `null` uses default region
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
