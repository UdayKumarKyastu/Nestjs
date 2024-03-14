import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { Auth0ConfigService } from '../modules/customers/auth0-config.service'
import { ChargeBeeConfigService } from '../modules/customers/chargebee/chargebee-config.service'

import { EnvironmentVariablesValidator } from './validation/EnvironmentVariablesValidator'
import { ApplicationConfigService } from './services/application-config.service'
import { CommerceToolsConfigService } from './services/commerce-tools-config.service'
import { ContentfulConfigService } from './services/contentful-config.service'
import { SecretManagerService } from './services/secret-manager.service'
import { SecretConfigProvider } from './providers/secret-config.provider'
import { CorsConfigService } from './services/cors-config.service'
import { SwaggerConfigService } from './services/swagger-config.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: EnvironmentVariablesValidator.validate,
      expandVariables: true,
    }),
  ],
  providers: [
    SecretManagerService,
    SecretConfigProvider,
    ApplicationConfigService,
    CommerceToolsConfigService,
    ContentfulConfigService,
    CorsConfigService,
    SwaggerConfigService,
    Auth0ConfigService,
    ChargeBeeConfigService,
  ],
  exports: [
    ApplicationConfigService,
    CommerceToolsConfigService,
    ContentfulConfigService,
    CorsConfigService,
    SwaggerConfigService,
    Auth0ConfigService,
    ChargeBeeConfigService,
  ],
})
export class ConfigurationModule {}
