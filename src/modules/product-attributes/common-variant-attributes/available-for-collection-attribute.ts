import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class AvailableForCollectionAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'availableForCollection'
  static readonly DEFAULT_VALUE = false

  private _tag = 'AvailableForCollectionAttribute'
}
