import { Provider } from '@nestjs/common'

import { Secrets } from '../models/secrets'
import { SecretConfigProviderToken } from '../tokens/secret-config-provider.token'
import { SecretManagerService } from '../services/secret-manager.service'

export const SecretConfigProvider: Provider = {
  provide: SecretConfigProviderToken,
  inject: [SecretManagerService],
  useFactory: async (secretManagerService: SecretManagerService): Promise<Secrets> => {
    const [
      COMMERCETOOLS_CLIENT_ID,
      COMMERCETOOLS_SECRET,
      CONTENTFUL_TOKEN,
      PORTAL_API_STARKIS_CLIENT_ID,
      PORTAL_API_STARKIS_CLIENT_SECRET,
      PORTAL_API_AUTH0_CLIENT_ID,
      PORTAL_API_AUTH0_SECRET,
      PORTAL_API_CHARGEBEE_API_KEY,
    ] = await Promise.all([
      secretManagerService.getSecretValue('COMMERCETOOLS_CLIENT_ID'),
      secretManagerService.getSecretValue('COMMERCETOOLS_SECRET'),
      secretManagerService.getSecretValue('CONTENTFUL_TOKEN'),
      secretManagerService.getSecretValue('PORTAL_API_STARKIS_CLIENT_ID'),
      secretManagerService.getSecretValue('PORTAL_API_STARKIS_CLIENT_SECRET'),
      secretManagerService.getSecretValue('PORTAL_API_AUTH0_CLIENT_ID'),
      secretManagerService.getSecretValue('PORTAL_API_AUTH0_SECRET'),
      secretManagerService.getSecretValue('PORTAL_API_CHARGEBEE_API_KEY'),
    ])
    
    return {
      COMMERCETOOLS_CLIENT_ID,
      COMMERCETOOLS_SECRET,
      CONTENTFUL_TOKEN,
      PORTAL_API_STARKIS_CLIENT_ID,
      PORTAL_API_STARKIS_CLIENT_SECRET,
      PORTAL_API_AUTH0_CLIENT_ID,
      PORTAL_API_AUTH0_SECRET,
      PORTAL_API_CHARGEBEE_API_KEY,
    }
  },
}
