import { IsOptional, IsString, IsBoolean } from 'class-validator'

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsBoolean()
  hasSubType?: boolean

  @IsOptional()
  @IsString({ each: true })
  subName?: string[]

  @IsOptional()
  @IsString()
  icon?: string
}
