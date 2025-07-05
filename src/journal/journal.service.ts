import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalDto } from './dto';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) { }

  async createJournal(dto: CreateJournalDto, userId: number) {
    let filePath = '';
    if (dto.file) {
      filePath = '/uploads/' + dto.file;
    }

    const journal = await this.prisma.userJournal.create({
      data: {
        title_az: dto.title_az,
        title_en: dto.title_en,
        title_ru: dto.title_ru,
        description_az: dto.description_az,
        description_en: dto.description_en,
        description_ru: dto.description_ru,
        keywords_az: dto.keywords_az,
        keywords_en: dto.keywords_en,
        keywords_ru: dto.keywords_ru,
        status: dto.status,
        file: filePath,
        userId: userId,
        category: {
          connect: dto.categoryIds.map((id) => ({ id })),
        },
        subCategories: {
          connect: dto.subCategoryIds.map((id) => ({ id })),
        },
        approved: false,
      },
    });

    return journal;
  }

  async getUserJournals(userId: number) {
    return this.prisma.userJournal.findMany({
      where: { userId },
      select: {
        id: true,
        title_az: true,
        title_en: true,
        title_ru: true,
        description_az: true,
        description_en: true,
        description_ru: true,
        keywords_az: true,
        keywords_en: true,
        keywords_ru: true,
        file: true,
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
        title_az: journal.title_az,
        title_en: journal.title_en,
        title_ru: journal.title_ru,
        description_az: journal.description_az,
        description_en: journal.description_en,
        description_ru: journal.description_ru,
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
  async getAllJournals() {
    return this.prisma.userJournal.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteUserJournal(journalId: number, userId: number, isAdmin: boolean = false) {
    const journal = await this.prisma.userJournal.findUnique({
      where: { id: journalId },
    });

    if (!journal) throw new NotFoundException('Journal not found');

    if (!isAdmin && journal.userId !== userId) {
      throw new NotFoundException('You are not authorized to delete this journal');
    }

    return this.prisma.userJournal.delete({
      where: { id: journalId },
    });
  }



  async updateUserJournal(
    journalId: number,
    dto: CreateJournalDto & { file?: string },
  ) {
    const journal = await this.prisma.userJournal.findUnique({
      where: { id: journalId },
    });

    if (!journal) throw new NotFoundException('Journal not found');

    return this.prisma.userJournal.update({
      where: { id: journalId },
      data: {
        title_az: dto.title_az,
        title_en: dto.title_en,
        title_ru: dto.title_ru,
        description_az: dto.description_az,
        description_en: dto.description_en,
        description_ru: dto.description_ru,
        file: dto.file ?? journal.file,
      },
    });
  }


}
