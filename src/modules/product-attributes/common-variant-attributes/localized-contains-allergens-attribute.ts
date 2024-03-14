import { LocalizedString } from '@commercetools/platform-sdk'

import { AbstractAttribute } from '../base-attributes/abstract-attribute'

export class LocalizedContainsAllergensAttribute<
  ValueType = { key: string; label: LocalizedString }[],
> extends AbstractAttribute<ValueType> {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'localizedContainsAllergens'
  static readonly DEFAULT_VALUE = []

  value: ValueType

  private _tag = 'LocalizedContainsAllergensAttribute'

  constructor(value: ValueType) {
    super()

    this.value = value
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
