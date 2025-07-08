import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SubCategoryController } from './subcategory.controller';
import { SubCategoryService } from './subcategory.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/subcategory',
        filename: (_, file, cb) => {
          const name = `${Date.now()}${extname(file.originalname)}`;
          cb(null, name);
        },
      }),
    }),
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
