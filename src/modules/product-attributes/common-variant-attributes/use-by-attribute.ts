import { StringAttribute } from '../base-attributes/string-attribute'

export class UseByAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'useBy'

  private _tag = 'UseByAttribute'
}
