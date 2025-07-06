import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto';

@Injectable()
export class SubCategoryService {
  constructor(private prisma: PrismaService) { }

  getAll() {
    return this.prisma.subCategory.findMany({
      orderBy: { id: 'desc' },
    });
  }

  getById(id: number) {
    return this.prisma.subCategory.findUnique({
      where: { id },
    });
  }

  create(dto: CreateSubCategoryDto, file?: string) {
    return this.prisma.subCategory.create({
      data: {
        title_az: dto.title_az,
        title_en: dto.title_en,
        title_ru: dto.title_ru,
        description_az: dto.description_az,
        description_en: dto.description_en,
        description_ru: dto.description_ru,
        file: file ?? '',
        category: {
          connect: { id: dto.categoryId },
        },
      },
    },
    )
  }

  async update(id: number, dto: UpdateSubCategoryDto, file?: Express.Multer.File) {
    const exists = await this.prisma.subCategory.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('SubCategory not found');

    const data: any = {
      title_az: dto.title_az,
      title_en: dto.title_en,
      title_ru: dto.title_ru,
      description_az: dto.description_az,
      description_en: dto.description_en,
      description_ru: dto.description_ru,
      category: {
        connect: { id: dto.categoryId },
      },
    };

    if (file) {
      data.file = file.filename;
    }

    return this.prisma.subCategory.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    await this.prisma.subCategory.deleteMany({ where: { categoryId: id } });
    return this.prisma.category.delete({ where: { id } });
  }

}

