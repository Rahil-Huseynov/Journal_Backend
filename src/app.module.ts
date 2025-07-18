import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JournalModule } from './journal/journal.module';
import { AdminSeederModule } from './admin-seed/admin-seeder.module';
import { OriginCheckMiddleware } from './common/middleware/origin-check.middleware';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './subcategory/subcategory.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GlobalsubcategoryModule } from './globalsubcategory/globalsubcategory.module';
import { MessageModule } from './message/message.module';
import { NewsModule } from './news/news.module';
import { AuthorModule } from './author/author.module';
import { LogsModule } from './logspage/logs.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
  ],
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, LogsModule, UserModule, AuthorModule, AdminSeederModule, PrismaModule, JournalModule, CategoryModule, SubCategoryModule, NewsModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'),
    serveRoot: '/uploads',
  }),
    GlobalsubcategoryModule,
    MessageModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OriginCheckMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
