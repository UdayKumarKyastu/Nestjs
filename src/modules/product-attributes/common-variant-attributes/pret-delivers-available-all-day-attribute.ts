import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class PretDeliversAvailableAllDayAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'pretDeliversAvailableAllDay'
  static readonly DEFAULT_VALUE = false

  private _tag = 'PretDeliversAvailableAllDayAttribute'
}
