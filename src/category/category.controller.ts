import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, CreateSubCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {

    return  this.categoryService.create(createCategoryDto);
  }

  @Post('/sub')
  createSubcategories (@Body() createSubcategoriesDto: CreateSubCategoryDto ) {
    return this.categoryService.createSubCategories(createSubcategoriesDto)
  }

  @Get()
  findAll(@Query() filters : FilterCategoryDto) {
    return this.categoryService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query() filters: FilterCategoryDto) {
    return this.categoryService.findOneByIdWithFilters(id, filters)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto)
  }

  @Delete(':id/:name') 
  removeSubname(@Param('id') id: string, @Param('name') name: string) {
    return this.categoryService.removeSubName(id, name);
  }
  
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id)
  }
}
