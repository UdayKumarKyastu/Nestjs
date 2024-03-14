import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SecretConfigProviderToken } from '../../configuration/tokens/secret-config-provider.token'
import { EnvironmentVariables } from '../../configuration/models/environment-variables'
import { Secrets } from '../../configuration/models/secrets'

@Injectable()
export class Auth0ConfigService {
  readonly clientId: string
  readonly authSecret: string
  readonly authApiUrl: string

  constructor(
    configService: ConfigService<EnvironmentVariables>,
    @Inject(SecretConfigProviderToken)
    secretsProvider: Secrets,
  ) {
    this.clientId = secretsProvider.PORTAL_API_AUTH0_CLIENT_ID
    this.authSecret = secretsProvider.PORTAL_API_AUTH0_SECRET
    this.authApiUrl = configService.get('PORTAL_API_AUTH0_API_URL') as string
  }
}
