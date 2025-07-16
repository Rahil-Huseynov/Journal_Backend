import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) { }


  async getAll() {
    return this.prisma.category.findMany({
      include: {
        subCategories: true,
        authors: true,
        globalSubCategory: {
          include: {
            userJournals: true,
          },
        },
      },
    });
  }

  async getById(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: true,
        globalSubCategory: {
          include: {
            userJournals: true, 
          },
        },
        authors: true,
      },
    });
  }


  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        title_az: dto.title_az,
        title_en: dto.title_en,
        title_ru: dto.title_ru,
        description_az: dto.description_az,
        description_en: dto.description_en,
        description_ru: dto.description_ru,
        image: dto.image || "",
      },
    });
  }

  async update(id: number, body: any) {
    const dataToUpdate: any = {
      firstName: body.firstName,
      lastName: body.lastName,
      about: body.about,
    };

    return this.prisma.author.update({
      where: { id },
      data: dataToUpdate,
    });
  }


  async delete(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
