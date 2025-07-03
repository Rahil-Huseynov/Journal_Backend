import { IsOptional, IsString, IsInt } from 'class-validator';

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
  description?: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  file: string;

  @IsInt()
  categoryId: number; 
}