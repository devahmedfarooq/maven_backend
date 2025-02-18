import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schema/Items.schema';
import { Model } from 'mongoose';
import { CreateItemDto } from './dto/createItem.dto';
import { UpdateItemDto } from './dto/updateItem.dto';

@Injectable()
export class ItemsService {
    constructor(@InjectModel(Item.name) private readonly itemModel: Model<Item>) { }

    async createItem(createItemDto: CreateItemDto) {

        const item = await (await this.itemModel.create(createItemDto)).save()

        if (!item) {
            throw new HttpException("Error Creating Item", HttpStatus.NOT_IMPLEMENTED)
        }

        return item.toObject({
            versionKey: false,
            transform: (_, ret) => {
                delete ret._id
            }
        })

    }

    async getItems(page: number = 1, limit: number = 10, type?: string, search?: string, rating?: string, price?: string) {
        let filter: any = type ? { type } : {}; // If type is provided, filter by it; otherwise, get all items

        // Add text search if search query is provided
        const sort: any = {};
        if (search) {
            filter.$text = { $search: search };
            sort.score = { $meta: 'textScore' }; // Only apply sorting if text search is used
        }

        // Add rating filter (exact match) if provided
        if (rating !== undefined) {
            filter.reviews = {
                $elemMatch: { rating: Number(rating) } // ✅ At least one review must have the exact rating
            };
        }

        // Add price range filter if price is provided
        if (price !== undefined) {
            filter.price = { 
                $elemMatch: { cost : { $lte:  Number(price) } } // ✅ Checks if at least one cost is <= given price
            };
        }

        // Fetch items from database
        const items = await this.itemModel
            .find(filter, { _id: 0, __v: 0 }) // Exclude _id and __v fields
            .sort(sort).skip((page - 1) * limit) // Skip items for pagination
            .limit(limit) // Limit the number of results
            .exec();

        if (!items || items.length === 0) {
            throw new HttpException('No Items Found', HttpStatus.NOT_FOUND);
        }

        const totalItems = await this.itemModel.countDocuments(filter); // Get total count of items
        const totalPages = Math.ceil(totalItems / limit); // Calculate total pages

        return {
            items,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit,
            },
        };
    }

    async getItem(id: string) {
        const item = await this.itemModel.findById(id, { _id: 0 }).exec()

        if (!item) {
            throw new HttpException("No Item Found", HttpStatus.NOT_FOUND)
        }

        return item
    }


    async updateItem(id: string, updateItemDto: UpdateItemDto) {
        const updatedItem = await this.itemModel.findByIdAndUpdate(
            id,
            { $set: updateItemDto }, // Only update provided fields
            { new: true, runValidators: true } // Return updated document & apply schema validation
        );

        if (!updatedItem) {
            throw new NotFoundException(`Item with ID ${id} not found`);
        }

        return updatedItem.toObject({
            versionKey: false, // Removes __v
            transform: (_, ret) => {
                delete ret._id; // Removes _id
                delete ret.createdAt;
            }
        });
    }



    async deleteItem(id: string) {
        const deletedItem = await this.itemModel.findByIdAndDelete(id);

        if (!deletedItem) {
            throw new NotFoundException(`Item with ID ${id} not found`);
        }

        return { message: `Item with ID ${id} successfully deleted` };
    }


    async getTopItems() {
        try {

            const result = await this.itemModel.aggregate([
                {
                    $addFields: {
                        totalReviews: { $size: { $ifNull: ["$reviews", []] } }
                    }
                },
                {
                    $group: {
                        _id: "$type",
                        items: {
                            $push: {
                                _id: "$_id",
                                totalReviews: "$totalReviews",
                                img: { $arrayElemAt: ["$imgs", 0] },
                                title: "$title",
                                type: "$type",
                                price: "$price",
                                location: "$location"
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        items: { $slice: ["$items", 5] }
                    }
                },
                { $unwind: "$items" },
                {
                    $replaceRoot: { newRoot: "$items" }
                }
            ]);

            if (!result || result.length === 0) {
                throw new HttpException('No items found', HttpStatus.NOT_FOUND);
            }

            return result;

        } catch (error) {
            // Handle Mongoose or aggregation errors
            throw new HttpException(
                error.message || 'Failed to fetch items',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}



