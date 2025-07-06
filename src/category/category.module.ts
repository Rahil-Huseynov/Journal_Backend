// category.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
          cb(null, uniqueName);
        },
      }),
    }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
