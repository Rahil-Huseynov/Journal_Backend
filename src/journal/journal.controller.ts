import { Controller, Post, Get, Body, Req, Param, UseGuards } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateJournalDto } from './dto';
import { AdminGuard } from './guard';


@Controller('journals')
@UseGuards(JwtGuard)
export class JournalController {
    constructor(private readonly journalService: JournalService) { }

    @Post('add')
    create(@Body() dto: CreateJournalDto, @Req() req) {
        return this.journalService.createUserJournal(req.user.id, dto);
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
}
