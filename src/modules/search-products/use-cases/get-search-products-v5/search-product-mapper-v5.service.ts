import { Injectable } from '@nestjs/common'
import { ProductProjection, ProductVariant } from '@commercetools/platform-sdk'

import { RawCommercetoolsProductTypeAttributes } from '../../../product-attributes/raw-commercetools-product-type-attributes'
import { MultilangString } from '../../../product/logic/models/multilang-string'
import { ProductSkuWithImage } from '../../../content-management/services/product-image.service'
import { CommonProductVariantAttributes } from '../../../product-attributes/common-product-variant-attributes'
import { ProductTypeKey, ProductTypeKeyParser } from '../../../product-type/product-type-key'
import { MultiLangStringDto } from '../../../../shared/dto/multi-lang-string.dto'
import { BaristaBeverageVariantAttributes } from '../../../product-attributes/barista-beverage-variant-attributes'

import { SearchListProductDto } from './search-list-product.dto'

export interface ISearchProductMapperV4Service {
  mapProductsToDto(
    productProjections: ProductProjection[],
    productImages: ProductSkuWithImage[],
  ): SearchListProductDto[]
}

@Injectable()
export class SearchProductMapperV5Service implements ISearchProductMapperV4Service {
  private resolveNameDto(
    projection: ProductProjection,
    variant: ProductVariant,
  ): MultiLangStringDto {
    const type = ProductTypeKeyParser.parseProductProjection(projection)

    if (type === ProductTypeKey.Food) {
      return new MultilangString(projection.name).toDto()
    }

    if (type === ProductTypeKey.BaristaBeverage) {
      const baristaAttrs = new BaristaBeverageVariantAttributes(variant.attributes)

      return baristaAttrs.variantName.toMultiLangString().toDto()
    } else {
      throw new Error(
        `Only ${ProductTypeKey.Food} and ${ProductTypeKey.BaristaBeverage} is supported`,
      )
    }
  }

  mapProductsToDto(
    productProjections: ProductProjection[],
    productImages: ProductSkuWithImage[],
  ): SearchListProductDto[] {
    return productProjections.map((projection) => {
      const attributes = new RawCommercetoolsProductTypeAttributes(
        projection.masterVariant.attributes!,
      )
      const projectionVariants = [projection.masterVariant, ...projection.variants]
      const visibleOnWebsiteVariants = projectionVariants
        .map((variant) => new RawCommercetoolsProductTypeAttributes(variant.attributes!).visible)
        .filter(Boolean).length

      return {
        sku: projection.masterVariant.sku!,
        name: new MultilangString(projection.name).toDto(),
        description: new MultilangString(projection.description || {}).toDto(),
        createdAt: projection.createdAt,
        countryCode: attributes.country.key,
        published: !!projection.published,
        visibleOnWebsiteVariants,

        variants: projectionVariants.map((variant, index) => {
          const image = productImages.find((image) => image.sku === variant.sku!)?.imageUrl || null
          const commonAttrs = new CommonProductVariantAttributes(variant.attributes!)

          return {
            sku: variant.sku!,
            name: this.resolveNameDto(projection, variant),
            description: commonAttrs.description.toMultiLangString().toDto(),
            isMaster: index === 0,
            imageUrl: image || null,
            hgCode: commonAttrs.hgCode?.value ?? null,
            createdAt: projection.createdAt,
            countryCode: attributes.country.key,
            published: !!projection.published,
            visibleOnWebsite: commonAttrs.visible.value,
          }
        }),
      }
    })
  }
}
