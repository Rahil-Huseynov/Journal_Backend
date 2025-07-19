import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNewsImageDto {
  @IsOptional()     
  @IsString()
  image?: string;

  @Type(() => Number)
  @IsInt()
  newsId: number;
}
