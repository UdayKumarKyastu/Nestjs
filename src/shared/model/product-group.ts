import { Product, ProductCatalogData, ProductVariant } from '@commercetools/platform-sdk'
import { BadRequestException } from '@nestjs/common'

import { ProductTypeKey, ProductTypeKeyParser } from '../../modules/product-type/product-type-key'
import { VariantsExtractor } from '../../modules/ct-utils/variants-extractor'
import { MultilangString } from '../../modules/product/logic/models/multilang-string'

export class ProductGroup {
  constructor(private ctProduct: Product) {}

  getProductType(): ProductTypeKey {
    return ProductTypeKeyParser.parseKey(this.ctProduct.productType.obj?.key)
  }

  isBaristaType(): boolean {
    return this.getProductType() === ProductTypeKey.BaristaBeverage
  }

  isFoodType(): boolean {
    return this.getProductType() === ProductTypeKey.Food
  }

  createVariantsExtractor() {
    return new VariantsExtractor(this.ctProduct)
  }

  getMasterData(): ProductCatalogData {
    return this.ctProduct.masterData
  }

  getMasterVariant(): ProductVariant {
    return this.getMasterData().current.masterVariant
  }

  getStagedVariant(sku: string): ProductVariant | null {
    return this.getMasterAndAllVariants('staged').find((v) => v.sku === sku) ?? null
  }

  getMasterAndAllVariants(source: 'current' | 'staged' = 'current'): ProductVariant[] {
    return [this.getMasterData()[source].masterVariant, ...this.getMasterData()[source].variants]
  }

  getProductGroupName(source: 'current' | 'staged' = 'current'): MultilangString {
    return new MultilangString(this.getMasterData()[source].name)
  }

  getProductGroupDescription(source: 'current' | 'staged' = 'current'): MultilangString {
    return new MultilangString(this.getMasterData()[source].description || {})
  }

  getVariantBySkuOrThrow(
    sku: string,
    error = new BadRequestException(
      `Expected ${this.ctProduct.key} to have variant with sku ${sku}`,
    ),
  ) {
    const variant = this.getMasterAndAllVariants().find((v) => v.sku === sku)

    if (!variant) {
      throw error
    }

    return variant
  }
}
