import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) throw new ForbiddenException('User not authenticated');
        if (!user.isAdmin) throw new ForbiddenException('Only admins can access this resource');

        return true;
    }
}
