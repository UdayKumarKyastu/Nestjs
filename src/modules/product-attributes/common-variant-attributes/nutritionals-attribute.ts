import { LocalizedString } from '@commercetools/platform-sdk'

import { AbstractAttribute } from '../base-attributes/abstract-attribute'

export type CtNutritionItem = [
  { name: 'item'; value: { key: string; label: string } },
  { name: 'localizedLabel'; value: { key: string; label: LocalizedString } },
  {
    name: 'per100g'
    value: number
  },
  { name: 'perServing'; value: number },
]

export class NutritionalsAttribute extends AbstractAttribute<CtNutritionItem[]> {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'nutritionals'

  private _tag = 'NutritionalsAttribute'

  value: CtNutritionItem[]

  constructor(nutritionItems: CtNutritionItem[]) {
    super()

    this.validate(nutritionItems)

    this.value = nutritionItems
  }

  private validate(nutritionItems: CtNutritionItem[]) {
    if (!Array.isArray(nutritionItems)) {
      throw new Error('Expected nutritionals to be an array')
    }
  }

  toString(): string {
    return JSON.stringify(this.value)
  }

  toJSON(): Record<string | number, any> {
    return {
      value: this.value,
    }
  }
}
