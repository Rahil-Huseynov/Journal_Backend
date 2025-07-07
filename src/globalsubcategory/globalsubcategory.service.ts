import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGlobalsubcategoryDto } from './dto/create-globalsubcategory.dto';
import { UpdateGlobalsubcategoryDto } from './dto/update-globalsubcategory.dto';

@Injectable()
export class GlobalsubcategoryService {
  constructor(private prisma: PrismaService) { }

  findAll() {
    return this.prisma.globalSubCategory.findMany({
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.globalSubCategory.findUnique({
      where: { id },
    });
  }

  create(dto: CreateGlobalsubcategoryDto, fileName: string | null) {
    return this.prisma.globalSubCategory.create({
      data: {
        title_az: dto.title_az,
        title_en: dto.title_en,
        title_ru: dto.title_ru,
        description_az: dto.description_az,
        description_en: dto.description_en,
        description_ru: dto.description_ru,
        file: fileName || '',
        categoryId: dto.categoryId,
        subCategoryId: dto.subCategoryId,
      },
    });
  }

  async update(id: number, dto: UpdateGlobalsubcategoryDto, filename: string | null = null) {
    const existing = await this.prisma.globalSubCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('GlobalSubCategory tapılmadı');

    const data: any = {
      title_az: dto.title_az,
      title_en: dto.title_en,
      title_ru: dto.title_ru,
      description_az: dto.description_az,
      description_en: dto.description_en,
      description_ru: dto.description_ru,
      categoryId: dto.categoryId,
    };

    if (filename) {
      data.file = filename;
    }

    return this.prisma.globalSubCategory.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.globalSubCategory.delete({
      where: { id },
    });
  }
}
