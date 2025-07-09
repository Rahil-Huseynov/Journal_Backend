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
} from '@nestjs/common';
import { SubCategoryService } from './subcategory.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

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



  @Post('add')
  @UseInterceptors(AnyFilesInterceptor())
  async create(@Body() body: CreateSubCategoryDto) {
    return this.subCategoryService.create(body);
  }

  @Put('update/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.deleteSubCategory(id);
  }

}
