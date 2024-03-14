import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class IncludeNutritionalInformationOnLabelAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'includeNutritionalInformationOnLabel'
  static readonly DEFAULT_VALUE = true

  private _tag = 'IncludeNutritionalInformationOnLabelAttribute'
}
