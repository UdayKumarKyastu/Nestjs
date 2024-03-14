import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class SuitableForVegetariansAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'suitableForVegetarians'

  static readonly DEFAULT_VALUE = false

  private _tag = 'SuitableForVegetariansAttribute'
}
