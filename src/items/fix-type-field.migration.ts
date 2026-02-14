import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './schema/Items.schema';
import { MainCategory } from '../category/schemas/category.schema';

@Injectable()
export class TypeFieldMigrationService {
    constructor(
        @InjectModel(Item.name) private readonly itemModel: Model<Item>,
        @InjectModel(MainCategory.name) private readonly mainCategoryModel: Model<MainCategory>
    ) {}

    async fixTypeFieldInconsistencies() {
        console.log('Starting type field migration...');
        
        // Get all items
        const items = await this.itemModel.find({}).exec();
        console.log(`Found ${items.length} items to process`);
        
        let updatedCount = 0;
        let errorCount = 0;
        
        for (const item of items) {
            try {
                let needsUpdate = false;
                let newTypeValue = item.type;
                
                // Check if type is a string (category name) instead of ObjectId
                if (typeof item.type === 'string' && !(item.type as string).match(/^[0-9a-fA-F]{24}$/)) {
                    console.log(`Item ${item._id}: type is string "${item.type}", converting to ObjectId`);
                    
                    // Find category by name
                    const category = await this.mainCategoryModel.findOne({
                        name: { $regex: new RegExp(`^${item.type}$`, 'i') }
                    });
                    
                    if (category) {
                        newTypeValue = category._id;
                        needsUpdate = true;
                        console.log(`Found category: ${category.name} (${category._id})`);
                    } else {
                        console.error(`Category not found for name: "${item.type}"`);
                        errorCount++;
                        continue;
                    }
                }
                
                // Update item if needed
                if (needsUpdate) {
                    await this.itemModel.updateOne(
                        { _id: item._id },
                        { $set: { type: newTypeValue } }
                    );
                    updatedCount++;
                    console.log(`Updated item ${item._id}`);
                }
                
            } catch (error) {
                console.error(`Error processing item ${item._id}:`, error);
                errorCount++;
            }
        }
        
        console.log(`Migration completed. Updated: ${updatedCount}, Errors: ${errorCount}`);
        return { updatedCount, errorCount };
    }
    
    async validateTypeFieldConsistency() {
        console.log('Validating type field consistency...');
        
        const items = await this.itemModel.find({}).exec();
        const categories = await this.mainCategoryModel.find({}).exec();
        
        const categoryIds = categories.map(c => c._id.toString());
        const categoryNames = categories.map(c => c.name.toLowerCase());
        
        let validItems = 0;
        let invalidItems = 0;
        let orphanedItems = 0;
        
        for (const item of items) {
            const typeValue = item.type;
            
            if (typeof typeValue === 'string') {
                if ((typeValue as string).match(/^[0-9a-fA-F]{24}$/)) {
                    // Valid ObjectId string
                    if (categoryIds.includes(typeValue)) {
                        validItems++;
                    } else {
                        orphanedItems++;
                        console.log(`Orphaned item ${item._id}: type ObjectId ${typeValue} not found in categories`);
                    }
                } else {
                    // String category name
                    if (categoryNames.includes((typeValue as string).toLowerCase())) {
                        validItems++;
                    } else {
                        invalidItems++;
                        console.log(`Invalid item ${item._id}: type string "${typeValue}" not found in categories`);
                    }
                }
            } else if (typeValue && (typeValue as any).toString) {
                // ObjectId object
                const typeId = (typeValue as any).toString();
                if (categoryIds.includes(typeId)) {
                    validItems++;
                } else {
                    orphanedItems++;
                    console.log(`Orphaned item ${item._id}: type ObjectId ${typeId} not found in categories`);
                }
            } else {
                invalidItems++;
                console.log(`Invalid item ${item._id}: type is ${typeof typeValue} - ${typeValue}`);
            }
        }
        
        console.log(`Validation results: Valid: ${validItems}, Invalid: ${invalidItems}, Orphaned: ${orphanedItems}`);
        return { validItems, invalidItems, orphanedItems };
    }
} 