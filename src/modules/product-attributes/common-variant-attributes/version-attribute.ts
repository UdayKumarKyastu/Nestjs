import { NumberAttribute } from '../base-attributes/number-attribute'

export class VersionAttribute extends NumberAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'version'
  static readonly DEFAULT_VALUE = 1

  private _tag = 'VersionAttribute'
}
