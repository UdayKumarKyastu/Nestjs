import { Logger, Provider, Scope } from '@nestjs/common'
import { ContentfulClientApi, createClient } from 'contentful'

import { ContentfulConfigService } from '../../../configuration/services/contentful-config.service'

import { ContentfulClientConnectionToken } from './contentful-client-connection.token'

export const contentfulClientConnectionProvider: Provider = {
  scope: Scope.DEFAULT,
  provide: ContentfulClientConnectionToken,
  inject: [ContentfulConfigService],
  useFactory: (contentfulConfigService: ContentfulConfigService): ContentfulClientApi => {
    try {
      const client = createClient({
        space: contentfulConfigService.spaceId,
        accessToken: contentfulConfigService.accessToken,
      })

      return client
    } catch (error: unknown) {
      Logger.error('Unable to create contentful client', (error as Error).stack)
      throw error
    }
  },
}
