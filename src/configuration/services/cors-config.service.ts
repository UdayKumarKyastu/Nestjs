import { ForbiddenException, Injectable, Logger } from '@nestjs/common'
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface'

import { ApplicationConfigService } from './application-config.service'

/**
 * TODO
 *   Check if this is even required?
 *   App is behind gateway which already defines its own CORS
 *   so probably here we can keep *
 */
@Injectable()
export class CorsConfigService {
  private readonly allowedOrigins: string[]
  readonly options: CorsOptions | CorsOptionsDelegate<any>

  constructor(appConfigService: ApplicationConfigService) {
    this.allowedOrigins = [
      appConfigService.host,
      'http://localhost:3000',
      'https://portal.lab.pret.co.uk',
      'https://portal.pret.co.uk',
    ]
    this.options = {
      //todo: refactor to use CorsOptions
      origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true)
        // Check origin for not allowed
        if (!this.allowedOrigins.includes(origin)) {
          Logger.error(
            `The Origin header '${origin}' used in the request does not match the list of allowed origins.`,
            'CorsConfigService',
          )

          return callback(new ForbiddenException(), false)
        }

        return callback(null, true)
      },
    }
  }
}
