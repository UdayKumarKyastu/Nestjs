import { Channel, ProductProjection, ProductVariant } from '@commercetools/platform-sdk'
import { Inject, Injectable } from '@nestjs/common'

import {
  ProductImageService,
  ProductSkuWithImage,
} from '../../content-management/services/product-image.service'
import { ProductVariantDto } from '../../../shared/dto/product-variant.dto'
import { TaxCategoryDto } from '../../../shared/dto/tax-category.dto'
import { CategoryNestedListBuilderService } from '../../categories/category-nested-list-builder.service'
import {
  ITaxCategoriesService,
  TaxCategoriesService,
} from '../../product-taxation/tax-categories.service'
import { PricingService } from '../../pricing/pricing.service'
import { ProductTypeKey, ProductTypeKeyParser } from '../../product-type/product-type-key'
import { ProductDto } from '../../../shared/dto/product.dto'
import { VariantVersionFetcherService } from '../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { VariantVersion } from '../../variant-version/model/variant-version'
import { ProductLabellingCardService } from '../../labelling-card/product-labelling-card.service'
import { CommonProductVariantAttributes } from '../../product-attributes/common-product-variant-attributes'
import { BaristaProductVariant, FoodProductVariant } from '../../product-variant/product-variant'
import { Sku } from '../../../shared/model/sku'
import { VariantToDtoMapper } from '../../product-variant/product.variant-to-dto-mapper'
import { VariantNameAttribute } from '../../product-attributes/barista-variant-attributes/variant-name-attribute'
import { DescriptionAttribute } from '../../product-attributes/common-variant-attributes/description-attribute'
import { CtAttributesResolver } from '../../ct-utils/get-attribute-value'
import { CountryCode } from '../../../shared/model/country-code'

import { BaristaBeverageProductSetup } from './models/barista-beverage-product-setup'
import { MultilangString } from './models/multilang-string'

/**
 * TODO Refactor
 */
@Injectable()
export class ProductMapper {
  constructor(
    private readonly _productImageService: ProductImageService,
    @Inject(TaxCategoriesService) private readonly _taxCategoriesService: ITaxCategoriesService,
    private readonly _categoryNestedListBuilderService: CategoryNestedListBuilderService,
    private _pricingService: PricingService,
    private _variantVersionService: VariantVersionFetcherService,
    private readonly _productLabellingCardService: ProductLabellingCardService,
  ) {}

  mapSingleProductProjectionToProductDto = async (
    productGroup: ProductProjection,
  ): Promise<ProductDto> => {
    const productTypeKey = ProductTypeKeyParser.parseProductProjection(productGroup)

    const productGroupName = new MultilangString(productGroup.name)
    const productGroupDescription = new MultilangString(productGroup.description || {})
    const masterVariantRawAttributes = productGroup.masterVariant.attributes
    const { country: masterVariantCountry } = new CommonProductVariantAttributes(
      masterVariantRawAttributes!,
    )

    const allVariants = [productGroup.masterVariant, ...productGroup.variants]

    const allVariantsSkus = allVariants.map((variant) => variant.sku!)
    const images = await this._productImageService.getImagesForGivenSkus(allVariantsSkus)
    const pricingChannels = await this._pricingService.getPricingChannelsByCountryCode(
      masterVariantCountry.asEnum(),
    )

    const versions = await this.createVersionByVariantSkuRecord(allVariants)

    const productVariants = await this.mapCtVariantsToVariantsDto(
      allVariants,
      images,
      productTypeKey,
      productGroupName,
      productGroupDescription,
      pricingChannels,
      versions,
    )

    const categories =
      await this._categoryNestedListBuilderService.buildCategoriesListsDtoFromReferences(
        productGroup.categories,
      )

    const product: ProductDto = {
      type: productTypeKey,
      name: productGroupName.toDto(),
      description: new MultilangString(productGroup.description || {}).toDto(),
      country: masterVariantCountry.printEnglishName()!,
      countryCode: masterVariantCountry.asEnum(),
      categories: categories,
      taxCategory: await this.extractTaxCategory(productGroup),
      variants: productVariants,
      setUp: null,
      published: productGroup.published!,
      createdAt: productGroup.createdAt,
      takeAwayTaxDisabled: masterVariantCountry.asEnum() === CountryCode.UK,
    }

    if (productTypeKey === ProductTypeKey.BaristaBeverage) {
      const productSetup = new BaristaBeverageProductSetup(masterVariantRawAttributes)

      product.setUp = productSetup.toDto()
    }

    return product
  }

