import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EnvironmentVariables } from '../models/environment-variables'
import { Secrets } from '../models/secrets'
import { SecretConfigProviderToken } from '../tokens/secret-config-provider.token'

@Injectable()
export class CommerceToolsConfigService {
  readonly projectKey: string
  readonly clientId: string
  readonly secret: string
  readonly authUrl: string
  readonly apiUrl: string

  constructor(
    configService: ConfigService<EnvironmentVariables>,
    @Inject(SecretConfigProviderToken)
    secretsProvider: Secrets,
  ) {
    this.projectKey = configService.get('COMMERCETOOLS_PROJECT_KEY') as string
    this.clientId = secretsProvider.COMMERCETOOLS_CLIENT_ID
    this.secret = secretsProvider.COMMERCETOOLS_SECRET
    this.authUrl = configService.get('COMMERCETOOLS_AUTH_URL') as string
    this.apiUrl = configService.get('COMMERCETOOLS_API_URL') as string
  }
}
