import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class VisibleAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'visible'
  static readonly DEFAULT_VALUE = false

  private _tag = 'VisibleAttribute'
}
