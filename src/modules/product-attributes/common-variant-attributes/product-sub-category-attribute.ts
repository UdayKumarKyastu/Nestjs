import { ProductVariant } from '@commercetools/platform-sdk'

import { CtAttributesResolver } from '../../ct-utils/get-attribute-value'
import { StringAttribute } from '../base-attributes/string-attribute'

export class ProductSubCategoryAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'productSubCategory'

  private _tag = 'ProductSubCategoryAttribute'

  static createFromVariantAttributes(attrs: ProductVariant['attributes']) {
    const getAttribute = CtAttributesResolver.constructAttributeValueGetter(attrs!)
    const val = getAttribute<{ key: string }>(ProductSubCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME)

    return val ? new ProductSubCategoryAttribute(val.key) : null
  }
}
