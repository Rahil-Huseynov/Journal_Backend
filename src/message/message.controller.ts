import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly prisma: PrismaService) { }
  @Post()
  async create(@Body() dto: CreateMessageDto) {
    const userJournal = await this.prisma.userJournal.findUnique({
      where: { id: dto.userJournalId },
    });

    if (!userJournal) {
      throw new NotFoundException('UserJournal tapılmadı');
    }

    return this.prisma.message.create({
      data: {
        problems: dto.problems,
        userJournalId: dto.userJournalId,
      },
    });
  }

  @Get()
  async findAll() {
    return this.prisma.message.findMany({
      include: {
        userJournal: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: Number(id) },
      include: {
        userJournal: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message tapılmadı');
    }

    return message;
  }
}
