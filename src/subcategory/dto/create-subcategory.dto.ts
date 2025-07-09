import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateSubCategoryDto {
  @IsOptional()
  @IsString()
  title_az?: string;

  @IsOptional()
  @IsString()
  title_en?: string;

  @IsOptional()
  @IsString()
  title_ru?: string;

  @IsOptional()
  @IsString()
  description_az?: string;

  @IsOptional()
  @IsString()
  description_en?: string;

  @IsOptional()
  @IsString()
  description_ru?: string;

  @IsOptional()
  @IsString()
  Status?: string;

  @Type(() => Number)
  @IsNumber()
  categoryId?: number;


  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  requireCount?: number;
}
