import { ProductVariant } from '@commercetools/platform-sdk'

import { CtAttributesResolver } from '../../ct-utils/get-attribute-value'
import { StringAttribute } from '../base-attributes/string-attribute'

export class ParentProductSkuAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'parentProductSku'

  private _tag = 'ParentProductSkuAttribute'

  static createFromVariantAttributes(attrs: ProductVariant['attributes']) {
    const getAttribute = CtAttributesResolver.constructAttributeValueGetter(attrs!)
    const val = getAttribute<string>(ParentProductSkuAttribute.COMMERCE_TOOLS_ATTR_NAME)

    return val ? new ParentProductSkuAttribute(val) : null
  }
}
