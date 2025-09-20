import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schema/Items.schema';
import { MainCategory, MainCategorySchema } from '../category/schemas/category.schema';
import { PricingService } from './pricing.service';
import { TypeFieldMigrationService } from './fix-type-field.migration';
import { RemoveKeyvalueMigrationService } from './remove-keyvalue.migration';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, PricingService, TypeFieldMigrationService, RemoveKeyvalueMigrationService],
  imports: [MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }, {name:MainCategory.name, schema: MainCategorySchema}])]
})
export class ItemsModule { }
