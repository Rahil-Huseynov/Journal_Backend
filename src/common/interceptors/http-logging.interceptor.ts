import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  /** IP-ni müxtəlif mənbələrdən etibarlı şəkildə çıxarır */
  private getClientIp(request: any): string {
    // 1) Proxy arxasındadırsa
    const xForwardedFor = request.headers['x-forwarded-for'];
    if (xForwardedFor) {
      const ip = Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : xForwardedFor.split(',')[0].trim();
      return this.normalizeIp(ip);
    }

    // 2) Express socket
    if (request.socket?.remoteAddress) {
      return this.normalizeIp(request.socket.remoteAddress);
    }

    // 3) Express ip
    if (request.ip) {
      return this.normalizeIp(request.ip);
    }

    return 'unknown';
  }

  /** IPv6-da map olunmuş IPv4-ü təmizləyir və localhost-u etiketləyir */
  private normalizeIp(rawIp: string): string {
    if (!rawIp) return 'unknown';

    // IPv6 localhost
    if (rawIp === '::1') return 'localhost';
    // IPv4 localhost
    if (rawIp === '127.0.0.1') return 'localhost';

    // ::ffff:192.168.0.10 -> 192.168.0.10
    if (rawIp.startsWith('::ffff:')) {
      return rawIp.replace('::ffff:', '');
    }

    return rawIp;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const start = Date.now();

    return next.handle().pipe(
      tap(async () => {
        const duration = Date.now() - start;

        // İstifadəçi məlumatı
        const user = req.user ?? null;
        const userId = user?.id ?? null;
        const userName = user?.email ?? null; // E-poçtu username kimi saxlayırsan
        const userRole =
          user && ['admin', 'superadmin', 'client'].includes(user.role)
            ? user.role
            : null;

        // Tam IP
        const ip = this.getClientIp(req);

        await this.prisma.log.create({
          data: {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration,
            userId,
            userName,
            userRole,
            ip,
          },
        });
      }),
    );
  }
}
