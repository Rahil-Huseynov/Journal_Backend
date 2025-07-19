import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { NewsImageController } from './newsImage.controller';
import { NewsImageService } from './newsImage.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/news',
        filename: (_req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
          cb(null, uniqueName);
        },
      }),
    }),
  ],
  controllers: [NewsImageController],
  providers: [NewsImageService],
  exports: [NewsImageService],
})
export class NewsImageModule {}
