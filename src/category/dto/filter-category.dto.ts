import { IsOptional, IsString, IsBoolean } from 'class-validator'

export class FilterCategoryDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  subName?: string

  @IsOptional()
  @IsBoolean()
  hasSubType?: boolean
}
