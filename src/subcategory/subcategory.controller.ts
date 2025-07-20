import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { SubCategoryService } from './subcategory.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/guard';

const subCategoryStorage = diskStorage({
  destination: './uploads/subcategory',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

@Controller('subcategories')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) { }

  @Get()
  getAll() {
    return this.subCategoryService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.getByIdWithRelations(id);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post('add')
  @UseInterceptors(FileInterceptor('image', { storage: subCategoryStorage }))
  async create(
    @Body() body: CreateSubCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const fileName = file ? file.filename : null;
    const newDto = { ...body, image: fileName };
    return this.subCategoryService.create(newDto);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Put('update/:id')
  @UseInterceptors(FileInterceptor('image', { storage: subCategoryStorage }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const fileName = file ? file.filename : null;
    const updatedDto = { ...dto, image: fileName };
    return this.subCategoryService.update(id, updatedDto);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.deleteSubCategory(id);
  }
}
