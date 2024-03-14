import { ProductVariant } from '@commercetools/platform-sdk'

import { CtAttributesResolver } from '../../ct-utils/get-attribute-value'
import { StringAttribute } from '../base-attributes/string-attribute'

export class PluReportingNameAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'pluReportingName'

  private _tag = 'PluReportingNameAttribute'

  static createFromVariantAttributes(attrs: ProductVariant['attributes']) {
    const getAttribute = CtAttributesResolver.constructAttributeValueGetter(attrs!)
    const val = getAttribute<string>(PluReportingNameAttribute.COMMERCE_TOOLS_ATTR_NAME)

    return val ? new PluReportingNameAttribute(val) : null
  }
}
