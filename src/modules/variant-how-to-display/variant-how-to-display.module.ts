import { Module } from '@nestjs/common'

import { ProductTypeModule } from '../product-type/product-type.module'

import { VariantHowToDisplayDao } from './variant-how-to-display.dao'
import { GetAvailableHowToDisplayOptionsController } from './get-available-how-to-display-options/get-available-how-to-display-options.controller'
import { GetAvailableHowToDisplayOptionsService } from './get-available-how-to-display-options/get-available-how-to-display-options.service'
import { VariantHowToDisplayService } from './variant-how-to-display.service'

@Module({
  imports: [ProductTypeModule],
  providers: [
    VariantHowToDisplayDao,
    GetAvailableHowToDisplayOptionsService,
    VariantHowToDisplayService,
  ],
  exports: [
    VariantHowToDisplayDao,
    GetAvailableHowToDisplayOptionsService,
    VariantHowToDisplayService,
  ],
  controllers: [GetAvailableHowToDisplayOptionsController],
})
export class VariantHowToDisplayModule {}
