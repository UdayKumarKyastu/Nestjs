import { StringAttribute } from '../base-attributes/string-attribute'

export class LegalTitleAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'legalTitle'

  private _tag = 'LegalTitleAttribute'
}
