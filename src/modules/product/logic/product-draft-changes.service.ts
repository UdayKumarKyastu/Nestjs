import { Injectable } from '@nestjs/common'
import { ProductVariant } from '@commercetools/platform-sdk'

import { ProductDto } from '../../../shared/dto/product.dto'
import { ProductDraftChangesDto } from '../../../shared/dto/product-draft-changes.dto'
import { ProductTypeKey, ProductTypeKeyParser } from '../../product-type/product-type-key'
import { DraftChangesCounterService } from '../draft-changes-counter.service'
import { PricingService } from '../../pricing/pricing.service'
import { CategoryNestedListBuilderService } from '../../categories/category-nested-list-builder.service'
import { ProductImageService } from '../../content-management/services/product-image.service'
import { CtProductDao } from '../../ct-product/ct-product.dao'
import { CountryCodeParser } from '../../../shared/model/country-code'

import { MultilangString } from './models/multilang-string'
import { BaristaBeverageProductSetup } from './models/barista-beverage-product-setup'
import { ProductMapper } from './product.mapper'

@Injectable()
export class ProductDraftChangesService {
  constructor(
    private readonly _draftChangesCounterService: DraftChangesCounterService,
    private readonly _categoryNestedListBuilderService: CategoryNestedListBuilderService,
    private readonly _productImageService: ProductImageService,
    private readonly _productDao: CtProductDao,
    private readonly _productMapper: ProductMapper,
    private _pricingService: PricingService,
  ) {}

  /**
   * todo refactor - calculate draft changes after having mapper published,
   *   use same mapping logic
   */
  async getProductDraftChanges(
    sku: string,
    productDto: ProductDto,
  ): Promise<ProductDraftChangesDto> {
    const product = await this._productDao.getOneProductBySkuOrThrow(sku)

    const type = ProductTypeKeyParser.parseKey(product.productType.obj?.key)

    const stagedData = product.masterData.staged
    const currentData = product.masterData.current

    const allVariants: ProductVariant[] = [stagedData.masterVariant, ...stagedData.variants]

    const allVariantsSkus = allVariants.map((variant) => variant.sku!)
    const allPublishedVariants: ProductVariant[] = [
      product.masterData.current.masterVariant,
      ...product.masterData.current.variants,
    ]

    const images = await this._productImageService.getImagesForGivenSkus(allVariantsSkus)
    const countryCode = new CountryCodeParser().parse(productDto.countryCode)
    const pricingChannels = await this._pricingService.getPricingChannelsByCountryCode(countryCode)

    const mappedDraftVariants = await this._productMapper.mapCtVariantsToVariantsDto(
      allVariants,
      images,
      type,
      new MultilangString(stagedData.name),
      new MultilangString(stagedData.description || {}),
      pricingChannels,
      {},
    )

    const masterVariantRawAttributes = product.masterData.staged.masterVariant.attributes

    const baseDraft: ProductDraftChangesDto = {
      name: new MultilangString(product.masterData.staged.name).toDto(),
      description: new MultilangString(
        product.masterData.staged.description || product.masterData.current.description || {},
      ).toDto(),
      lastEdit: product.lastModifiedAt,
      createdAt: product.createdAt,
      published: product.masterData.published,
      taxCategory: product.taxCategory
        ? {
            id: product.taxCategory.id,
          }
        : null,
      variants: mappedDraftVariants.map((variant, index) => {
        const isFirstItem = index === 0
        const variantModel = this._productMapper.mapCtVariantToVariantModel(
          allPublishedVariants[index],
          type,
          isFirstItem,
          new MultilangString(product.masterData.current.name),
        )

        const draftVariantModel = this._productMapper.mapCtVariantToVariantModel(
          allVariants[index],
          type,
          isFirstItem,
          new MultilangString(stagedData.name),
        )

        return {
          ...variant,
          changesCount: {
            marketing: this._draftChangesCounterService.compareVariantMarketing(
              variantModel,
              draftVariantModel,
            ),
            reporting: this._draftChangesCounterService.compareVariantReporting(
              variantModel,
              draftVariantModel,
            ),
            attributes:
              type === ProductTypeKey.BaristaBeverage
                ? this._draftChangesCounterService.compareVariantAttributes(
                    variantModel,
                    draftVariantModel,
                  )
                : 0,
            pricing: this._draftChangesCounterService.compareVariantPricing(
              variantModel,
              draftVariantModel,
            ),
            labelling:
              type === ProductTypeKey.Food
                ? this._draftChangesCounterService.compareVariantLabelling(
                    variantModel,
                    draftVariantModel,
                  )
                : 0,
            total: this._draftChangesCounterService.compareVariant(variantModel, draftVariantModel),
          },
        }
      }),
      categories:
        await this._categoryNestedListBuilderService.buildCategoriesListsDtoFromReferences(
          product.masterData.staged.categories,
        ),
      changesCount: {
        marketing: 0,
        categories: 0,
        setUp: 0,
        total: 0,
      },
      setUp:
        type === ProductTypeKey.BaristaBeverage
          ? new BaristaBeverageProductSetup(masterVariantRawAttributes).toDto()
          : null,
    }

    baseDraft.changesCount = {
      marketing: 0,
      categories: this._draftChangesCounterService.compareProductCategories(
        currentData,
        stagedData,
      ),
      setUp: this._draftChangesCounterService.compareProductSetUp(currentData, stagedData),
      total: this._draftChangesCounterService.compareProduct(currentData, stagedData),
    }

    return baseDraft
  }
}
