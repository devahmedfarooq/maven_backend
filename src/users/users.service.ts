import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../auth/schemas/user.schema'
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ProfileSettingDto } from './dto/profileSetting.dto';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

    async profileSetting(profileSettingDto: ProfileSettingDto, identifier: string) {
        // First check if identifier is a valid MongoDB ObjectId
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
        
        let query;
        if (isObjectId) {
            query = { _id: identifier };
        } else {
            // Validate email format if not an ObjectId
            if (!identifier.includes('@')) {
                throw new HttpException("Invalid identifier format", HttpStatus.BAD_REQUEST);
            }
            query = { email: identifier.toLowerCase() }; // normalize email
        }
    
        const user = await this.userModel.findOne(query).exec();
        
        if (!user) {
            throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
        }
    
        const updatedUser = await this.userModel.findOneAndUpdate(
            { _id: user._id }, // Always update by _id once user is found
            { $set: profileSettingDto },
            { new: true }
        ).exec();
    
        return {
            message: "Profile Updated Successfully",
            user: updatedUser
        };
    }
    
    

    async getProfile(email: String): Promise<User> {
        const user = await this.userModel.findOne({ email }, { _id: 0 }).exec()

        if (!user) {
            throw new HttpException("User Not Found With This Email", HttpStatus.NOT_FOUND)
        }

        return user
    }


    async getUsers(page: number | string, limit: number | string) {
        // Convert page & limit to numbers
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
    
        if (isNaN(pageNum) || isNaN(limitNum)) {
            throw new Error("Page and limit must be numbers");
        }
    
        const skip = (pageNum - 1) * limitNum;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Get date 1 month ago
    
        const result = await this.userModel.aggregate([
            {
                $facet: {
                    metadata: [{ $count: "totalUsers" }],
                    users: [
                        { $project: { _id: 1, name: 1, email: 1, image: 1, createdAt: 1 } },
                        { $sort: { createdAt: -1 } }, // Sort by latest users first
                        { $skip: skip },
                        { $limit: limitNum }
                    ],
                    newUsers: [
                        { $match: { createdAt: { $gte: oneMonthAgo } } }, // Users registered in the last month
                        { $count: "newUsersCount" }
                    ]
                }
            }
        ]);
    
        const totalUsers = result[0].metadata.length ? result[0].metadata[0].totalUsers : 0;
        const totalPages = Math.ceil(totalUsers / limitNum);
        const newUsers = result[0].newUsers.length ? result[0].newUsers[0].newUsersCount : 0;
    
        return {
            users: result[0].users,
            totalUsers,
            totalPages,
            currentPage: pageNum,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
            newUsers // New users count in the past month
        };
    }


    async getUser(userId: string): Promise<User> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new NotFoundException("Invalid user ID");
        }

        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }
    
    
    
    async deleteUser(userId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new HttpException("Invalid user ID", HttpStatus.BAD_REQUEST);
        }
    
        const deletedUser = await this.userModel.findByIdAndDelete(userId).exec();
    
        if (!deletedUser) {
            throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
        }
    
        return { message: "User deleted successfully" };
    }
    

}
