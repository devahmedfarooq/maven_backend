import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './schema/Items.schema';

@Injectable()
export class RemoveKeyvalueMigrationService {
    constructor(
        @InjectModel(Item.name) private itemModel: Model<Item>
    ) {}

    async removeKeyvalueField() {
        console.log('Starting keyvalue field removal migration...');
        
        try {
            // First, let's see what we're working with
            const itemsWithKeyvalue = await this.itemModel.find({
                keyvalue: { $exists: true }
            }).exec();
            
            console.log(`Found ${itemsWithKeyvalue.length} items with keyvalue field`);
            
            // Try a more direct approach - update each document individually
            let updatedCount = 0;
            for (const item of itemsWithKeyvalue) {
                try {
                    // Remove the keyvalue field from this specific document
                    const result = await this.itemModel.updateOne(
                        { _id: item._id },
                        { $unset: { keyvalue: 1 } }
                    );
                    
                    if (result.modifiedCount > 0) {
                        updatedCount++;
                        console.log(`Removed keyvalue from item ${item._id}`);
                    }
                } catch (error) {
                    console.error(`Failed to update item ${item._id}:`, error);
                }
            }
            
            console.log(`Migration completed. Updated ${updatedCount} items.`);
            
            return {
                success: true,
                updatedCount,
                message: `Successfully removed keyvalue field from ${updatedCount} items.`
            };
        } catch (error) {
            console.error('Migration failed:', error);
            return {
                success: false,
                error: error.message,
                message: 'Failed to remove keyvalue field.'
            };
        }
    }

    async validateKeyvalueRemoval() {
        console.log('Validating keyvalue field removal...');
        
        try {
            // Check if any items still have keyvalue field
            const itemsWithKeyvalue = await this.itemModel.find({
                keyvalue: { $exists: true }
            }).exec();
            
            const totalItems = await this.itemModel.countDocuments({});
            
            console.log(`Found ${itemsWithKeyvalue.length} items with keyvalue field out of ${totalItems} total items.`);
            
            if (itemsWithKeyvalue.length > 0) {
                console.log('Items with keyvalue field:', itemsWithKeyvalue.map(item => ({
                    id: item._id,
                    keyvalue: (item as any).keyvalue
                })));
            }
            
            return {
                itemsWithKeyvalue: itemsWithKeyvalue.length,
                totalItems,
                allRemoved: itemsWithKeyvalue.length === 0,
                message: itemsWithKeyvalue.length === 0 
                    ? 'All keyvalue fields have been removed successfully.'
                    : `${itemsWithKeyvalue.length} items still have keyvalue field.`
            };
        } catch (error) {
            console.error('Validation failed:', error);
            return {
                success: false,
                error: error.message,
                message: 'Failed to validate keyvalue field removal.'
            };
        }
    }
} 