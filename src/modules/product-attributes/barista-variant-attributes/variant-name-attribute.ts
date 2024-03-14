import { LocalisedStringAttribute } from '../base-attributes/localised-string-attribute'

export class VariantNameAttribute extends LocalisedStringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'variantName'

  private _tag = 'VariantNameAttribute'
}
