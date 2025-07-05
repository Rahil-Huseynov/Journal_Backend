import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginAuthDto, RegisterAdminAuthDto, RegisterAuthDto, UpdateUserDto } from './dto';

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

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
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
        userJournal: true,
        fatherName: true,
        phoneCode: true,
        phoneNumber: true,
        address: true,
        fin: true,
        idSerial: true,
        passportId: true,
        isForeignCitizen: true,
        citizenship: true,
        createdAt: true,
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
      throw new ForbiddenException('Email already in use');
    }

    const hash = await argon.hash(dto.password);

    try {
      const admin = await this.prisma.admin.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          hash,
          role: dto.role
        },
      });

      return this.signToken(admin.id, admin.email, true);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Email already in use');
      }
      throw error;
    }
  }

async updatePassword(userId: number, currentPassword: string, newPassword: string) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  const isPasswordValid = await argon.verify(user.hash, currentPassword);
  if (!isPasswordValid) {
    throw new BadRequestException('Hazırki şifrə düzgün deyil');
  }

  const newHashedPassword = await argon.hash(newPassword);

  await this.prisma.user.update({
    where: { id: userId },
    data: { hash: newHashedPassword },
  });

  return { message: 'Şifrə uğurla yeniləndi' };
}

}
