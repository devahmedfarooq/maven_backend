import { Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import Redis from 'ioredis';
import { updateRatelimitDto } from './dto/updateRateLimit.dto';
import { CreateAdsDto } from './dto/createAds.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ads } from './schema/ads.schema';
import mongoose, { Model } from 'mongoose';
import { UpdateAdsDto } from './dto/updateAds.dto';





@Injectable()
export class AdminService {

  //  private redisClient: Redis;
    constructor(@InjectModel(Ads.name) private readonly adsModel: Model<Ads>) {
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

    async getAds() {
        const ads = await this.adsModel.find({}, { _id: 0, __v: 0, createdAt: 0 }).lean();

        if (!ads || ads.length === 0) {
            throw new HttpException('No ads found', HttpStatus.NOT_FOUND);
        }

        return ads;
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

}
