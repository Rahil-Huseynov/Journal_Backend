import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { SubCategoryService } from './subcategory.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto';
import { AdminGuard } from 'src/journal/guard/admin.guard';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('subcategories')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) { }

  @Get()
  getAll() {
    return this.subCategoryService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.getById(id);
  }

  @Post('add')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads/subcategories',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(@Body() body: any, @UploadedFiles() files: Express.Multer.File[]) {
    const file = files.find((f) => f.fieldname === 'file')?.filename;

    const dto: CreateSubCategoryDto = {
      ...body,
      categoryId: parseInt(body.categoryId, 10),
      description_az: body.description_az,
      description_en: body.description_en,
      description_ru: body.description_ru,
    };

    return this.subCategoryService.create(dto, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.subCategoryService.update(id, dto, file);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.deleteCategory(id);
  }

}
