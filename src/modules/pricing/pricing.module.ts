import { Module } from '@nestjs/common'

import { CommerceToolsModule } from '../commercetools/commercetools.module'
import { ConfigurationModule } from '../../configuration/configuration.module'
import { CtProductModule } from '../ct-product/ct-product.module'

import { PricingDao } from './pricing.dao'
import { PricingService } from './pricing.service'

@Module({
  imports: [ConfigurationModule, CommerceToolsModule, CtProductModule],
  providers: [PricingDao, PricingService],
  exports: [PricingDao, PricingService],
})
export class PricingModule {}
