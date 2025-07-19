import { Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import Redis from 'ioredis';
import { updateRatelimitDto } from './dto/updateRateLimit.dto';
import { CreateAdsDto } from './dto/createAds.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ads } from './schema/ads.schema';
import mongoose, { Model } from 'mongoose';
import { UpdateAdsDto } from './dto/updateAds.dto';
import { Notification } from '../notification/schemas/notification.schema'
import { User } from 'src/auth/schemas/user.schema';
import { Item } from 'src/items/schema/Items.schema';
import { Booking } from 'src/booking/schema/booking.schema';
import { GetAdsDto } from './dto/get-ads.dto';

interface AdsFilter {
  'ads.title'?: { $regex: string; $options: string };
  'ads.campinStart'?: {
    $gte?: string;
    $lte?: string;
  };
  'ads.clicked'?: { $gte: number };
  'ads.viewed'?: { $gte: number };
}

export interface DashboardStats {
  adsStats: {
    totalAds: number;
    totalClicked: number;
    totalViewed: number;
  };
  userStats: {
    totalUsers: number;
    subscribedUsers: number;
    unsubscribedUsers: number;
  };
  totalBookings: number;
  totalItems: number;
  notifications: any[];
}

@Injectable()
export class AdminService {

    //  private redisClient: Redis;
    constructor(@InjectModel(Ads.name) private readonly adsModel: Model<Ads>,
        @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
        @InjectModel(Item.name) private readonly itemModel: Model<Item>,) {
        //    this.redisClient = new Redis({ host: 'localhost', port: 6379 });
    }



    async updateLimit(updateRateLimitDto: updateRatelimitDto) {
        const { route, limit, timeWindow, role } = updateRateLimitDto;

        if (!route || !limit || !timeWindow) {
            throw new ForbiddenException('Missing required fields');
        }



        return {
            success: true,
            message: `Rate limit for ${route} updated: ${limit} requests per ${timeWindow} seconds`,
        };
    }


    async createAds(createAdsDto: CreateAdsDto) {
        const newAds = await this.adsModel.create(createAdsDto);
        await newAds.save();

        // Return selected fields (excluding _id, __v, and timestamps)
        return newAds.toObject({
            versionKey: false,  // Removes __v
            transform: (_, ret) => {
                delete ret._id; // Removes _id
            }
        });
    }

    async getAds(query: GetAdsDto) {
        const { page = 1, limit = 10, title, startDate, endDate, minClicks, minViews } = query;
        const skip = (page - 1) * limit;

        // Build filter conditions
        const filter: AdsFilter = {};

        if (title) {
            filter['ads.title'] = { $regex: title, $options: 'i' };
        }

        if (startDate || endDate) {
            filter['ads.campinStart'] = {};
            if (startDate) {
                filter['ads.campinStart'].$gte = startDate.toISOString();
            }
            if (endDate) {
                filter['ads.campinStart'].$lte = endDate.toISOString();
            }
        }

        if (minClicks !== undefined) {
            filter['ads.clicked'] = { $gte: minClicks };
        }

        if (minViews !== undefined) {
            filter['ads.viewed'] = { $gte: minViews };
        }

        // Get total count for pagination
        const totalDocs = await this.adsModel.countDocuments(filter);
        const totalPages = Math.ceil(totalDocs / limit);

        // Get paginated and filtered results
        const ads = await this.adsModel.find(
            filter,
            { __v: 0, createdAt: 0 }
        )
            .skip(skip)
            .limit(limit)
            .lean();

        if (!ads || ads.length === 0) {
            throw new HttpException('No ads found', HttpStatus.NOT_FOUND);
        }

        return {
            data: ads,
            pagination: {
                total: totalDocs,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    }


    async getAd(id: string) {
        const ad = await this.adsModel.findOne(new mongoose.Types.ObjectId(id), { _id: 0, __v: 0, createdAt: 0 }).lean();

        if (!ad) {
            throw new HttpException('No ad found', HttpStatus.NOT_FOUND);
        }

        return ad;
    }


    async updateAds(id: string, updateAdsDto: UpdateAdsDto) {
        const updatedAd = await this.adsModel.findByIdAndUpdate(
            id,
            { $set: updateAdsDto }, // Partial update
            { new: true, runValidators: true } // Return updated doc & validate fields
        );

        if (!updatedAd) {
            throw new HttpException('Ad not found', HttpStatus.NOT_FOUND);
        }

        return updatedAd;
    }

    async deleteAds(id: string) {
        const deletedAd = await this.adsModel.findByIdAndDelete(id);

        if (!deletedAd) {
            throw new HttpException('Ad not found', HttpStatus.NOT_FOUND);
        }

        return { message: 'Ad deleted successfully', deletedAd };
    }

    async getAndIncrementAds(id: string, imageIndex: number) {
        const ads = await this.adsModel.findById(id);

        if (!ads) {
            throw new HttpException('Ads not found', HttpStatus.NOT_FOUND);
        }

        if (imageIndex < 0 || imageIndex >= ads.ads.length) {
            throw new HttpException('Invalid image index', HttpStatus.BAD_REQUEST);
        }

        // Increment `clicked` and `viewed` for the Ads document
        ads.clicked += 1;
        ads.viewed += 1;

        // Increment `clicked` and `viewed` for the specific AdsImage at `imageIndex`
        ads.ads[imageIndex].clicked += 1;
        ads.ads[imageIndex].viewed += 1;

        await ads.save(); // Save the updated document

        return ads.toObject({
            versionKey: false, // Removes __v
            transform: (_, ret) => {
                delete ret._id; // Removes _id
                delete ret.createdAt;
                delete ret.updatedAt;
            }
        });
    }



    async adminFeed(): Promise<DashboardStats> {
        try {
            // Get Ads statistics
            const adsStats = await this.adsModel.aggregate([
                { $unwind: "$ads" },
                {
                    $group: {
                        _id: null,
                        totalAds: { $sum: 1 },
                        totalClicked: { $sum: "$ads.clicked" },
                        totalViewed: { $sum: "$ads.viewed" }
                    }
                }
            ]);

            // Get total users and their subscription breakdown
            const userStats = await this.userModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalUsers: { $sum: 1 },
                        subscribedUsers: { $sum: { $cond: [{ $eq: ["$subscribed", true] }, 1, 0] } },
                        unsubscribedUsers: { $sum: { $cond: [{ $eq: ["$subscribed", false] }, 1, 0] } }
                    }
                }
            ]);

            // Get total bookings and total items
            const totalBookings = await this.bookingModel.countDocuments();
            const totalItems = await this.itemModel.countDocuments();

            // Get the latest 10 notifications
            const notifications = await this.notificationModel
                .find()
                .sort({ createdAt: -1 })
                .limit(10)
                .lean();

            return {
                adsStats: adsStats[0] || { totalAds: 0, totalClicked: 0, totalViewed: 0 },
                userStats: userStats[0] || { totalUsers: 0, subscribedUsers: 0, unsubscribedUsers: 0 },
                totalBookings,
                totalItems,
                notifications
            };
        } catch (error) {
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
