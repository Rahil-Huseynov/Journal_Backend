import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class OriginCheckMiddleware implements NestMiddleware {
  private allowedOrigins = ['https://my-domen.com'];

  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;

    if (origin && this.allowedOrigins.includes(origin)) {
      next();
    } else {
      throw new ForbiddenException('Access denied: Unauthorized origin');
    }
  }
}
