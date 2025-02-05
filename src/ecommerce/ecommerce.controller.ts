import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import { OrderService } from './order.service';
import { ArticleService } from './article.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('ecommerce')
export class EcommerceController {
  constructor(
    private readonly ecommerceService: EcommerceService,
    private readonly orderService: OrderService,
    private readonly articleService: ArticleService
  ) {}


  @Post('orders')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }




  @Delete('orders/:id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }


  @Post('articles')
  createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get('articles')
  getAllArticles() {
    return this.articleService.findAll();
  }

  @Get('articles/:id')
  getArticleById(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Patch('articles/:id')
  updateArticle(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete('articles/:id')
  deleteArticle(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
