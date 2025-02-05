import { Module } from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import { EcommerceController } from './ecommerce.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { Article, ArticleSchema } from './schema/article.schema';
import { OrderService } from './order.service';
import { ArticleService } from './article.service';

@Module({
  controllers: [EcommerceController],
  providers: [EcommerceService, OrderService, ArticleService],
  imports: [MongooseModule.forFeature(
    [{ name: Order.name, schema: OrderSchema },
    { name: Article.name, schema: ArticleSchema }])]
})
export class EcommerceModule { }
