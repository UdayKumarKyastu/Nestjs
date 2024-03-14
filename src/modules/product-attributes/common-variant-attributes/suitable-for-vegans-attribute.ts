import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class SuitableForVegansAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'suitableForVegans'
  static readonly DEFAULT_VALUE = false

  private _tag = 'SuitableForVegansAttribute'
}
