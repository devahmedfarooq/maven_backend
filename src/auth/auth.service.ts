import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { LoginUserDto } from './dtos/login.dto';
import { RegisterUserDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ValidateOtp } from './dtos/validateOtp.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) { 
    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || 'REV9TASKAHMED';
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    if (!email || !password) {
      throw new HttpException(
        'Email Or Password Not Sent!',
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.userModel.findOne(
      { email },
      { email: 1, role: 1, password: 1, otp: 1 },
    );

    if (!user) {
      throw new HttpException(
        'User Not Found With This Email',
        HttpStatus.NOT_FOUND,
      );
    }

    const check: boolean = await bcrypt.compare(password, user.password);

    if (!check) {
      throw new HttpException("Password Don't Match", HttpStatus.UNAUTHORIZED);
    }

    const token: string = jwt.sign(
      { ...loginUserDto, role: user.role, validated: user.otp.verified, id: user._id },
      this.jwtSecret,
      { expiresIn: '7d' },
    );

    return { token, verified: user.otp.verified, email: user.email, id: user._id };
  }


  async adminLogin(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    if (!email || !password) {
      throw new HttpException(
        'Email Or Password Not Sent!',
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.userModel.findOne(
      { email },
      { email: 1, role: 1, password: 1, otp: 1 },
    );

    if (!user) {
      throw new HttpException(
        'User Not Found With This Email',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.role != 'admin') {
      throw new HttpException(
        'Admin Not Found With This Email',
        HttpStatus.NOT_FOUND,
      );
    }

    const check: boolean = await bcrypt.compare(password, user.password);

    if (!check) {
      throw new HttpException("Password Don't Match", HttpStatus.UNAUTHORIZED);
    }

    const token: string = jwt.sign(
      { ...loginUserDto, role: user.role, validated: user.otp.verified, id: user._id },
      this.jwtSecret,
      { expiresIn: '7d' },
    );

    return { token, verified: user.otp.verified, email: user.email, id: user._id };
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { password, email, phone, name } = registerUserDto;

    if (!email || !password || !phone || !name) {
      throw new HttpException(
        'Email Or Password Or Phone Or Name Not Sent!',
        HttpStatus.NOT_FOUND,
      );
    }

    const checkUser = await this.userModel.findOne({ email }).exec();
    if (checkUser) {
      throw new HttpException(
        'Email Already In Use',
        HttpStatus.ALREADY_REPORTED,
      );
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const user = await this.userModel.create({
      password: hash,
      role: 'user',
      email,
      phone,
      name,
      otp: {
        verified: false,
      },
    });

    if (!user) {
      throw new HttpException(
        "Couldn't Make The User",
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return user;
  }

  async otpGenrator(email: string): Promise<number> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new HttpException(
        'User Not Found With This Email',
        HttpStatus.NOT_FOUND,
      );
    }

    const now = new Date();
    const otpExpiryTime = 2 * 60 * 1000; // 2 minutes in milliseconds
    const newOtp = Math.floor(1000 + Math.random() * 9000); // Random 6-digit OTP

    if (user.otp) {
      const { updatedAt, createdAt } = user.otp;

      // Check if OTP has expired
      if (
        (updatedAt && new Date(updatedAt.getTime() + otpExpiryTime) < now) ||
        (createdAt && new Date(createdAt.getTime() + otpExpiryTime) < now)
      ) {
        // Regenerate OTP
        user.otp = {
          ...user.otp,
          otp: newOtp,
          updatedAt: now,
          expire: new Date(now.getTime() + otpExpiryTime),
          verified: false,
        };
        await user.save();
        return newOtp;
      }

      return user.otp.otp;
    }

    user.otp = {
      otp: newOtp,
      createdAt: now,
      expire: new Date(now.getTime() + otpExpiryTime),
      verified: false,
    };
    await user.save();
    console.log(newOtp);
    return newOtp;
  }

  async validateOtp(email: string, validateOtp: ValidateOtp): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new HttpException(
        'User Not Found With This Email',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.otp) {
      throw new HttpException(
        'No OTP found, please request a new one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { otp, expire } = user.otp;
    const now = new Date();

    // Check if OTP has expired
    if (expire && expire < now) {
      throw new HttpException('OTP has expired', HttpStatus.UNAUTHORIZED);
    }

    if (String(otp) !== String(validateOtp.otp)) {
      throw new HttpException('OTP Entered Is Wrong!', HttpStatus.UNAUTHORIZED);
    }

    // Mark OTP as verified
    user.otp.verified = true;
    await user.save();

    return true;
  }

  async forgetPassword(
    email: string,
  ): Promise<{ message: string; token: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        'User Not Found With This Email',
        HttpStatus.NOT_FOUND,
      );
    }

    const token = jwt.sign({ email }, this.jwtSecret, { expiresIn: '15m' });
    return { message: 'Password reset token sent to email', token };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { email: string };
      const user = await this.userModel
        .findOne({ email: decoded.email })
        .exec();
      if (!user) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      const saltOrRounds = 10;
      user.password = await bcrypt.hash(newPassword, saltOrRounds);
      await user.save();

      return { message: 'Password successfully reset' };
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
