import { Module } from '@nestjs/common'

import { VariantNutritionService } from './variant-nutrition.service'

@Module({
  imports: [],
  providers: [VariantNutritionService],
  exports: [VariantNutritionService],
})
export class VariantNutritionModule {}
