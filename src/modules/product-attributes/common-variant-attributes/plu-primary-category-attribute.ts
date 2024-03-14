import { ProductVariant } from '@commercetools/platform-sdk'

import { CtAttributesResolver } from '../../ct-utils/get-attribute-value'
import { StringAttribute } from '../base-attributes/string-attribute'

export class PluPrimaryCategoryAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'pluPrimaryCategory'

  private _tag = 'PluPrimaryCategoryAttribute'

  static createFromVariantAttributes(attrs: ProductVariant['attributes']) {
    const getAttribute = CtAttributesResolver.constructAttributeValueGetter(attrs!)
    const val = getAttribute<{ key: string; label: string }>(
      PluPrimaryCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )

    return val ? new PluPrimaryCategoryAttribute(val.key) : null
  }
}
