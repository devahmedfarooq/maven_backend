import { Controller, Get, Param, Query } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }


  @Get('/')
  async getItems(@Query('page') page: number, @Query('limit') limit: number, @Query('type') type?: string) {
    return await this.itemsService.getItems(page, limit, type)
  }

  @Get('/:id')
  async getItem(@Param('id') id: string) {
    return await this.itemsService.getItem(id)
  }
  
  @Get('/feed')
  async getFeed() {
    return await this.itemsService.getTopItems()
  }




}
