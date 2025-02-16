import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LoginUserDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register.dto';
import { AuthGuard } from './auth.guard';
import { ValidateOtp } from './dtos/validateOtp.dto';
import { ForgetPasswordDto } from './dtos/forgot.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    async login(@Body() loginUserDto: LoginUserDto) {
        const token = await this.authService.login(loginUserDto)
        return {
            token
        }
    }

    @Post('/register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return await this.authService.register(registerUserDto)
    }


    @Get('/otp')
    async genrateOtp(@Req() req: Request) {
        const { email } = req['user']
        return await this.authService.otpGenrator(email)
    }

    @Post('/otp')
    async validateOtp(@Req() req: Request, @Body() validateOtp: ValidateOtp) {
        const { email } = req['user']
        return await this.authService.validateOtp(email, validateOtp)
    }


    @Post('/forget-password')
    async forgetPassword(@Body() forgetpasswordDto: ForgetPasswordDto) {
        return this.authService.forgetPassword(forgetpasswordDto.email)
    }


    @Post('/reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword)
    }

}
