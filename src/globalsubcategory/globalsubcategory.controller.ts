import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GlobalsubcategoryService } from './globalsubcategory.service';
import { CreateGlobalsubcategoryDto } from './dto/create-globalsubcategory.dto';
import { UpdateGlobalsubcategoryDto } from './dto/update-globalsubcategory.dto';

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

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/globalsubcategory',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
    }),
  )
  async create(
    @Body() body: CreateGlobalsubcategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const fileName = file ? file.filename : null;
    return this.globalsubcategoryService.create(body, fileName);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/globalsubcategory',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGlobalsubcategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.globalsubcategoryService.update(id, body, file ? file.filename : null);
  }


  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.globalsubcategoryService.remove(id);
  }

}
