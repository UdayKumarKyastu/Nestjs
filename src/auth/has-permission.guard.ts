import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

import { AuthService } from './auth.service'
import { AuthPermission } from './auth-permission'

export const ApplyRequiredPermissions = (...permissions: AuthPermission[]) =>
  SetMetadata(HasPermissionGuard.permissionsMetadataKey, permissions || [])

@Injectable()
export class HasPermissionGuard implements CanActivate {
  static permissionsMetadataKey = 'permissions_meta'
  /**
   * In GCP infra original Authorization header is overridden,
   * @see https://cloud.google.com/endpoints/docs/openapi/openapi-extensions#jwt_audience_disable_auth
   */
  private static GCPAuthToken = 'X-Forwarded-Authorization'
  private static AuthToken = 'Authorization'

  constructor(private _authService: AuthService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissionsRequired =
      (this.reflector.get<string[]>(
        HasPermissionGuard.permissionsMetadataKey,
        context.getHandler(),
      ) as AuthPermission[]) || []

    const request: Request = context.switchToHttp().getRequest()

    const authHeader =
      request.header(HasPermissionGuard.GCPAuthToken) ||
      request.header(HasPermissionGuard.AuthToken)

    if (!authHeader) {
      throw new ForbiddenException('Not permitted')
    }

    const [, token] = authHeader.split(' ')

    const permissionsAvailable = this._authService.getPermissionsFromJwtToken(token)

    const hasEveryPermission = permissionsRequired.every((permReq) =>
      permissionsAvailable.includes(permReq),
    )

    if (!hasEveryPermission) {
      throw new ForbiddenException('Not permitted')
    }

    return true
  }
}

export const RequirePermissions = (...permissions: AuthPermission[]) =>
  applyDecorators(ApplyRequiredPermissions(...permissions), UseGuards(HasPermissionGuard))
