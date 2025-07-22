import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from 'fastify-helmet';
import fastifyCors from '@fastify/cors';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { PrismaService } from './prisma/prisma.service';
import fastifyCompress from 'fastify-compress';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: false,
    },
  );

  await app.register(fastifyCompress, {
    encodings: ['br', 'gzip'], 
  });


  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  const fastifyInstance = app.getHttpAdapter().getInstance();

  fastifyInstance.addHook('onSend', async (request, reply, payload) => {
    reply.header('Cross-Origin-Resource-Policy', 'cross-origin');
    reply.header('Cross-Origin-Opener-Policy', 'same-origin');
    return payload;
  });

  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      const allowedOrigins = [
        'https://my-project-rahil.netlify.app',
        'http://localhost:3000',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const prisma = app.get(PrismaService);

  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(prisma),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001, '0.0.0.0');
}
bootstrap();
