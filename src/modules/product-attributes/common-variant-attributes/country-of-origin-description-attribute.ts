import { StringAttribute } from '../base-attributes/string-attribute'

export class CountryOfOriginDescriptionAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'countryOfOriginDescription'

  private _tag = 'CountryOfOriginDescriptionAttribute'
}
