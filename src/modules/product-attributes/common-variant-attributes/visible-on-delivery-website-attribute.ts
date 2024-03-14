import { BooleanAttribute } from '../base-attributes/boolean-attribute'

export class VisibleOnDeliveryWebsiteAttribute extends BooleanAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'visibleOnDeliveryWebsite'
  static readonly DEFAULT_VALUE = false

  private _tag = 'VisibleOnDeliveryWebsiteAttribute'
}
