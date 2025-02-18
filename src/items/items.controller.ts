import { Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { UpdateItemDto } from './dto/updateItem.dto';
import { CreateItemDto } from './dto/createItem.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }


  @Get('/')
  async getItems(@Query('page') page: number, @Query('limit') limit: number, @Query('type') type?: string, @Query('search') search?: string, @Query('price') price?: string, @Query('rating') rating?: string) {
    return await this.itemsService.getItems(page, limit, type, search, rating, price)
  }

  @Get('/feed')
  async getFeed() {
    return await this.itemsService.getTopItems()
  }

  @Get('/:id')
  async getItem(@Param('id') id: string) {
    return await this.itemsService.getItem(id)
  }




  @Patch('/:id')
  async update(id: string, updateItemDto: UpdateItemDto) {
    return this.itemsService.updateItem(id, updateItemDto)
  }

  @Post('/')
  async create(createItemDto: CreateItemDto) {
    return await this.itemsService.createItem(createItemDto)
  }

  @Delete('/:id')
  async delItem(@Param('id') id: string) {
    return await this.itemsService.deleteItem(id)
  }



}
