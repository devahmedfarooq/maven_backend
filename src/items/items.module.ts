import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schema/Items.schema';
import { MainCategory, MainCategorySchema } from '../category/schemas/category.schema'
@Module({
  controllers: [ItemsController],
  providers: [ItemsService],
  imports: [MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }, {name:MainCategory.name, schema: MainCategorySchema}])]
})
export class ItemsModule { }
