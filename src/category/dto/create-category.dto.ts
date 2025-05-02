import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested, IsArray, ArrayNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class MainCategory {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsBoolean()
  @IsOptional()
  hasSubType?: boolean
}

export class Subcategories extends MainCategory {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  subName: string[] // Always an array (better consistency)
}

export class CreateCategoryDto {
  @ValidateNested()
  @Type(() => MainCategory)
  category: MainCategory
}

export class CreateSubCategoryDto {
  @ValidateNested()
  @Type(() => Subcategories)
  category: Subcategories
}
