import { Injectable } from '@nestjs/common';
import { CreateNewsImageDto, UpdateNewsImageDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsImageService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateNewsImageDto) {
    return this.prisma.newsImage.create({
      data: {
        image: dto.image,
        news: { connect: { id: dto.newsId } },
      },
      include: { news: true },
    });
  }

  findAll() {
    return this.prisma.newsImage.findMany({ include: { news: true } });
  }

  findOne(id: number) {
    return this.prisma.newsImage.findUnique({
      where: { id },
      include: { news: true },
    });
  }

  update(id: number, dto: UpdateNewsImageDto) {
    return this.prisma.newsImage.update({
      where: { id },
      data: {
        image: dto.image,
        newsId: dto.newsId,
      },
      include: { news: true },
    });
  }

  remove(id: number) {
    return this.prisma.newsImage.delete({ where: { id } });
  }
}
