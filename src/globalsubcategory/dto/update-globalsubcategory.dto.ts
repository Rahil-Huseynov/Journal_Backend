import { PartialType } from '@nestjs/mapped-types';
import { CreateGlobalsubcategoryDto } from './create-globalsubcategory.dto';

export class UpdateGlobalsubcategoryDto extends PartialType(CreateGlobalsubcategoryDto) {}