import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto, CreateSubCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MainCategory } from './schemas/category.schema'
import { FilterCategoryDto } from './dto/filter-category.dto'

@Injectable()
export class CategoryService {

  constructor(@InjectModel(MainCategory.name) private mainCategoryModel: Model<MainCategory>) {

  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { category } = createCategoryDto
      const checkCategoryExist = await this.mainCategoryModel.findOne({ name: category.name })
      if (!checkCategoryExist) {
        const newMainCategory = await this.mainCategoryModel.create(category)
        return newMainCategory
      }
      return checkCategoryExist
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

  }

  async createSubCategories(createSubCategoriesDto: CreateSubCategoryDto) {
    try {
      const { category } = createSubCategoriesDto

      // Normalize subName to array if it's passed as string
      const subNames = Array.isArray(category.subName)
        ? category.subName
        : [category.subName]

      const updateResult = await this.mainCategoryModel.updateOne(
        { name: category.name },
        {
          $addToSet: { subName: { $each: subNames } }, // 👈 adds only non-existing subNames
          $set: { hasSubType: true },
        },
        { upsert: true }
      )

      return updateResult
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }


  async findAll(filters: FilterCategoryDto) {
    const query: any = {}

    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' } // partial case-insensitive match
    }

    if (filters.subName) {
      query.subName = filters.subName // or use $in, or regex
    }

    if (filters.hasSubType !== undefined) {
      query.hasSubType = filters.hasSubType
    }

    return this.mainCategoryModel.find(query).exec()
  }

  async findOneByIdWithFilters(id: string, filters: FilterCategoryDto) {
    const category = await this.mainCategoryModel.findById(id).exec()

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND)
    }

    if (
      (filters.name && category.name !== filters.name) ||
      (filters.hasSubType !== undefined && category.hasSubType !== filters.hasSubType) ||
      (filters.subName && !category.subName.includes(filters.subName))
    ) {
      throw new HttpException('Category does not match filters', HttpStatus.NOT_FOUND)
    }

    return category
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = await this.mainCategoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true } // return updated document
    )
  
    if (!updatedCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND)
    }
  
    return updatedCategory
  }

  async remove(id: string) {
    const deleted = await this.mainCategoryModel.findByIdAndDelete(id)
  
    if (!deleted) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND)
    }
  
    return { message: 'Category deleted successfully', id }
  }

  async removeSubName(id: string, subNameToRemove: string) {
    const updated = await this.mainCategoryModel.findByIdAndUpdate(
      id,
      {
        $pull: { subName: subNameToRemove },
      },
      { new: true }
    );
  
    if (!updated) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
  
    return { message: 'SubName removed successfully', data: updated };
  }
}
