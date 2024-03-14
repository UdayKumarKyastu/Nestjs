import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class DisplayAsNewAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'displayAsNew'
  static readonly DEFAULT_VALUE = false

  private _tag = 'DisplayAsNewAttribute'
}
