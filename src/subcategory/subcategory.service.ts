import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto';

@Injectable()
export class SubCategoryService {
  constructor(private prisma: PrismaService) { }
  getAll() {
    return this.prisma.subCategory.findMany({
      orderBy: { id: 'desc' },
      include: {
        category: true,
        journals: true,
      },
    });
  }


  getById(id: number) {
    return this.prisma.subCategory.findUnique({
      where: { id },
      include: {
        journals: true,
        category: true,
      },
    });
  }

  async getByIdWithRelations(id: number) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true,
        journals: true,
      },
    });

    if (!subCategory) {
      throw new NotFoundException('SubCategory tapılmadı');
    }

    return {
      ...subCategory,
      requireCount: subCategory.requireCount ?? 0,
    };
  }


  create(dto: CreateSubCategoryDto) {
    return this.prisma.subCategory.create({
      data: {
        title_az: dto.title_az,
        title_en: dto.title_en,
        title_ru: dto.title_ru,
        description_az: dto.description_az,
        description_en: dto.description_en,
        description_ru: dto.description_ru,
        count: 0,
        requireCount: dto.requireCount ?? 0,
        status: dto.Status ?? 'active',
        category: {
          connect: { id: dto.categoryId },
        },
      },
    });
  }

  async update(id: number, dto: UpdateSubCategoryDto) {
    type SubCategoryWithJournals = {
      id: number;
      title_az: string | null;
      title_en: string | null;
      title_ru: string | null;
      description_az: string | null;
      description_en: string | null;
      description_ru: string | null;
      categoryId: number;
      requireCount: number | null;
      count: number | null;
      status: string | null;
      journals: Array<{ id: number; status: string;[key: string]: any }>;
    };

    const exists = await this.prisma.subCategory.findUnique({
      where: { id },
      include: { journals: true },
    }) as SubCategoryWithJournals;

    if (!exists) throw new NotFoundException('SubCategory not found');

    const data: any = {};

    if (dto.title_az !== undefined) data.title_az = dto.title_az;
    if (dto.title_en !== undefined) data.title_en = dto.title_en;
    if (dto.title_ru !== undefined) data.title_ru = dto.title_ru;

    if (dto.description_az !== undefined) data.description_az = dto.description_az;
    if (dto.description_en !== undefined) data.description_en = dto.description_en;
    if (dto.description_ru !== undefined) data.description_ru = dto.description_ru;

    if (dto.requireCount !== undefined) data.requireCount = Number(dto.requireCount);
    if (dto.Status !== undefined) data.status = dto.Status;

    if (dto.categoryId !== undefined) {
      data.category = { connect: { id: dto.categoryId } };
    }
    const updatedSubCategory = await this.prisma.subCategory.update({
      where: { id },
      data,
    });

    for (const sub of exists.journals) {
      await this.updateCountAndStatus(sub.id);
    }
    return updatedSubCategory;
  }



  async checkAndNotifyUserJournals(subCategoryId: number) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id: subCategoryId },
      include: {
        journals: true,
      },
    });

    if (!subCategory) throw new NotFoundException('SubCategory tapılmadı');

    if (subCategory.count >= subCategory.requireCount) {
      const journalsToUpdate = subCategory.journals.filter(
        (journal) => journal.status !== 'finished' && journal.status !== 'rejected'
      );

      for (const journal of journalsToUpdate) {
        await this.prisma.userJournal.update({
          where: { id: journal.id },
          data: {
            message: 'Zəhmət olmasa başqa subcategory seçin.',
            status: 'edit',
          },
        });
      }
    }
  }
  async updateCountAndStatus(subCategoryId: number) {
    const finishedCount = await this.prisma.userJournal.count({
      where: {
        status: 'finished',
        subCategories: {
          some: { id: subCategoryId },
        },
      },
    });

    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id: subCategoryId },
      include: {
        journals: true,
      },
    });

    if (!subCategory) throw new NotFoundException('SubCategory tapılmadı');
    const newStatus =
      finishedCount >= (subCategory.requireCount ?? 0) ? 'blocked' : 'active';
    if (finishedCount >= (subCategory.requireCount ?? 0)) {
      const journalsToReject = subCategory.journals.filter(
        (journal) => journal.status !== 'finished' && journal.status !== 'rejected'
      );

      for (const journal of journalsToReject) {
        await this.prisma.userJournal.update({
          where: { id: journal.id },
          data: {
            status: 'edit',
            message: 'Zəhmət olmasa başqa subcategory seçin',
          },
        });
      }
    }
    return this.prisma.subCategory.update({
      where: { id: subCategoryId },
      data: {
        count: finishedCount,
        status: newStatus,
      },
    });
  }



  async deleteSubCategory(id: number) {
    const exists = await this.prisma.subCategory.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('SubCategory not found');
    return this.prisma.subCategory.delete({ where: { id } });
  }
}
