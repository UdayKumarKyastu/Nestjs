import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class ChefSpecialAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'chefSpecial'
  static readonly DEFAULT_VALUE = false

  private _tag = 'ChefSpecialAttribute'
}
