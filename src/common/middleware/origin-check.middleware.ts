import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class OriginCheckMiddleware implements NestMiddleware {
  private allowedOrigins = [
    'https://my-project-rahil.netlify.app',
    'http://localhost:3000',
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;
    console.log('Request Origin:', origin);

    if (!origin || this.allowedOrigins.includes(origin)) {
      next();
    } else {
      console.log('Forbidden Origin:', origin);
      throw new ForbiddenException('Access denied: Unauthorized origin');
    }
  }
}
