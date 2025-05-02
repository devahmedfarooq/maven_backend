import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MainCategory, MainCategorySchema} from './schemas/category.schema'
@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [MongooseModule.forFeature([
    { name: MainCategory.name, schema: MainCategorySchema },
  ])]
})
export class CategoryModule { }
