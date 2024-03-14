import { ProductVariant } from '@commercetools/platform-sdk'

import { VariantVersion } from '../../../variant-version/model/variant-version'
import { RawCommercetoolsProductTypeAttributes } from '../../../product-attributes/raw-commercetools-product-type-attributes'

export class VariantLiveDates {
  from: Date | null
  to: Date | null

  constructor(opts: { from: Date | string | null; to: Date | string | null }) {
    this.from = opts.from ? new Date(opts.from) : null
    this.to = opts.to ? new Date(opts.to) : null
  }

  static fromCtVariant(variant: ProductVariant) {
    const rawAttrs = new RawCommercetoolsProductTypeAttributes(variant.attributes!)

    return new VariantLiveDates({
      from: rawAttrs.liveFrom || null,
      to: rawAttrs.liveTo || null,
    })
  }

  static fromVariantVersion(variantVersion: VariantVersion) {
    return new VariantLiveDates({
      from: variantVersion.liveFrom,
      to: variantVersion.liveTo,
    })
  }
}
