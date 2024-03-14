import { ProductVariant } from '@commercetools/platform-sdk'

import { CtAttributesResolver } from '../../ct-utils/get-attribute-value'
import { StringAttribute } from '../base-attributes/string-attribute'

export class PosIdAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'posId'

  private _tag = 'PosIdAttribute'

  static createFromVariantAttributes(attrs: ProductVariant['attributes']) {
    const getAttribute = CtAttributesResolver.constructAttributeValueGetter(attrs!)
    const val = getAttribute<string>(PosIdAttribute.COMMERCE_TOOLS_ATTR_NAME)

    return val ? new PosIdAttribute(val) : null
  }
}
