import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EnvironmentVariables } from '../models/environment-variables'

@Injectable()
export class ApplicationConfigService {
  readonly port: number
  readonly globalApiPrefix = 'portal'
  readonly baseApiUrl: string
  readonly host: string

  constructor(configService: ConfigService<EnvironmentVariables>) {
    const host = configService.get('API_HOST') as string
    this.port = configService.get('PORT') as number
    this.globalApiPrefix = 'portal'
    this.baseApiUrl = `${host}/${this.globalApiPrefix}`
    this.host = host
  }
}
