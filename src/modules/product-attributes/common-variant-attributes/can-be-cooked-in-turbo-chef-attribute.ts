import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class CanBeCookedInTurboChefAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'canBeCookedInTurboChef'
  static readonly DEFAULT_VALUE = false

  private _tag = 'canBeCookedInTurboChef'
}
