import { Injectable } from '@nestjs/common'
import { LocalizedString, ProductVariant } from '@commercetools/platform-sdk'

import { MultilangString } from '../product/logic/models/multilang-string'
import { CtAttributesResolver } from '../ct-utils/get-attribute-value'

import { CtNutritionItem, VariantNutrition } from './variant-nutrition'

@Injectable()
/**
 * @deprecated
 */
export class VariantNutritionService {
  getNutritionFromVariant(variant: ProductVariant): VariantNutrition {
    const getAttrValue = CtAttributesResolver.constructAttributeValueGetter(variant.attributes!)

    const nutritionals: CtNutritionItem[] | undefined = getAttrValue('nutritionals')

    return {
      isVegan: getAttrValue('suitableForVegans'),
      isVegetarian: getAttrValue('suitableForVegetarians'),
      nutritionals:
        nutritionals?.map((nut) => {
          const name = nut.find((item) => item.name === 'item')! as {
            value: {
              key: string
            }
          }
          const label = nut.find((item) => item.name === 'localizedLabel') as {
            value: {
              label: LocalizedString
            }
          }
          const per100g = nut.find((item) => item.name === 'per100g')
          const perServing = nut.find((item) => item.name === 'perServing')

          return {
            item: name.value.key,
            per100g: (per100g?.value as number) ?? null,
            perServing: (perServing?.value as number) ?? null,
            localizedLabel: new MultilangString(label?.value?.label || {}),
          }
        }) || [],
      allergens: getAttrValue('localizedContainsAllergens'),
      ingredients: getAttrValue('ingredients'),
    }
  }
}
