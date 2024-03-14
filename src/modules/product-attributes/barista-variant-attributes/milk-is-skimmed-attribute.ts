import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class MilkIsSkimmedAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'milkIsSkimmed'

  private _tag = 'MilkIsSkimmedAttribute'
}
