import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: number) {
    const news = await this.prisma.news.findUnique({ where: { id } });
    if (!news) throw new NotFoundException('Xəbər tapılmadı');
    return news;
  }

  async create(dto: CreateNewsDto) {
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
    return this.prisma.news.delete({ where: { id } });
  }
}
