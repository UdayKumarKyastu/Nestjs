import { AbstractAttribute } from '../base-attributes/abstract-attribute'

export class RecipeTypeAttribute<
  ValueType = { key: string; label: string }[],
> extends AbstractAttribute<ValueType> {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'recipeType'
  static readonly DEFAULT_VALUE = []

  value: ValueType

  private _tag = 'RecipeTypeAttribute'

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
