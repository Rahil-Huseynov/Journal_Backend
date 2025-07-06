import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/category',
    }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
