import { ProductVariant } from '@commercetools/platform-sdk'

import { CtAttributesResolver } from '../../ct-utils/get-attribute-value'
import { StringAttribute } from '../base-attributes/string-attribute'

export class PluSecondaryCategoryAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'pluSecondaryCategory'

  private _tag = 'PluSecondaryCategoryAttribute'

  static createFromVariantAttributes(attrs: ProductVariant['attributes']) {
    const getAttribute = CtAttributesResolver.constructAttributeValueGetter(attrs!)
    const val = getAttribute<{ key: string }>(
      PluSecondaryCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )

    return val ? new PluSecondaryCategoryAttribute(val.key) : null
  }
}
