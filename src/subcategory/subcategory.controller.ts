// src/subcategory/subcategory.controller.ts
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
} from '@nestjs/common';
import { SubCategoryService } from './subcategory.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto';
import { AdminGuard } from 'src/journal/guard/admin.guard';

@Controller('subcategories')
@UseGuards(AdminGuard)
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  getAll() {
    return this.subCategoryService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.getById(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateSubCategoryDto) {
    return this.subCategoryService.create(dto);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubCategoryDto) {
    return this.subCategoryService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.delete(id);
  }
}
