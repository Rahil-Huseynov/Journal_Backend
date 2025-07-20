import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Put,
  Delete,
  Patch,
  NotFoundException,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { JournalService } from './journal.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateJournalDto, UpdateJournalDto } from './dto';
import { AdminGuard } from './guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetJournalsFilterDto } from './dto/get-journals-filter.dto';
import { appendFile } from 'fs';

const journalStorage = diskStorage({
  destination: './uploads/journals/',
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `journal-${uniqueSuffix}${ext}`);
  },
});


const approvedFileStorage = diskStorage({
  destination: './uploads/journals/approved/', 
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const ext = extname(file.originalname);
    cb(null, `approved-${timestamp}${ext}`); 
  },
});

@Controller('journals')
@UseGuards(JwtGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) { }

  @Get('filter')
  async getUserFilterJournals(@Query() filterDto: GetJournalsFilterDto) {
    const { status, subCategoryId } = filterDto;
    return this.journalService.getUserFilterJournals({
      status,
      subCategoryId: subCategoryId ? +subCategoryId : undefined,
    });
  }

  @Put(':id/order')
  async updateJournalOrder(
    @Param('id') id: string,
    @Body('order') order: number,
  ) {
    return this.journalService.updateOrder(+id, order);
  }

  @Get('all-approved')
  @UseGuards(AdminGuard)
  getAllApprovedJournals() {
    return this.journalService.getAllApprovedJournals();
  }

  @Post('add')
  @UseInterceptors(FileInterceptor('file', { storage: journalStorage }))
  async createJournal(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: any,
  ) {
    let categoryIds: number[] = [];
    let subCategoryIds: number[] = [];

    try {
      categoryIds = JSON.parse(body.categoryIds);
      subCategoryIds = JSON.parse(body.subCategoryIds);
    } catch {
      throw new BadRequestException(
        'Invalid categoryIds or subCategoryIds format',
      );
    }

    const dto: CreateJournalDto = {
      title_az: body.title_az,
      title_en: body.title_en,
      title_ru: body.title_ru,
      description_az: body.description_az,
      description_en: body.description_en,
      description_ru: body.description_ru,
      keywords_az: body.keywords_az,
      keywords_en: body.keywords_en,
      keywords_ru: body.keywords_ru,
      status: body.status,
      message: body.message,
      categoryIds,
      subCategoryIds,
      file: file?.filename,
      approvedFile: body.appendFile,
    };

    const userId = Number(req.user.id);
    return this.journalService.createJournal(dto, userId);
  }

  @Get('my')
  getMyJournals(@Req() req) {
    return this.journalService.getUserJournals(req.user.id);
  }

  @Get('pending')
  @UseGuards(AdminGuard)
  getPending() {
    return this.journalService.getUnapprovedJournals();
  }

  @Post('approve/:id')
  @UseGuards(AdminGuard)
  approve(@Param('id') id: string) {
    return this.journalService.approveJournal(+id);
  }

  @Post('reject/:id')
  @UseGuards(AdminGuard)
  reject(@Param('id') id: string) {
    return this.journalService.rejectJournal(+id);
  }

  @Get('approved')
  getApproved() {
    return this.journalService.getAllApprovedJournals();
  }

  @Get('all')
  @UseGuards(AdminGuard)
  getAllJournals() {
    return this.journalService.getAllJournals();
  }

  @Patch('update-status/:id')
  @UseGuards(AdminGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; reason?: string },
  ) {
    const { status, reason } = body;
    return this.journalService.updateJournalStatus(+id, status, reason);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string, @Req() req) {
    return this.journalService.deleteUserJournal(+id, req.user.id, false);
  }

  @Delete('admin-delete/:id')
  @UseGuards(AdminGuard)
  adminDelete(@Param('id') id: string, @Req() req) {
    return this.journalService.deleteUserJournal(+id, req.user.id, true);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', { storage: journalStorage }))
  async updateUserJournal(
    @Param('id') id: string,
    @Body() dto: CreateJournalDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.file = file.filename;
    }
    return this.journalService.updateUserJournal(+id, dto);
  }

  @Put('approve/:id')
  @UseInterceptors(FileInterceptor('approvedFile', { storage: approvedFileStorage }))
  async updateJournal(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() approvedFile: Express.Multer.File,
    @Body() dto: UpdateJournalDto,
  ) {
    return this.journalService.updateUserJournalDemo(
      id,
      dto,
      approvedFile?.filename 
    );
  }


}
