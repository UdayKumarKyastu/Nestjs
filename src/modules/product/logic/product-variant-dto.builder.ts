import { validateSync } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { InternalServerErrorException, Logger } from '@nestjs/common'

import { ChannelPriceDto } from '../../../shared/dto/channel-price.dto'
import { LiveStatus } from '../../../shared/model/live-status'
import { BaristaAttributesDto } from '../../../shared/dto/barista-attributes.dto'
import { ProductVariantDto } from '../../../shared/dto/product-variant.dto'
import { MultiLangStringDto } from '../../../shared/dto/multi-lang-string.dto'
import { VariantNutrition } from '../../variant-nutrition/variant-nutrition'
import { ProductVariantDescriptionDto } from '../../../shared/dto/variant-description.dto'
import { VariantVersionPreviewDto } from '../../variant-version/dto/variant-version-preview.dto'
import { VariantVersion } from '../../variant-version/model/variant-version'
import { VariantVersionsPublishStateService } from '../../variant-version/services/variant-versions-publish-state/variant-versions-publish-state.service'
import { VariantVersionPublishState } from '../../variant-version/model/variant-version-publish-state'
import { VariantAvailability } from '../../../shared/model/variant-availability'
import { LiveSchedule } from '../../../shared/model/live-schedule'
import { LabellingDto } from '../../../shared/dto/labelling.dto'
import { PosIdAttribute } from '../../product-attributes/common-variant-attributes/pos-id-attribute'
import { PluReportingNameAttribute } from '../../product-attributes/common-variant-attributes/plu-reporting-name-attribute'
import { PluPrimaryCategoryAttribute } from '../../product-attributes/common-variant-attributes/plu-primary-category-attribute'
import { PluSecondaryCategoryAttribute } from '../../product-attributes/common-variant-attributes/plu-secondary-category-attribute'
import { ProductCategoryAttribute } from '../../product-attributes/common-variant-attributes/product-category-attribute'
import { ProductSubCategoryAttribute } from '../../product-attributes/common-variant-attributes/product-sub-category-attribute'
import { VisibleAttribute } from '../../product-attributes/common-variant-attributes/visible-attribute'
import { ParentProductSkuAttribute } from '../../product-attributes/common-variant-attributes/parent-product-sku-attribute'
import { AverageWeightAttribute } from '../../product-attributes/common-variant-attributes/average-weight-attribute'
import { HgCodeAttribute } from '../../product-attributes/common-variant-attributes/hg-code-attribute'
import { LastUpdatedFromHgAttribute } from '../../product-attributes/common-variant-attributes/last-updated-from-hg-attribute'
import { VersionAttribute } from '../../product-attributes/common-variant-attributes/version-attribute'
import { HgRecipeStatusAttribute } from '../../product-attributes/food-variant-attributes/hg-recipe-status'
import { ProductRangeAttribute } from '../../product-attributes/common-variant-attributes/product-range-attribute'

import { MultilangString } from './models/multilang-string'
import { ParsedVariantReportingFields } from './models/variant-reporting'

/**
 * @deprecated
 *
 * Create variant module built from attributes and separate mapper to make dto
 */
export class ProductVariantDtoBuilder {
  private logger = new Logger(ProductVariantDtoBuilder.name)

  private sku!: string
  private status!: LiveStatus
  private hgCode!: HgCodeAttribute | null
  private hgSyncDate!: LastUpdatedFromHgAttribute | null
  private nutrition!: VariantNutrition
  private description!: ProductVariantDescriptionDto
  private name!: MultiLangStringDto
  private availability!: VariantAvailability
  private isMasterVariant!: boolean
  private size!: AverageWeightAttribute
  private baristaBeverageAttributes!: BaristaAttributesDto | null
  private imageUrl!: string | null
  private howToDisplay!: string[]
  private prices!: ChannelPriceDto[]
  private versions!: VariantVersionPreviewDto[]
  private labelling!: LabellingDto | null
  private parentProductSku!: ParentProductSkuAttribute | null
  private liveSchedule!: LiveSchedule
  private posID!: PosIdAttribute | null
  private pluReportingName!: PluReportingNameAttribute | null
  private pluPrimaryCategoryID!: PluPrimaryCategoryAttribute | null
  private pluSecondaryCategoryID!: PluSecondaryCategoryAttribute | null
  private starKisProductCategoryID!: ProductCategoryAttribute | null
  private starKisProductSubCategoryID!: ProductSubCategoryAttribute | null
  private version!: VersionAttribute
  private constituentHGCodes!: string[]
  private hgRecipeStatus!: HgRecipeStatusAttribute | null
  private recipeTypes!: string[] | null
  private productRange!: ProductRangeAttribute | null

  constructor() {
    this.isMasterVariant = false
    this.baristaBeverageAttributes = null
    this.imageUrl = null
  }

  withLiveSchedule(liveSchedule: LiveSchedule) {
    this.liveSchedule = liveSchedule

    return this
  }

  withVersionsPreview(versions: VariantVersion[]) {
    this.versions = versions.map(
      (v): VariantVersionPreviewDto => v.toPreviewDto(VariantVersionPublishState.Previous),
    )

    return this
  }

  withSku(sku: string) {
    this.sku = sku

    return this
  }

  withNutrition(nutrition: VariantNutrition) {
    this.nutrition = nutrition

    return this
  }

  withStatus(visible: VisibleAttribute) {
    this.status = visible ? LiveStatus.ACTIVE : LiveStatus.INACTIVE

    return this
  }

