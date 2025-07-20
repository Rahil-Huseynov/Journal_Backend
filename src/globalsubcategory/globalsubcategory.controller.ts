import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';  // <-- Dəyişdi
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GlobalsubcategoryService } from './globalsubcategory.service';
import { CreateGlobalsubcategoryDto } from './dto/create-globalsubcategory.dto';
import { UpdateGlobalsubcategoryDto } from './dto/update-globalsubcategory.dto';
import { AdminGuard } from 'src/auth/guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('globalsubcategory')
export class GlobalsubcategoryController {
  constructor(private readonly globalsubcategoryService: GlobalsubcategoryService) { }

  @Get()
  findAll() {
    return this.globalsubcategoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const item = await this.globalsubcategoryService.findOne(id);
    if (!item) {
      throw new NotFoundException('GlobalSubCategory not found');
    }
    return item;
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/globalsubcategory',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + extname(file.originalname));
          },
        }),
      }
    ),
  )
  async create(
    @Body() body: CreateGlobalsubcategoryDto,
    @UploadedFiles() files: { file?: Express.Multer.File[]; image?: Express.Multer.File[] },
  ) {
    const fileName = files.file?.[0]?.filename ?? null;
    const imageName = files.image?.[0]?.filename ?? null;
    return this.globalsubcategoryService.create(body, imageName, fileName);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/globalsubcategory',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + extname(file.originalname));
          },
        }),
      }
    ),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGlobalsubcategoryDto,
    @UploadedFiles() files: { file?: Express.Multer.File[]; image?: Express.Multer.File[] },
  ) {
    const fileName = files.file?.[0]?.filename ?? null;
    const imageName = files.image?.[0]?.filename ?? null;

    return this.globalsubcategoryService.update(id, body, fileName, imageName);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.globalsubcategoryService.remove(id);
  }
}
