import { LocalisedStringAttribute } from '../base-attributes/localised-string-attribute'

export class DescriptionAttribute extends LocalisedStringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'description'

  private _tag = 'DescriptionAttribute'
}
