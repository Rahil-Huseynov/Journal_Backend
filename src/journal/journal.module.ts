import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminGuard } from './guard';

@Module({
  imports: [PrismaModule],
  controllers: [JournalController],
  providers: [JournalService, AdminGuard],
})
export class JournalModule {}
