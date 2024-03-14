import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { Provider } from '@nestjs/common'
import fetch from 'node-fetch'

import { CommerceToolsConfigService } from '../../configuration/services/commerce-tools-config.service'

import { CommercetoolsConnectionToken } from './commercetools-connection.token'

export const commercetoolsConnectionProvider: Provider = {
  provide: CommercetoolsConnectionToken,
  inject: [CommerceToolsConfigService],
  useFactory: (ctConfigService: CommerceToolsConfigService) => {
    const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
      host: ctConfigService.authUrl,
      projectKey: ctConfigService.projectKey,
      credentials: {
        clientId: ctConfigService.clientId,
        clientSecret: ctConfigService.secret,
      },
      fetch,
    })

    const httpMiddleware = createHttpMiddleware({
      host: ctConfigService.apiUrl,
      fetch,
    })

    const ctpClient = createClient({
      middlewares: [authMiddleware, httpMiddleware],
    })

    return createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: ctConfigService.projectKey,
    })
  },
}
