import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators.js';
import { Role } from '../../user/user.types.js';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector NestJS ka utility hai jo decorators ke through stored metadata ko read karta hai.
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Read required roles from the route handler and class
    // for this particular api which roles are set 
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // What if the route has NO @Roles() decorator? -> return true (Authorized user can access this route)
    if (!requiredRoles) {
      return true;
    }

    // 3. Get the user from request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 4. Check if user's role matches any requiredRole
    if (!user) {
      throw new ForbiddenException();
    }
    
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
