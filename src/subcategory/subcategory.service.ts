import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto';

@Injectable()
export class SubCategoryService {
  constructor(private prisma: PrismaService) {}

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

  create(dto: CreateSubCategoryDto) {
    return this.prisma.subCategory.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateSubCategoryDto) {
    const exists = await this.prisma.subCategory.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('SubCategory not found');

    return this.prisma.subCategory.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    const exists = await this.prisma.subCategory.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('SubCategory not found');

    return this.prisma.subCategory.delete({
      where: { id },
    });
  }
}
