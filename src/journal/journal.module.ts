import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminGuard } from './guard';
import { MulterModule } from '@nestjs/platform-express';
import { SubCategoryModule } from 'src/subcategory/subcategory.module';

@Module({
  imports: [
    SubCategoryModule,
    PrismaModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [JournalController],
  providers: [JournalService, AdminGuard],
  exports: [JournalService],
})
export class JournalModule {}
