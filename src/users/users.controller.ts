import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
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

  @Put('/profile/:id')
  async profileUpdate(@Body() profileSettingDto: ProfileSettingDto, @Param('id') id: string) {
    return await this.usersService.profileSetting(profileSettingDto, id)
  }


  @Get('/profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: Request) {
    const { email } = req['user']
    return await this.usersService.getProfile(email)
  }


  @Get('/')
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 3) {
    return this.usersService.getUsers(page, limit)
  }

  @Get("/:id")
  async findUser(@Param("id") id: string) {
    const user = await this.usersService.getUser(id);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  @Delete(":id")
  async deleteUser(@Param("id") userId: string) {
    return await this.usersService.deleteUser(userId);
  }


}
