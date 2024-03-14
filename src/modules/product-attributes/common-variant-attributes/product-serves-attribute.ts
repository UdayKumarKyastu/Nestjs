import { StringAttribute } from '../base-attributes/string-attribute'

export class ProductServesAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'productServes'

  private _tag = 'ProductServesAttribute'
}
