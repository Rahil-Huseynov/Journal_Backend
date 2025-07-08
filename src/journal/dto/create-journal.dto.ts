import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

export class CreateJournalDto {
  @IsString()
  @IsNotEmpty()
  title_az: string;

  @IsString()
  @IsNotEmpty()
  title_en: string;

  @IsString()
  @IsNotEmpty()
  title_ru: string;

  @IsString()
  @IsNotEmpty()
  description_az: string;

  @IsString()
  @IsNotEmpty()
  description_en: string;

  @IsString()
  @IsNotEmpty()
  description_ru: string;

  @IsString()
  @IsNotEmpty()
  keywords_en: string;

  @IsString()
  @IsNotEmpty()
  keywords_az: string;

  @IsString()
  @IsNotEmpty()
  keywords_ru: string;
  
  @IsString()
  message: string

  @IsString()
  status: string;

  @IsArray()
  categoryIds: number[];

  @IsArray()
  subCategoryIds: number[];

  @IsOptional()
  file?: string;
}
