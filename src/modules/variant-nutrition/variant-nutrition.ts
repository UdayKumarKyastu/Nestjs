import { LocalizedString } from '@commercetools/platform-sdk'

import { MultilangString } from '../product/logic/models/multilang-string'

/**
 * @deprecated
 */
export type CtNutritionItem = [
  { name: 'item'; value: { key: string; label: string } },
  { name: 'localizedLabel'; value: { key: string; label: LocalizedString } },
  {
    name: 'per100g'
    value: number
  },
  { name: 'perServing'; value: number },
]

/**
 * @deprecated
 */
export type NutritionItemBase = {
  item: string
  per100g: number | null
  perServing: number | null
}

/**
 * @deprecated
 */
export type NutritionItem = NutritionItemBase & {
  localizedLabel: MultilangString
}

export type CtAllergenItem = {
  key: string
  label: LocalizedString
}

/**
 * @deprecated
 */
export class VariantNutrition {
  isVegan!: boolean
  isVegetarian!: boolean
  ingredients!: LocalizedString
  nutritionals!: NutritionItem[]
  allergens!: CtAllergenItem[]
}
