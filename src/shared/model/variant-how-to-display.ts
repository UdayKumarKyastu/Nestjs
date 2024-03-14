import { ProductVariant } from '@commercetools/platform-sdk'

import { CommonProductVariantAttributes } from '../../modules/product-attributes/common-product-variant-attributes'

export class VariantHowToDisplay {
  keys: string[]

  constructor(keys: string[]) {
    this.keys = [...keys]
  }
}

export class VariantHowToDisplayFactory {
  static fromCtVariant(variant: Pick<ProductVariant, 'attributes'>) {
    const commonAttrs = new CommonProductVariantAttributes(variant.attributes!)

    return new VariantHowToDisplay(commonAttrs.howToDisplay.value.map((htd) => htd.key))
  }
}
