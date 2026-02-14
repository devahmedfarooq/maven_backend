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
  clicked?: { $gte: number };
  viewed?: { $gte: number };
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
        const { page = 1, limit = 10, title, startDate, endDate, minClicks, minViews, activeOnly = false } = query;
        const skip = (page - 1) * limit;

        // Build filter conditions
        const filter: AdsFilter = {};

        // Note: Since we're flattening the data, we need to filter on the nested ads array
        // and then flatten the results. For now, we'll remove these filters to get all ads.
        // TODO: Implement proper filtering for flattened structure

        if (minClicks !== undefined) {
            filter.clicked = { $gte: minClicks };
        }

        if (minViews !== undefined) {
            filter.viewed = { $gte: minViews };
        }

        // Get total count depending on activeOnly
        const totalAgg = await this.adsModel.aggregate([
            { $unwind: "$ads" },
            ...(activeOnly ? [{ $match: { "ads.active": true } }] : []),
            { $count: "total" }
        ]);
        
        const totalDocs = totalAgg[0]?.total || 0;
        const totalPages = Math.ceil(totalDocs / limit);

        console.log(`Total ads documents found: ${totalDocs}`);

        // Get paginated and filtered results
        const ads = await this.adsModel.find(
            filter,
            { __v: 0, createdAt: 0 }
        )
            .skip(skip)
            .limit(limit)
            .lean();

        console.log(`Retrieved ${ads.length} ads documents:`, ads);

        // Debug: Log all ads to see their active status
        console.log('All ads before filtering:');
        ads.forEach(adDoc => {
            console.log(`Document ${adDoc._id}:`);
            if (adDoc.ads && adDoc.ads.length > 0) {
                adDoc.ads.forEach((ad: any, index: number) => {
                    console.log(`  Ad[${index}]: title="${ad.title}", active=${ad.active}, hasActiveField=${ad.hasOwnProperty('active')}`);
                });
            } else {
                console.log(`  No ads array or empty ads array`);
            }
        });

        // Flatten the ads array for client consumption. If activeOnly=true, filter for active ads
        const flattenedAds = ads.flatMap(adDoc => 
            (activeOnly ? adDoc.ads.filter((ad: any) => ad.active === true) : adDoc.ads)
                .map((ad: any, index: number) => ({
                    _id: adDoc._id,
                    imgSrc: ad.imgSrc,
                    title: ad.title,
                    href: ad.href,
                    campinStart: ad.campinStart,
                    active: ad.active,
                    clicked: ad.clicked || 0,
                    viewed: ad.viewed || 0,
                    imageIndex: index
                }))
        );

        // Debug: Log all ads to see their active status
        console.log('All ads before filtering:');
        ads.forEach(adDoc => {
            adDoc.ads.forEach((ad: any, index: number) => {
                console.log(`Ad ${adDoc._id}[${index}]: title="${ad.title}", active=${ad.active}`);
            });
        });

        console.log(`Flattened ${flattenedAds.length} ads:`, flattenedAds);

        // Check if we have any flattened ads
        if (!flattenedAds || flattenedAds.length === 0) {
            return {
                data: [],
                pagination: {
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPrevPage: false
                }
            };
        }

        return {
            data: flattenedAds,
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

    async getAdsForAdmin(query: GetAdsDto) {
        const { page = 1, limit = 10, title, startDate, endDate, minClicks, minViews } = query;
        const skip = (page - 1) * limit;

        // Build filter conditions
        const filter: AdsFilter = {};

        if (minClicks !== undefined) {
            filter.clicked = { $gte: minClicks };
        }

        if (minViews !== undefined) {
            filter.viewed = { $gte: minViews };
        }

        // Get total count for admin (all ads)
        const totalDocs = await this.adsModel.countDocuments(filter);
        const totalPages = Math.ceil(totalDocs / limit);

        console.log(`Total ads documents found for admin: ${totalDocs}`);

        // Get paginated and filtered results
        const ads = await this.adsModel.find(
            filter,
            { __v: 0, createdAt: 0 }
        )
            .skip(skip)
            .limit(limit)
            .lean();

        console.log(`Retrieved ${ads.length} ads documents for admin:`, ads);

        // Return raw structure for admin panel (no flattening)
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

    async getAllAds() {
        // Get all ads without filtering for active status
        const ads = await this.adsModel.find({}, { __v: 0, createdAt: 0 }).lean();

        console.log(`Retrieved ${ads.length} ads documents for debugging:`, ads);

        // Flatten all ads (including inactive ones)
        const flattenedAds = ads.flatMap(adDoc => 
            adDoc.ads.map((ad: any, index: number) => ({
                _id: adDoc._id,
                imgSrc: ad.imgSrc,
                title: ad.title,
                href: ad.href,
                campinStart: ad.campinStart,
                active: ad.active,
                clicked: ad.clicked || 0,
                viewed: ad.viewed || 0,
                imageIndex: index
            }))
        );

        console.log(`Flattened ${flattenedAds.length} ads (including inactive):`, flattenedAds);

        return {
            data: flattenedAds,
            total: flattenedAds.length
        };
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

    async trackAdView(id: string, imageIndex: number) {
        const ads = await this.adsModel.findById(id);

        if (!ads) {
            throw new HttpException('Ads not found', HttpStatus.NOT_FOUND);
        }

        if (imageIndex < 0 || imageIndex >= ads.ads.length) {
            throw new HttpException('Invalid image index', HttpStatus.BAD_REQUEST);
        }

        // Increment only `viewed` for the Ads document
        ads.viewed += 1;

        // Increment only `viewed` for the specific AdsImage at `imageIndex`
        ads.ads[imageIndex].viewed += 1;

        await ads.save(); // Save the updated document

        return { success: true, message: 'Ad view tracked successfully' };
    }

    async trackAdClick(id: string, imageIndex: number) {
        const ads = await this.adsModel.findById(id);

        if (!ads) {
            throw new HttpException('Ads not found', HttpStatus.NOT_FOUND);
        }

        if (imageIndex < 0 || imageIndex >= ads.ads.length) {
            throw new HttpException('Invalid image index', HttpStatus.BAD_REQUEST);
        }

        // Increment only `clicked` for the Ads document
        ads.clicked += 1;

        // Increment only `clicked` for the specific AdsImage at `imageIndex`
        ads.ads[imageIndex].clicked += 1;

        await ads.save(); // Save the updated document

        return { success: true, message: 'Ad click tracked successfully' };
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