  withHamiltonGrant(hamiltonGrant: {
    productCode: HgCodeAttribute | null
    hgSyncDate: LastUpdatedFromHgAttribute | null
    constituentHGCodes: string[]
    hgRecipeStatus: HgRecipeStatusAttribute | null
    recipeTypes: string[] | null
  }) {
    this.hgCode = hamiltonGrant.productCode
    this.hgSyncDate = hamiltonGrant.hgSyncDate
    this.constituentHGCodes = hamiltonGrant.constituentHGCodes
    this.hgRecipeStatus = hamiltonGrant.hgRecipeStatus
    this.recipeTypes = hamiltonGrant.recipeTypes

    return this
  }

  withDescription(description: { standard: MultilangString }) {
    this.description = {
      standard: description.standard.toDto(),
    }

    return this
  }

  withName(name: MultilangString) {
    this.name = name.toDto()

    return this
  }

  withAvailability(availability: VariantAvailability) {
    this.availability = availability

    return this
  }

  asMasterVariant(isMaster: boolean) {
    this.isMasterVariant = isMaster

    return this
  }

  withSize(size: AverageWeightAttribute) {
    this.size = size

    return this
  }

  withBaristaBeverageAttributes(attributes: BaristaAttributesDto) {
    this.baristaBeverageAttributes = attributes

    return this
  }

  withImage(imageUrl: string | null) {
    this.imageUrl = imageUrl

    return this
  }

  withReporting(data: ParsedVariantReportingFields) {
    this.posID = data.posID
    this.pluReportingName = data.pluReportingName
    this.pluPrimaryCategoryID = data.pluPrimaryCategoryID
    this.pluSecondaryCategoryID = data.pluSecondaryCategoryID
    this.starKisProductCategoryID = data.starKisProductCategoryID
    this.starKisProductSubCategoryID = data.starKisProductSubCategoryID
    this.productRange = data.productRange

    return this
  }

  withHowToDisplay(howToDisplayKeys: string[]) {
    this.howToDisplay = howToDisplayKeys

    return this
  }

  withPrices(prices: ChannelPriceDto[]) {
    this.prices = prices

    return this
  }

  withLabelling(labelling: LabellingDto) {
    this.labelling = labelling

    return this
  }

  withParentProductSku(parentProductSku: ParentProductSkuAttribute | null) {
    this.parentProductSku = parentProductSku

    return this
  }

  withVersion(version: VersionAttribute) {
    this.version = version

    return this
  }

  build(): ProductVariantDto {
    try {
      const variant: ProductVariantDto = {
        starKisProductCategoryID: this.starKisProductCategoryID?.value ?? null,
        pluReportingName: this.pluReportingName?.value ?? null,
        starKisProductSubCategoryID: this.starKisProductSubCategoryID?.value ?? null,
        pluPrimaryCategoryID: this.pluPrimaryCategoryID?.value ?? null,
        pluSecondaryCategoryID: this.pluSecondaryCategoryID?.value ?? null,
        posID: this.posID?.value ?? null,
        productRange: this.productRange?.value ?? null,
        howToDisplay: this.howToDisplay,
        prices: this.prices,
        sku: this.sku,
        status: this.status,
        version: this.version?.value ?? null,
        hamiltonGrant: {
          productCode: this.hgCode?.value ?? null,
          lastSyncedAt: this.hgSyncDate?.value.toISOString() ?? null,
          constituentHGCodes: this.constituentHGCodes,
          hgRecipeStatus: this.hgRecipeStatus?.value ?? null,
          recipeTypes: this.recipeTypes || null,
          cuisine: {
            isVegan: this.nutrition.isVegan,
            isVegetarian: this.nutrition.isVegetarian,
          },
          nutrition:
            this.nutrition.nutritionals?.map((ctNutritional) => ({
              name: ctNutritional.item,
              localisedLabel: ctNutritional.localizedLabel.toDto(),
              per100g: ctNutritional.per100g,
              perServing: ctNutritional.perServing,
            })) || [],
          allergens:
            this.nutrition.allergens?.map((ctAllergen) => ({
              name: ctAllergen.key,
              label: new MultilangString(ctAllergen.label).toDto(),
            })) || [],
          ingredients: new MultilangString(this.nutrition.ingredients || {}).toDto(),
        },
        description: this.description,
        name: this.name,
        image: this.imageUrl
          ? {
              default: this.imageUrl,
              thumbnail: this.imageUrl,
            }
          : null,
        availability: this.availability.toDto(this.liveSchedule),
        isMaster: this.isMasterVariant,
        size: this.size.toString(),
        attributes: this.baristaBeverageAttributes,
        versions: this.versions.map((v) => ({
          ...v,
          publishState: new VariantVersionsPublishStateService(
            this.liveSchedule.on,
          ).getVariantPublishState(v),
          name: v.name || this.name,
        })),
        labelling: this.labelling ?? null,
        parentProductSku: this.parentProductSku?.value ?? null,
      }

      try {
        const model = plainToClass(ProductVariantDto, variant)

        const errors = validateSync(model)

        if (errors.length) {
          throw new Error(errors[0].toString())
        }
      } catch (e) {
        this.logger.error('Error validating created variant DTO')
        this.logger.error(e)
      }

      return variant
    } catch (e) {
      this.logger.error(e)
      this.logger.error(
        `Error creating DTO in ProductVariantDtoBuilder. Check if all fields are provided: ${
          (e as Error)?.message
        }`,
      )
      throw new InternalServerErrorException('Error constructing variant DTO')
    }
  }
}
