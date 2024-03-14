import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '../auth/auth.module'
import { SecretManagerService } from '../../configuration/services/secret-manager.service'
import { ConfigurationModule } from '../../configuration/configuration.module'

import { Auth0ClientService } from './auth0-client.service'
import { CustomersService } from './customers.service'
import { CustomersContoller } from './customers.controller'
import { ChargebeeService } from './chargebee/chargebee.service'
import { LoyaltyService } from './loyalty/loyalty.service'

@Module({
  imports: [HttpModule, AuthModule, ConfigModule, ConfigurationModule],
  providers: [
    CustomersService,
    SecretManagerService,
    Auth0ClientService,
    ChargebeeService,
    LoyaltyService,
  ],
  exports: [CustomersService, ChargebeeService],
  controllers: [CustomersContoller],
})
export class CustomersModule {}
