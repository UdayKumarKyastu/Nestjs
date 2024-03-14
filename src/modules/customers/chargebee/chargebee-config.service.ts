import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SecretConfigProviderToken } from '../../../configuration/tokens/secret-config-provider.token'
import { EnvironmentVariables } from '../../../configuration/models/environment-variables'
import { Secrets } from '../../../configuration/models/secrets'

@Injectable()
export class ChargeBeeConfigService {
  readonly projectName: string
  readonly apiKey: string

  constructor(
    configService: ConfigService<EnvironmentVariables>,
    @Inject(SecretConfigProviderToken)
    secretsProvider: Secrets,
  ) {
    this.projectName = process.env.CHARGEBEE_PROJECT_NAME as string
    this.apiKey = secretsProvider.PORTAL_API_CHARGEBEE_API_KEY
  }
}
