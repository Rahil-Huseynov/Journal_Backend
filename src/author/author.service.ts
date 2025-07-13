import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.author.findMany();
  }

  async findOne(id: number) {
    const author = await this.prisma.author.findUnique({ where: { id } });
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  async create(dto: CreateAuthorDto) {
    const connectCategories = dto.categoryIds?.map(id => ({ id })) || [];
    return this.prisma.author.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        about: dto.about,
        categories: {
          connect: connectCategories,
        },

      },
    });
  }

  async update(id: number, dto: UpdateAuthorDto) {
    const author = await this.findOne(id);

    return this.prisma.author.update({
      where: { id },
      data: {
        firstName: dto.firstName ?? author.firstName,
        lastName: dto.lastName ?? author.lastName,
        about: dto.about ?? author.about,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.author.delete({ where: { id } });
  }
}
