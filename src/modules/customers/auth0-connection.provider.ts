import { Provider } from '@nestjs/common'
import { ManagementClient, AuthenticationClient } from 'auth0'

import { Auth0ConfigService } from './auth0-config.service'

export const SecretConfigProviderToken = Symbol('SECRET_CONFIG_PROVIDER')

export const Auth0ConnectionProvider: Provider = {
  inject: [Auth0ConfigService],
  provide: Auth0ConfigService,
  useFactory: (auth0ConfigService: Auth0ConfigService) => {
    const managementClient = new ManagementClient({
      domain: auth0ConfigService.authApiUrl,
      clientId: auth0ConfigService.clientId,
      // audience: 'https://localhost:5546/api/v2/',
      clientSecret: auth0ConfigService.authSecret,
    })

    const authenticationClient = new AuthenticationClient({
      domain: auth0ConfigService.authApiUrl,
      clientId: auth0ConfigService.clientId,
      // audience: 'https://localhost:5546/api/v2/',
      clientSecret: auth0ConfigService.authSecret,
    })

    return [managementClient, authenticationClient]
  },
}
