import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

@Injectable()
export class AdminSeederService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) { }

  async onModuleInit() {
    const adminEmail = this.config.get<string>('ADMIN_EMAIL');
    const adminPassword = this.config.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hash = await argon.hash(adminPassword);
      await this.prisma.admin.create({
        data: {
          email: adminEmail,
          hash,
        },
      });

      console.log('✅ Admin istifadəçi yaradıldı:', adminEmail);
    } else {
      console.log('ℹ️ Admin artıq mövcuddur:', adminEmail);
    }
  }
}
