import { ProductVariant } from '@commercetools/platform-sdk'

import { AbstractAttribute } from '../base-attributes/abstract-attribute'
import { CtAttributesResolver } from '../../ct-utils/get-attribute-value'

export class ProductRangeAttribute<ValueType = string[]> extends AbstractAttribute<ValueType> {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'productRange'
  static readonly DEFAULT_VALUE = []

  value: ValueType

  private _tag = 'ProductRangeAttribute'

  constructor(value: ValueType) {
    super()

    this.value = value
  }

  toString(): string {
    return JSON.stringify(this.value)
  }

  toJSON(): Record<string | number, any> {
    return {
      value: this.value,
    }
  }

  static createFromVariantAttributes(attrs: ProductVariant['attributes']) {
    const getAttribute = CtAttributesResolver.constructAttributeValueGetter(attrs!)
    const val = getAttribute<{ key: string; label: string }[]>(
      ProductRangeAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )

    return new ProductRangeAttribute((val || this.DEFAULT_VALUE).map(({ key }) => key))
  }
}
