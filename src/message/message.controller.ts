import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AdminGuard } from 'src/auth/guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('messages')
export class MessageController {
  constructor(private readonly prisma: PrismaService) { }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post()
  async create(@Body() dto: CreateMessageDto) {
    const userJournal = await this.prisma.userJournal.findUnique({
      where: { id: dto.userJournalId },
    });

    if (!userJournal) {
      throw new NotFoundException('UserJournal tapılmadı');
    }

    return this.prisma.messages.create({
      data: {
        problems: dto.problems,
        userJournalId: dto.userJournalId,
      },
    });
  }

  @Get()
  async findAll() {
    return this.prisma.messages.findMany({
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
    const message = await this.prisma.messages.findUnique({
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
