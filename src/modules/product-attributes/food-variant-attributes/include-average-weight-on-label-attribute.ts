import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class IncludeAverageWeightOnLabelAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'includeAverageWeightOnLabel'
  static readonly DEFAULT_VALUE = true

  private _tag = 'IncludeAverageWeightOnLabelAttribute'
}
