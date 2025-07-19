import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsImageDto } from './create-news-image.dto';

export class UpdateNewsImageDto extends PartialType(CreateNewsImageDto) {}
