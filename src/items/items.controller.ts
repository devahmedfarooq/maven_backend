import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { UpdateItemDto } from './dto/updateItem.dto';
import { CreateItemDto } from './dto/createItem.dto';
import { TypeFieldMigrationService } from './fix-type-field.migration';
import { RemoveKeyvalueMigrationService } from './remove-keyvalue.migration';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly typeFieldMigrationService: TypeFieldMigrationService,
    private readonly removeKeyvalueMigrationService: RemoveKeyvalueMigrationService
  ) { }


  @Get('/')
  async getItems(@Query('page') page: number, @Query('limit') limit: number, @Query('type') type?: string, @Query('search') search?: string, @Query('price') price?: string, @Query('rating') rating?: string, @Query('location') location?: string) {
    return await this.itemsService.getItems(page, limit, type, search, rating, price, location)
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
  async update(@Param("id") id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.updateItem(id, updateItemDto)
  }

  @Post('/')
  async create(@Body() createItemDto: CreateItemDto) {
    console.log(createItemDto)
    return await this.itemsService.createItem(createItemDto)
  }

  @Delete('/:id')
  async delItem(@Param('id') id: string) {
    return await this.itemsService.deleteItem(id)
  }

  // Migration endpoints
  @Post('/migrate/type-field')
  async migrateTypeField() {
    return await this.typeFieldMigrationService.fixTypeFieldInconsistencies();
  }

  @Get('/validate/type-field')
  async validateTypeField() {
    return await this.typeFieldMigrationService.validateTypeFieldConsistency();
  }

  // Keyvalue removal migration endpoints
  @Post('/migrate/remove-keyvalue')
  async removeKeyvalueField() {
    return await this.removeKeyvalueMigrationService.removeKeyvalueField();
  }

  @Get('/validate/keyvalue-removal')
  async validateKeyvalueRemoval() {
    return await this.removeKeyvalueMigrationService.validateKeyvalueRemoval();
  }
}
