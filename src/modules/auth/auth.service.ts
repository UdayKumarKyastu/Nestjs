import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import jwtDecode from 'jwt-decode'
import { take } from 'rxjs'

import { AuthPermission } from './auth-permission'

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpService) {}

  getPermissionsFromJwtToken(token: string): AuthPermission[] {
    try {
      const payload = jwtDecode(token) as Record<any, unknown>

      return (payload['https://portal/permissions'] || []) as AuthPermission[]
    } catch (e) {
      return []
    }
  }

  async getUser(token: string): Promise<{ name: string; id: string } | null> {
    try {
      const payload = jwtDecode(token) as Record<any, unknown>

      const userInfoRequest = (payload['aud'] as string)[1]

      const user = this.http.get(userInfoRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return new Promise((resolve) => {
        user.pipe(take(1)).subscribe(({ data }) => {
          resolve({ name: data.name, id: data.sub })
        })
      })
    } catch (e) {
      return Promise.resolve(null)
    }
  }
}
