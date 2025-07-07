import { Module } from '@nestjs/common';
import { GlobalsubcategoryService } from './globalsubcategory.service';
import { GlobalsubcategoryController } from './globalsubcategory.controller';

@Module({
  controllers: [GlobalsubcategoryController],
  providers: [GlobalsubcategoryService],
})
export class GlobalsubcategoryModule {}
