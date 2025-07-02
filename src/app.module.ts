import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JournalModule } from './journal/journal.module';
import { AdminSeederModule } from './admin-seed/admin-seeder.module';
// import { OriginCheckMiddleware } from './common/middleware/origin-check.middleware';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './subcategory/subcategory.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, AdminSeederModule, PrismaModule, JournalModule, CategoryModule, SubCategoryModule],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(OriginCheckMiddleware)
  //     .forRoutes({ path: '*', method: RequestMethod.ALL });
  // }
}
