import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class PretDeliversAvailableForLunchAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'pretDeliversAvailableForLunch'
  static readonly DEFAULT_VALUE = false

  private _tag = 'PretDeliversAvailableForLunchAttribute'
}
