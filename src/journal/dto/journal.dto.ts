import { IsString, IsOptional } from 'class-validator';

export class CreateJournalDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  file: string;  
}
