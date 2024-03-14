import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class AvailableForPretDeliversAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'availableForPretDelivers'
  static readonly DEFAULT_VALUE = false

  private _tag = 'AvailableForPretDeliversAttribute'
}
