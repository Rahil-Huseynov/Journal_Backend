import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginAuthDto, RegisterAdminAuthDto, RegisterAuthDto, UpdateUserDto } from './dto';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';
import { Prisma } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }


  async userSignup(dto: RegisterAuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ForbiddenException('Email already in use');
    }

    if (dto.isForeignCitizen && dto.passportId) {
      const existingPassport = await this.prisma.user.findUnique({
        where: { passportId: dto.passportId },
      });
      if (existingPassport) {
        throw new ForbiddenException('Passport ID already in use');
      }
    }

    if (dto.isForeignCitizen) {
      if (!dto.passportId || dto.passportId.trim() === '') {
        dto.passportId = null;
      }
    } else {
      dto.passportId = null;
    }

    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          fatherName: dto.fatherName,
          role: dto.role,
          usertype: dto.usertype,
          organization: dto.organization,
          position: dto.position,
          phoneCode: dto.phoneCode,
          phoneNumber: dto.phoneNumber,
          address: dto.address,
          fin: dto.isForeignCitizen ? null : dto.fin,
          idSerial: dto.isForeignCitizen ? null : dto.idSerial,
          passportId: dto.passportId,
          isForeignCitizen: dto.isForeignCitizen,
          citizenship: dto.citizenship,
        },
      });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException(
          'Unique constraint failed on one of the fields',
        );
      }
      throw error;
    }
  }

  async signin(dto: LoginAuthDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (admin) {
      const pwMatches = await argon.verify(admin.hash, dto.password);
      if (!pwMatches) throw new ForbiddenException('Incorrect password');

      const token = await this.signToken(admin.id, admin.email, true);

      return {
        accessToken: token.access_token,
        admin: {
          id: admin.id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: 'admin',
        }
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('User not found');

    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Incorrect password');

    return {
      accessToken: (await this.signToken(user.id, user.email, false)).access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fatherName: user.fatherName,
        usertype: user.usertype,
        phoneCode: user.phoneCode,
        phoneNumber: user.phoneNumber,
        address: user.address,
        fin: user.fin,
        idSerial: user.idSerial,
        passportId: user.passportId,
        isForeignCitizen: user.isForeignCitizen,
        role: user.role,
        organization: user.organization,
        position: user.position,
        citizenship: user.citizenship,
        createdAt: user.createdAt
      },
    };
  }


  async signToken(
    userId: number,
    email: string,
    isAdmin: boolean,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      isAdmin,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
  async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          fatherName: true,
          firstName: true,
          address: true,
          citizenship: true,
          phoneCode: true,
          idSerial: true,
          fin: true,
          organization: true,
          position: true,
          passportId: true,
          lastName: true,
          phoneNumber: true,
          role: true,
          usertype: true,
          userJournal: true,
          isForeignCitizen: true,
        },
      }),
      this.prisma.user.count(),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return {
      users,
      totalCount,
      totalPages,
      currentPage: page,
    }
  }

  async getAllAdmins(page = 1, limit = 10, search = "") {
    const skip = (page - 1) * limit;

    const where = search
      ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ] as Prisma.AdminWhereInput[],
      }
      : {};

    const [admins, total] = await Promise.all([
      this.prisma.admin.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      }),
      this.prisma.admin.count({ where }),
    ]);

    return {
      users: admins,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateAdmin(id: number, dto: Partial<RegisterAdminAuthDto>) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new ForbiddenException('Admin not found');
    const updateData: any = { ...dto };
    if (dto.password) {
      updateData.hash = await argon.hash(dto.password);
      delete updateData.password;
    }

    try {
      const updatedAdmin = await this.prisma.admin.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      });

      return updatedAdmin;
    } catch (error) {
      throw error;
    }
  }

  async deleteAdmin(id: number) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) {
      throw new ForbiddenException("Admin tapılmadı");
    }

    await this.prisma.admin.delete({
      where: { id },
    });

    return { message: "Admin uğurla silindi" };
  }

  async putUser(userId: number, dto: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('User not found');

    const updateData: any = { ...dto };

    if (updateData.passportId === '') {
      updateData.passportId = null;
    }
    updateData.isForeignCitizen = updateData.isForeignCitizen === 'true' || updateData.isForeignCitizen === true;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        fin: true,
        phoneCode: true,
        phoneNumber: true,
        organization: true,
        position: true,
        address: true,
        idSerial: true,
        passportId: true,
        usertype: true,
        isForeignCitizen: true,
        fatherName: true,
        citizenship: true,
      },
    });

    return updatedUser;
  }

  async deleteUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  }

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        organization: true,
        position: true,
        fatherName: true,
        phoneCode: true,
        phoneNumber: true,
        address: true,
        fin: true,
        idSerial: true,
        usertype: true,
        passportId: true,
        isForeignCitizen: true,
        citizenship: true,
        createdAt: true,
        userJournal: {
          include: {
            category: true,
            subCategories: true,
          },
        },
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    return user;
  }

  async getAdminById(adminId: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!admin) {
      throw new ForbiddenException('Admin not found');
    }

    return admin;
  }


  async adminSignup(dto: RegisterAdminAuthDto) {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (existingAdmin) {
      throw new ForbiddenException("Email already in use");
    }

    const hash = await argon.hash(dto.password);

    try {
      const admin = await this.prisma.admin.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          hash,
          role: dto.role,
        },
      });

      return {
        message: "Admin created successfully",
        adminId: admin.id,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ForbiddenException("Email already in use");
      }
      throw error;
    }
  }


  async forgotPassword(email: string, locale: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new ForbiddenException('İstifadəçi tapılmadı');

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await this.prisma.passwordResetToken.create({
      data: {
        token,
        expires,
        user: { connect: { id: user.id } },
      },
    });

    const baseUrl = this.config.get('FRONTEND_URL');
    const formattedLocale = locale.startsWith('/') ? locale : `/${locale}`;
    const resetUrl = `${baseUrl}${formattedLocale}/auth/reset-password?token=${token}`;

    await this.sendResetEmail(user.email, resetUrl);

    return { message: 'Şifrə sıfırlama linki e-poçt ünvanınıza göndərildi.' };
  }
  async resetPassword(token: string, newPassword: string) {
    const tokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenRecord) throw new BadRequestException('Yanlış və ya istifadə olunmuş token.');
    if (tokenRecord.expires < new Date()) {
      await this.prisma.passwordResetToken.delete({ where: { token } });
      throw new BadRequestException('Token vaxtı keçib.');
    }

    const hashedPassword = await argon.hash(newPassword);

    await this.prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { hash: hashedPassword },
    });

    await this.prisma.passwordResetToken.delete({ where: { token } });

    return { message: 'Şifrə uğurla dəyişdirildi.' };
  }

  private async sendResetEmail(to: string, resetUrl: string) {
    const transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: +this.config.get('SMTP_PORT'),
      secure: +this.config.get('SMTP_PORT') === 465,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });

    await transporter.sendMail({
      from: `"ScientificWorks" <${this.config.get('SMTP_USER')}>`,
      to,
      subject: 'Şifrə Sıfırlama',
      html: `
        <h2>Şifrə sıfırlama linki</h2>
        <p style="margin-bottom: 2rem;">Aşağıdakı linkə klikləyərək yeni şifrə təyin edə bilərsiniz:</p>
        <a style="background-color: blue; text-decoration: none; color: white; margin: 1rem 0; padding: 1rem; border-radius: 20px; font-weight: 800;" href="${resetUrl}">Şifrəni dəyişmək üçün bura klik edin</a>
        <p style="margin-top: 2rem; font-weight: 800;">QEYD: Link 1 saat etibarlıdır.</p>
      `,
    });
  }
  async checkToken(token: string) {
    const tokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!tokenRecord) return false;
    if (tokenRecord.expires < new Date()) {
      await this.prisma.passwordResetToken.delete({ where: { token } });
      return false;
    }
    return true;
  }

  async updatePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ForbiddenException('İstifadəçi tapılmadı');
    }
    const isPasswordCorrect = await argon.verify(user.hash, currentPassword);
    if (!isPasswordCorrect) {
      throw new ForbiddenException('Cari şifrə yanlışdır');
    }
    const newHashedPassword = await argon.hash(newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { hash: newHashedPassword },
    });
    return { message: 'Şifrə uğurla yeniləndi' };
  }

}
