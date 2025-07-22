import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { PrismaService } from './prisma/prisma.service';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import * as compression from 'compression';
import { CustomCacheInterceptor } from './common/interceptors/custom-cache.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );


  const cacheManager = app.get(CACHE_MANAGER);
  const reflector = app.get(Reflector);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.use(compression({ threshold: 0 }));

  app.useGlobalInterceptors(
    new CustomCacheInterceptor(cacheManager, reflector, httpAdapterHost),
  );


  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
  });

  app.use((req, res, next) => {
    const ua = req.headers['user-agent']?.toLowerCase() || '';
    if (ua.includes('curl') || ua.includes('wget') || ua.includes('httpie')) {
      return res.status(403).send('CLI sorğulara icazə verilmir.');
    }
    next();
  });

  app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Çox sorğu göndərirsiniz, bir az sonra yenidən cəhd edin.',
  }));


  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://my-project-rahil.netlify.app',
        'http://localhost:3000',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
  console.log(`🚀 Server running on port ${process.env.PORT ?? 3001}`);
}

bootstrap();
