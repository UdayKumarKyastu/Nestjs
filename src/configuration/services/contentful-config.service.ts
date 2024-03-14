import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EnvironmentVariables } from '../models/environment-variables'
import { Secrets } from '../models/secrets'
import { SecretConfigProviderToken } from '../tokens/secret-config-provider.token'

@Injectable()
export class ContentfulConfigService {
  readonly spaceId: string
  readonly accessToken: string

  constructor(
    configService: ConfigService<EnvironmentVariables>,
    @Inject(SecretConfigProviderToken)
    secretsProvider: Secrets,
  ) {
    this.spaceId = configService.get('CONTENTFUL_SPACE_ID') as string
    this.accessToken = secretsProvider.CONTENTFUL_TOKEN
  }
}
