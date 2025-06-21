import { Controller, Post, Get, Body, Req, Param, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Put, Delete } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateJournalDto } from './dto';
import { AdminGuard } from './guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('journals')
@UseGuards(JwtGuard)
export class JournalController {
    constructor(private readonly journalService: JournalService) { }

    @Get('all-approved')
    @UseGuards(AdminGuard)
    getAllApprovedJournals() {
        return this.journalService.getAllApprovedJournals();
    }
    @Post('add')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    create(
        @Req() req,
        @Body() dto: CreateJournalDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        console.log('req.user:', req.user);
        console.log('file:', file);

        if (!file) throw new BadRequestException('File is required');

        return this.journalService.createUserJournal(req.user.id, {
            ...dto,
            file: file.filename,
        });
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
        return this.journalService.approveJournal(Number(id));
    }

    @Post('reject/:id')
    @UseGuards(AdminGuard)
    reject(@Param('id') id: string) {
        return this.journalService.rejectJournal(Number(id));
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


    @Put('update/:id')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    update(
        @Param('id') id: string,
        @Body() dto: CreateJournalDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.journalService.updateUserJournal(+id, {
            ...dto,
            file: file?.filename, // File optional
        });
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



}
