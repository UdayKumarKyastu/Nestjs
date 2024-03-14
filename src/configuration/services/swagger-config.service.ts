import { INestApplication, Injectable } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { ApplicationConfigService } from './application-config.service'

@Injectable()
export class SwaggerConfigService {
  constructor(private readonly _appConfigService: ApplicationConfigService) {}

  setup(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Portal Management API')
      .setDescription('The Portal Management API for CommerceTools')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup(`${this._appConfigService.globalApiPrefix}/docs`, app, document)
  }
}
