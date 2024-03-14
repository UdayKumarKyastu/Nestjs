import { Module } from '@nestjs/common'

import { ProductTypeModule } from '../product-type/product-type.module'

import { LabellingOptionsService } from './labelling-options.service'
import { LabellingOptionsValidator } from './labelling-options-validator'
import { LabellingOptionsController } from './labelling-options.controller'

@Module({
  imports: [ProductTypeModule],
  providers: [LabellingOptionsService, LabellingOptionsValidator],
  exports: [LabellingOptionsValidator],
  controllers: [LabellingOptionsController],
})
export class LabellingOptionsModule {}
