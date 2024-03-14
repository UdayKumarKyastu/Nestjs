import { AbstractAttribute } from '../base-attributes/abstract-attribute'

export class ContainsAllergensAttribute extends AbstractAttribute<string[]> {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'containsAllergens'
  static readonly DEFAULT_VALUE = []

  value: string[]

  constructor(value: string[]) {
    super()

    this.value = value
  }

  toJSON(): Record<string | number, any> {
    return {
      value: this.value,
    }
  }

  toString(): string {
    return this.value.join(', ')
  }
}
