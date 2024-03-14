import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { ExecutionContext } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'

import { DeepPartial } from '../../shared/deep-partial'

import { HasPermissionGuard } from './has-permission.guard'
import { AuthPermission } from './auth-permission'
import { AuthService } from './auth.service'

const tokenWithPermission = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InljazdlSVBickJiMTNqTi1XaXc2OSJ9.eyJodHRwczovL3BvcnRhbC9wZXJtaXNzaW9ucyI6WyJhcHByb3ZlOnByb2R1Y3QtY2hhbmdlcyJdLCJodHRwczovL3BvcnRhbC9yb2xlcyI6WyJNYW5hZ2VyIl0sImlzcyI6Imh0dHBzOi8vcHJldC1wb3J0YWwtbGFiLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJvYXV0aDJ8UHJldC1Pa3RhfDAwdXkzYWR6bndHZGcxOUVmMGg3IiwiYXVkIjpbImh0dHBzOi8vcHJldC1wb3J0YWwtbGFiLmV1LmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9wcmV0LXBvcnRhbC1sYWIuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYyMzgzNDc4OCwiZXhwIjoxNjIzODM4Mzg4LCJhenAiOiI3UkFIZEFKTWlCRmNOcm1mTzM2MEd4eklUd3Rpb2tvcSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MifQ.XpIuJeCsXbC4Td2XbvKRBr3H0TdtrsuXbPSr3mohESnuDuJNNuTYx_atpzGeTyes7liD978NFFZpJ82lm1Om274mQiZ7chOWOKavt2gQlBZhogSOsgvaZGJhLCQa9YnNEe0DYPIg_Y1mu_k-kNBZWoIlzoPTsEv8gqSR70RJj90AQqpbU4qiZ9KCf9e9_87QttImFtIFRZIHDfa1xYObFqJFnUtS2bu27ouLWLvWhJvQuLRjDGLr9mpZmDJLdv8wLhrRFfJYe_qQvsSeBCldPmx8bXQTgCSCirCEPRNLxcGS-Kqn5uT1j0Sftmd9c93opoHOQRuDsg2VNFgMYOgDYa`

describe('Has Permissions Guard', () => {
  // TODO Enable me
  it.skip('Allows access when permission is found', () => {
    class Test {}

    const reflector = new Reflector()

    Reflect.defineMetadata(
      HasPermissionGuard.permissionsMetadataKey,
      [AuthPermission.APPROVE_PRODUCT_CHANGES],
      Test,
    )

    const guard = new HasPermissionGuard(new AuthService({} as HttpService), reflector)

    const mockContext: DeepPartial<ExecutionContext> = {
      getHandler() {
        return Test
      },
      switchToHttp(): HttpArgumentsHost {
        return {
          // @ts-expect-error Mock
          getRequest(): Request {
            return {
              // @ts-expect-error Mock
              header(name) {
                return tokenWithPermission
              },
            }
          },
        }
      },
    }

    expect(guard.canActivate(mockContext as ExecutionContext))
  })

  it('Throws when permission is not found', () => {
    class Test {}

    const reflector = new Reflector()

    Reflect.defineMetadata(
      HasPermissionGuard.permissionsMetadataKey,
      [AuthPermission.APPROVE_PRODUCT_CHANGES],
      Test,
    )

    const guard = new HasPermissionGuard(new AuthService({} as HttpService), reflector)

    const mockContext: DeepPartial<ExecutionContext> = {
      getHandler() {
        return Test
      },
      switchToHttp(): HttpArgumentsHost {
        return {
          // @ts-expect-error Mock
          getRequest(): Request {
            return {
              // @ts-expect-error Mock
              header(name) {
                return `invalid token`
              },
            }
          },
        }
      },
    }

    expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrowError()
  })
})
