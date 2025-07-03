import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminGuard } from './guard';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [PrismaModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [JournalController],
  providers: [JournalService, AdminGuard],
})
export class JournalModule { }
