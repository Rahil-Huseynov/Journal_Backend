import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createMessageDto: CreateMessageDto) {
    const userJournal = await this.prisma.userJournal.findUnique({
      where: { id: createMessageDto.userJournalId },
    });

    if (!userJournal) {
      throw new NotFoundException('UserJournal tapılmadı');
    }

    return this.prisma.messages.create({
      data: {
        problems: createMessageDto.problems,
        userJournalId: createMessageDto.userJournalId,
      },
    });
  }
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
  async findOne(id: number) {
    const message = await this.prisma.messages.findUnique({
      where: { id },
      include: {
        userJournal: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message tapılmadı');
    }

    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    await this.findOne(id);

    return this.prisma.messages.update({
      where: { id },
      data: {
        problems: updateMessageDto.problems,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.messages.delete({
      where: { id },
    });
  }
}
