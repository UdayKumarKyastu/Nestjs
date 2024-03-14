import { Inject, Injectable } from '@nestjs/common'

import { NutritionItemDto } from '../../../../shared/dto/hamilton-grant.dto'
import {
  HgNutritionalsTranslationService,
  ICanTranslate,
} from '../../../hg-translation/hg-translations.service'
import { NutritionItemBase } from '../../../variant-nutrition/variant-nutrition'

export interface ICanCreateNutritionalsDto {
  getDtoFromBaseNutritionals(baseNutritionals: NutritionItemBase[]): Promise<NutritionItemDto[]>
}

@Injectable()
export class NutritionalsDtoCreator implements ICanCreateNutritionalsDto {
  constructor(
    @Inject(HgNutritionalsTranslationService)
    private readonly _nutritionalsTranslation: ICanTranslate,
  ) {}

  async getDtoFromBaseNutritionals(
    baseNutritionals: NutritionItemBase[],
  ): Promise<NutritionItemDto[]> {
    return baseNutritionals.map((nutritional) => ({
      name: nutritional.item,
      per100g: nutritional.per100g,
      perServing: nutritional.perServing,
      localisedLabel: this._nutritionalsTranslation.translateKey(nutritional.item),
    }))
  }
}
