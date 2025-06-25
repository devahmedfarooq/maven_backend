import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schema/Items.schema';
import { Model } from 'mongoose';
import { CreateItemDto } from './dto/createItem.dto';
import { UpdateItemDto } from './dto/updateItem.dto';
import { MainCategory } from 'src/category/schemas/category.schema';

@Injectable()
export class ItemsService {
    constructor(@InjectModel(Item.name) private readonly itemModel: Model<Item>, @InjectModel(MainCategory.name) private readonly mainCategoryModel: Model<MainCategory>) { }

    async createItem(createItemDto: CreateItemDto) {
        //console.log("ITEMS ",createItemDto)
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
        console.log("Category : ", type)
        if (type) {
            const category = await this.mainCategoryModel.findOne({
                name: { $regex: new RegExp(`^${type}$`, 'i') }, // Case-insensitive match
            }); console.log("Category : ", category)
            if (!category) {
                throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
            }
            filter.type = category._id.toString(); // Now filter by the found category's ID
        }

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
                $elemMatch: { cost: { $lte: Number(price) } } // ✅ Checks if at least one cost is <= given price
            };
        }

        console.log("Filter", filter)

        // Fetch items from database
        const items = await this.itemModel
            .find(filter, { __v: 0 }) // Exclude _id and __v fields
            .sort(sort).skip((page - 1) * limit) // Skip items for pagination
            .limit(limit) // Limit the number of results
            .populate('type')
            .exec();
        console.log("Items : ", items)
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
        const item = await this.itemModel.findById(id).populate('type').exec()

        if (!item) {
            throw new HttpException("No Item Found", HttpStatus.NOT_FOUND)
        }

        return item
    }


    async updateItem(id: string, updateItemDto: UpdateItemDto) {
        //  console.log(updateItemDto)
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
                        totalReviews: { $size: { $ifNull: ["$reviews", []] } },
                        typeObjId: {
                            $convert: {
                                input: "$type",
                                to: "objectId",
                                onError: null,
                                onNull: null
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "maincategories",
                        localField: "typeObjId",
                        foreignField: "_id",
                        as: "type"
                    }
                },
                { $unwind: "$type" },
                {
                    $group: {
                        _id: "$type.name",
                        items: {
                            $push: {
                                _id: "$_id",
                                totalReviews: "$totalReviews",
                                img: { $arrayElemAt: ["$imgs", 0] },
                                title: "$title",
                                type: "$type.name",
                                price: "$price",
                                location: "$location"
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        k: "$_id",
                        v: { $slice: ["$items", 5] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        kvPairs: { $push: { k: "$k", v: "$v" } }
                    }
                },
                { $replaceWith: { $arrayToObject: "$kvPairs" } }
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



