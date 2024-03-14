import { Product, ProductVariant } from '@commercetools/platform-sdk'
import { NotFoundException } from '@nestjs/common'

export class VariantsExtractor {
  constructor(private product: Product) {}

  getMasterVariant(): ProductVariant {
    return this.product.masterData.current.masterVariant
  }

  getAllVariants(): ProductVariant[] {
    return [
      this.product.masterData.current.masterVariant,
      ...this.product.masterData.current.variants,
    ]
  }

  getAllDraftVariants(): ProductVariant[] {
    return [
      this.product.masterData.staged.masterVariant,
      ...this.product.masterData.staged.variants,
    ]
  }

  getVariantBySku(sku: string): ProductVariant | null {
    return this.getAllVariants().find((v) => v.sku === sku) || null
  }

  getVariantBySkuOrThrow(
    sku: string,
    error = new NotFoundException(
      `Variant ${sku} not found for product: ${this.product.masterData.current.masterVariant.sku}`,
    ),
  ): ProductVariant {
    const variant = this.getVariantBySku(sku)

    if (!variant) {
      throw error
    }

    return variant
  }

  isMasterVariant(sku: string): boolean {
    return this.product.masterData.current.masterVariant.sku === sku
  }

  getAllVariantsSkus(): string[] {
    return this.getAllVariants().map((v) => v.sku!)
  }
}
