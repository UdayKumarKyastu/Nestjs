import { NumberAttribute } from '../base-attributes/number-attribute'

export class AverageWeightAttribute extends NumberAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'averageWeight'
  static readonly DEFAULT_VALUE = 0

  private _tag = 'AverageWeightAttribute'
}
