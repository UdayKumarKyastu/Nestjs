// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@google-cloud/trace-agent').start()

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'

import { AppModule } from './app.module'
import { ApplicationConfigService } from './configuration/services/application-config.service'
import { CorsConfigService } from './configuration/services/cors-config.service'
import { SwaggerConfigService } from './configuration/services/swagger-config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'debug', 'error', 'warn'],
  })
  const appConfigService = app.get(ApplicationConfigService)
  const corsConfigService = app.get(CorsConfigService)
  const swaggerConfigService = app.get(SwaggerConfigService)

  app.use(helmet())
  app.enableCors(corsConfigService.options)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  app.setGlobalPrefix(appConfigService.globalApiPrefix)

  swaggerConfigService.setup(app)
  await app.listen(appConfigService.port)
}
bootstrap()
