import { ProductVariant } from '@commercetools/platform-sdk'

import { CtAttributesResolver } from '../../ct-utils/get-attribute-value'
import { StringAttribute } from '../base-attributes/string-attribute'

export class ProductCategoryAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'productCategory'

  private _tag = 'ProductCategoryAttribute'

  static createFromVariantAttributes(attrs: ProductVariant['attributes']) {
    const getAttribute = CtAttributesResolver.constructAttributeValueGetter(attrs!)
    const val = getAttribute<{ key: string }>(ProductCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME)

    return val ? new ProductCategoryAttribute(val.key) : null
  }
}
