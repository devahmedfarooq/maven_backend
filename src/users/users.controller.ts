import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfileSettingDto } from './dto/profileSetting.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {

  }

  @Post('/profile')
  @UseGuards(AuthGuard)
  async profileSetting(@Body() profileSettingDto: ProfileSettingDto, @Req() req: Request) {
    const { email } = req['user']
    return await this.usersService.profileSetting(profileSettingDto, email)
  }


  @Get('/profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: Request) {
    const { email } = req['user']
    return await this.usersService.getProfile(email)
  }


}
