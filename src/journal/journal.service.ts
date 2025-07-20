import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalDto, UpdateJournalDto } from './dto';
import { SubCategoryService } from 'src/subcategory/subcategory.service';

@Injectable()
export class JournalService {
  constructor(
    private prisma: PrismaService,
    private subCategoryService: SubCategoryService,
  ) { }

  async getUserFilterJournals(filter: { status?: string; subCategoryId?: number }) {
    const { status, subCategoryId } = filter;

    const where: any = {};
    if (status) where.status = status;
    if (subCategoryId) {
      where.subCategories = {
        some: {
          id: subCategoryId,
        },
      };
    }

    const journals = await this.prisma.userJournal.findMany({
      where,
    });

    return journals;
  }
  async updateOrder(id: number, order: number) {
    const journal = await this.prisma.userJournal.findUnique({
      where: { id },
    });

    if (!journal) {
      throw new NotFoundException(`Journal with id ${id} not found`);
    }

    const updatedJournal = await this.prisma.userJournal.update({
      where: { id },
      data: { order },
    });

    return updatedJournal;
  }


  async createJournal(dto: CreateJournalDto, userId: number) {
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
        message: dto.message,
        file: dto.file || '',
        approvedFile: dto.approvedFile || '',
        userId: userId,
        approved: false,
        category: {
          connect: dto.categoryIds.map((id) => ({ id })),
        },
        subCategories: {
          connect: dto.subCategoryIds.map((id) => ({ id })),
        },
      },
      include: {
        subCategories: true,
      },
    });

    if (dto.status === 'finished') {
      for (const sub of journal.subCategories) {
        await this.subCategoryService.updateCountAndStatus(sub.id);
      }
    }

    return journal;
  }



  async updateUserJournal(
    journalId: number,
    dto: CreateJournalDto & { file?: string; status?: string; message?: string }
  ) {
    const journal = await this.prisma.userJournal.findUnique({
      where: { id: journalId },
      include: { subCategories: true, category: true },
    });
    if (!journal) throw new NotFoundException("Journal not found");

    const updated = await this.prisma.userJournal.update({
      where: { id: journalId },
      include: { subCategories: true },
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
        order: dto.order,
        message: dto.message ?? journal.message,
        approvedFile: dto.approvedFile ?? journal.approvedFile,
        file: dto.file ?? journal.file,
        status: dto.status ?? journal.status,
        category: {
          set: dto.categoryIds ? [{ id: Number(dto.categoryIds) }] : [],
        },
        subCategories: {
          set: dto.subCategoryIds ? [{ id: Number(dto.subCategoryIds) }] : [],
        },
      },
    });

    for (const sub of updated.subCategories) {
      await this.subCategoryService.updateCountAndStatus(sub.id);
    }

    return updated;
  }




  async updateJournalStatus(journalId: number, status: string, reason?: string) {
    const journal = await this.prisma.userJournal.findUnique({
      where: { id: journalId },
      include: { subCategories: true },
    });
    if (!journal) throw new NotFoundException('Journal not found');

    const updatedData: any = { status };

    if (status === 'rejected' && reason) {
      updatedData.message = reason;
    }

    const updatedJournal = await this.prisma.userJournal.update({
      where: { id: journalId },
      data: updatedData,
    });

    if (journal.status !== status) {
      for (const sub of journal.subCategories) {
        await this.subCategoryService.updateCountAndStatus(sub.id);
      }
    }

    return updatedJournal;
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
        order: true,
        message: true,
        file: true,
        approvedFile: true,
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
      include: { user: true, subCategories: true },
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
        status: 'approved',
      },
    });

    for (const sub of journal.subCategories) {
      await this.subCategoryService.updateCountAndStatus(sub.id);
    }


    return { message: 'Journal approved and added to AllJournal' };
  }

  async rejectJournal(journalId: number) {
    const journal = await this.prisma.userJournal.findUnique({
      where: { id: journalId },
      include: { subCategories: true },
    });

    if (!journal) throw new NotFoundException('Journal not found');

    await this.prisma.userJournal.update({
      where: { id: journalId },
      data: {
        approved: false,
        status: 'Ləğv edildi',
      },
    });
    for (const sub of journal.subCategories) {
      await this.subCategoryService.updateCountAndStatus(sub.id);
    }

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

async updateUserJournalDemo(
  journalId: number,
  dto: UpdateJournalDto,
  approvedFileName?: string,
) {
  const journal = await this.prisma.userJournal.findUnique({
    where: { id: journalId },
  });

  if (!journal) throw new NotFoundException("Journal not found");

  const updated = await this.prisma.userJournal.update({
    where: { id: journalId },
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
      order: dto.order ? Number(dto.order) : journal.order,
      message: dto.message ?? journal.message,
      approvedFile: approvedFileName ?? journal.approvedFile, 
      file: dto.file ?? journal.file,
      status: dto.status ?? journal.status,
    },
  });

  return updated;
}


}
