import { Inject } from '@nestjs/common'
import { ManagementClient } from 'auth0'

import { Auth0ConfigService } from './auth0-config.service'

export class Auth0ClientService {
  private readonly managementClient

  constructor(@Inject(Auth0ConfigService) auth0ConfigService: Auth0ConfigService) {
    this.managementClient = new ManagementClient({
      domain: auth0ConfigService.authApiUrl,
      clientId: auth0ConfigService.clientId,
      clientSecret: auth0ConfigService.authSecret,
    })
  }

  async getUsers(query: string, propertyName: 'name' | 'email' | 'phone_number'): Promise<any> {
    try {
      if (propertyName === 'email') {
        return this.managementClient.getUsersByEmail(query)
      }

      return this.managementClient.getUsers({
        q: `${propertyName}:*${query}*`,
        search_engine: 'v3',
      })
    } catch (e: any) {
      throw new Error(e)
    }
  }

  async updateUser(id: string, body: any) {
    await this.managementClient.updateUser({ id }, body)
  }

  async getUserById(id: string): Promise<any> {
    try {
      return this.managementClient.getUser({ id })
    } catch (e: any) {
      throw new Error(e)
    }
  }
}
