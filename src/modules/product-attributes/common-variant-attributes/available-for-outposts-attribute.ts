import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class AvailableForOutpostsAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'availableForOutposts'
  static readonly DEFAULT_VALUE = false

  private _tag = 'AvailableForOutpostsAttribute'
}
