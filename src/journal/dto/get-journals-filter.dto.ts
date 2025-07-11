import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetJournalsFilterDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumberString()
  subCategoryId?: string;
}
