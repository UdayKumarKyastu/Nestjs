import { StringAttribute } from '../base-attributes/string-attribute'

export class HgCodeAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'hgCode'

  private _tag = 'HgCodeAttribute'
}
