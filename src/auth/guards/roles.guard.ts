import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'utils/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const [type, token] = request?.headers?.authorization?.split(' ');
    if (!token) {
      return false;
    }

    const decodedToken = await this.authService.verifyToken(token);
    if (!decodedToken) {
      return false;
    }

    if (requiredRoles.includes(decodedToken.role)) {
      return true;
    }

    return false;
  }
}
