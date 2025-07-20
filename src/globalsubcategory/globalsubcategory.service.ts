import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGlobalsubcategoryDto } from './dto/create-globalsubcategory.dto';
import { UpdateGlobalsubcategoryDto } from './dto/update-globalsubcategory.dto';

@Injectable()
export class GlobalsubcategoryService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.globalSubCategory.findMany({
      orderBy: { id: 'desc' },
      include: {
        userJournals: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.globalSubCategory.findUnique({
      where: { id },
      include: {
        userJournals: true,
      },
    });
  }

  async create(
    dto: CreateGlobalsubcategoryDto,
    fileName: string | null,
    imageName: string | null,
  ) {
    const subCategoryJournals = await this.prisma.userJournal.findMany({
      where: {
        status: 'finished',
        subCategories: {
          some: { id: dto.subCategoryId },
        },
      },
    });

    return this.prisma.globalSubCategory.create({
      data: {
        title_az: dto.title_az,
        title_en: dto.title_en,
        title_ru: dto.title_ru,
        description_az: dto.description_az,
        description_en: dto.description_en,
        description_ru: dto.description_ru,
        image: imageName || '',
        file: fileName || '',
        categoryId: dto.categoryId,
        subCategoryId: dto.subCategoryId,
        userJournals: {
          connect: subCategoryJournals.map((journal) => ({ id: journal.id })),
        },
      },
      include: {
        userJournals: true,
      },
    });
  }

  async update(
    id: number,
    dto: UpdateGlobalsubcategoryDto,
    fileName: string | null = null,
    imageName: string | null = null,
  ) {
    const existing = await this.prisma.globalSubCategory.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException('GlobalSubCategory tapılmadı');

    const subCategoryJournals = dto.subCategoryId
      ? await this.prisma.userJournal.findMany({
          where: {
            status: 'finished',
            subCategories: {
              some: { id: dto.subCategoryId },
            },
          },
        })
      : [];

    const data: any = {
      title_az: dto.title_az,
      title_en: dto.title_en,
      title_ru: dto.title_ru,
      description_az: dto.description_az,
      description_en: dto.description_en,
      description_ru: dto.description_ru,
      image: imageName ?? dto.image,
      categoryId: dto.categoryId,
      subCategoryId: dto.subCategoryId,
    };

    if (fileName) {
      data.file = fileName;
    }

    if (subCategoryJournals.length > 0) {
      data.userJournals = {
        connect: subCategoryJournals.map((journal) => ({ id: journal.id })),
      };
    }

    return this.prisma.globalSubCategory.update({
      where: { id },
      data,
      include: {
        userJournals: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.globalSubCategory.delete({
      where: { id },
    });
  }
}
