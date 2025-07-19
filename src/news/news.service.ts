import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) { }

  getAll() {
    return this.prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
      },
    });
  }

  async getById(id: number) {
    const news = await this.prisma.news.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });
    if (!news) throw new NotFoundException('Xəbər tapılmadı');
    return news;
  }

  create(dto: CreateNewsDto) {
    return this.prisma.news.create({ data: dto });
  }

  async update(id: number, dto: UpdateNewsDto) {
    await this.getById(id);
    return this.prisma.news.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    await this.getById(id);
    await this.prisma.newsImage.deleteMany({
      where: { newsId: id },
    });
    return this.prisma.news.delete({ where: { id } });
  }

}
