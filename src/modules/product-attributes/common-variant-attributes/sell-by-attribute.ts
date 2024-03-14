import { StringAttribute } from '../base-attributes/string-attribute'

export class SellByAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'sellBy'

  private _tag = 'SellByAttribute'
}
