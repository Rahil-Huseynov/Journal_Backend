import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator';

export class CreateAuthorDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  workplace?: string;

  @IsOptional()
  @IsString()
  academicdegree?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}