  async mapCtVariantsToVariantsDto(
    variants: ProductVariant[],
    productImages: ProductSkuWithImage[],
    type: ProductTypeKey,
    productGroupName: MultilangString,
    productGroupDescription: MultilangString,
    pricingChannels: Channel[],
    versions: Record<string, VariantVersion[]>,
  ): Promise<ProductVariantDto[]> {
    const mapper = new VariantToDtoMapper({
      howToCardGenerator: this._productLabellingCardService,
      images: productImages,
      pricingChannels,
    })

    return Promise.all(
      variants.map(async (variant, idx) => {
        const isFirstItem = idx === 0

        const variantModel = this.mapCtVariantToVariantModel(
          variant,
          type,
          isFirstItem,
          productGroupName,
        )

        return mapper.mapVariantToDto(isFirstItem, variantModel, versions[variant.sku ?? ''] ?? [])
      }),
    )
  }

  mapCtVariantToVariantModel(
    variant: ProductVariant,
    type: ProductTypeKey,
    isMaster: boolean,
    productGroupName: MultilangString,
  ): BaristaProductVariant | FoodProductVariant {
    const getAttributeValue = CtAttributesResolver.constructAttributeValueGetter(
      variant.attributes!,
    )

    let variantModel: BaristaProductVariant | FoodProductVariant

    const variantName = getAttributeValue(VariantNameAttribute)
      ? new VariantNameAttribute(getAttributeValue(VariantNameAttribute)).toMultiLangString()
      : new MultilangString({})

    const variantDescription = getAttributeValue(DescriptionAttribute)
      ? new VariantNameAttribute(getAttributeValue(DescriptionAttribute)).toMultiLangString()
      : new MultilangString({})

    switch (type) {
      case ProductTypeKey.Food:
        variantModel = FoodProductVariant.create({
          sku: new Sku(variant.sku!),
          ctAttributes: variant.attributes!,
          name: isMaster ? productGroupName : variantName,
          description: variantDescription,
          prices: variant.prices ?? [],
        })
        break
      case ProductTypeKey.BaristaBeverage:
        variantModel = BaristaProductVariant.create({
          sku: new Sku(variant.sku!),
          ctAttributes: variant.attributes!,
          name: variantName,
          description: variantDescription,
          prices: variant.prices ?? [],
        })
        break
    }

    return variantModel
  }

  private async createVersionByVariantSkuRecord(variants: ProductVariant[]) {
    const variantsVersions = await Promise.all(
      variants.map((variant) => {
        return this._variantVersionService
          .fetchVariantVersionsForVariant(variant.sku!, variant)
          .then((result) => ({
            sku: variant.sku!,
            version: result,
          }))
      }),
    )

    return variantsVersions.reduce((record, version) => {
      record[version.sku!] = version.version.map((v) => {
        return VariantVersion.fromRawCtObject(v.id, version.sku, v.data)
      })

      return record
    }, {} as Record<string, VariantVersion[]>)
  }

  private async extractTaxCategory(projection: ProductProjection): Promise<TaxCategoryDto | null> {
    if (!projection.taxCategory?.id) {
      return null
    }

    const allCategories = await this._taxCategoriesService.findAll()

    return allCategories.find((cat) => cat.id === projection.taxCategory?.id) || null
  }
}
