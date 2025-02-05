import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../auth/schemas/user.schema'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfileSettingDto } from './dto/profileSetting.dto';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

    async profileSetting(profileSettingDto: ProfileSettingDto, email: string) {

        const user = await this.userModel.findOne({ email }).exec()

        if (!user) {
            throw new HttpException("User Not Found With This Email", HttpStatus.NOT_FOUND)
        }

        const updateUser = await this.userModel.updateOne({ email }, { ...profileSettingDto }).exec()



        return {
            message: "Updated Successfully"
        }

    }

    async getProfile(email: String): Promise<User> {
        const user = await this.userModel.findOne({ email },{ _id : 0}).exec()

        if (!user) {
            throw new HttpException("User Not Found With This Email", HttpStatus.NOT_FOUND)
        }

        return user
    }

}
