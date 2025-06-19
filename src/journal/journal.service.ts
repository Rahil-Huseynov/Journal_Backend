import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalDto } from './dto';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  async createUserJournal(userId: number, dto: CreateJournalDto) {
    return this.prisma.userJournal.create({
      data: {
        title: dto.title,
        description: dto.description,
        file: dto.file,
        userId,
        approved: false,
        status: null,
      },
    });
  }

  async getUserJournals(userId: number) {
    return this.prisma.userJournal.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        createdAt: true,
        approved: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnapprovedJournals() {
    return this.prisma.userJournal.findMany({
      where: { approved: false },
      include: { user: true },
    });
  }

  async approveJournal(journalId: number) {
    const journal = await this.prisma.userJournal.findUnique({
      where: { id: journalId },
      include: { user: true },
    });

    if (!journal) throw new NotFoundException('Journal not found');

    await this.prisma.allJournal.create({
      data: {
        title: journal.title,
        description: journal.description,
        file: journal.file,
        userEmail: journal.user.email,
        userName: journal.user.firstName ?? '',
      },
    });

    await this.prisma.userJournal.update({
      where: { id: journalId },
      data: {
        approved: true,
        status: 'Təsdiqləndi',
      },
    });

    return { message: 'Journal approved and added to AllJournal' };
  }

  async rejectJournal(journalId: number) {
    const journal = await this.prisma.userJournal.findUnique({
      where: { id: journalId },
    });

    if (!journal) throw new NotFoundException('Journal not found');

    await this.prisma.userJournal.update({
      where: { id: journalId },
      data: {
        approved: false,
        status: 'Ləğv edildi',
      },
    });

    return { message: 'Journal has been rejected' };
  }

  async getAllApprovedJournals() {
    return this.prisma.allJournal.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
