import { Inject, Injectable } from '@nestjs/common'
import { merge } from 'lodash'
import { ProductVariant } from '@commercetools/platform-sdk'

import {
  ICanFetchVariantVersions,
  VariantVersionFetcherService,
} from '../../services/variant-version-fetcher/variant-version-fetcher.service'
import { CtProductDao, ICanGetCtProduct } from '../../../ct-product/ct-product.dao'
import { VariantVersion } from '../../model/variant-version'
import { MultilangString } from '../../../product/logic/models/multilang-string'
import { VariantNutritionService } from '../../../variant-nutrition/variant-nutrition.service'
import {
  ICanFetchPricingChannelsByCountryCode,
  PricingService,
} from '../../../pricing/pricing.service'
import {
  ICanFetchProductImages,
  ProductImageService,
} from '../../../content-management/services/product-image.service'
import { CommonProductVariantAttributes } from '../../../product-attributes/common-product-variant-attributes'
import { DraftChangesCounterService } from '../../../product/draft-changes-counter.service'
import { ProductVariantDraftChangesDto } from '../../../../shared/dto/product-variant-draft-changes.dto'
import { VariantVersionsPublishStateService } from '../../services/variant-versions-publish-state/variant-versions-publish-state.service'
import { VariantVersionControllerParams } from '../../variant-version-controller-params'
import { ProductVariantDtoBuilder } from '../../../product/logic/product-variant-dto.builder'
import { mapPricesToChannelPriceDto } from '../../../ct-utils/get-channel-price'
import { BaristaBeverageVariantAttributes } from '../../../product-attributes/barista-beverage-variant-attributes'
import { HowToCardData, VariantLabelling } from '../../../../shared/model/variant-labelling'
import { VariantHowToDisplayFactory } from '../../../../shared/model/variant-how-to-display'
import { VariantAvailability } from '../../../../shared/model/variant-availability'
import { ProductGroup } from '../../../../shared/model/product-group'
import { ProductVariantDto } from '../../../../shared/dto/product-variant.dto'
import { LiveSchedule } from '../../../../shared/model/live-schedule'
import { BaristaAttributes } from '../../../../shared/model/barista-attributes'
import {
  AllergenDtoCreator,
  ICanCreateAllergensDto,
} from '../../services/allergen-dto-creator/allergen-dto-creator'
import {
  ICanCreateNutritionalsDto,
  NutritionalsDtoCreator,
} from '../../services/nutritionals-dto-creator/nutritionals-dto-creator'
import { VersionObjectCompletionChecker } from '../../services/version-object-completion-checker/version-object-completion-checker'
import { ProductLabellingCardService } from '../../../labelling-card/product-labelling-card.service'
import { PluReportingNameAttribute } from '../../../product-attributes/common-variant-attributes/plu-reporting-name-attribute'
import { PosIdAttribute } from '../../../product-attributes/common-variant-attributes/pos-id-attribute'
import { PluSecondaryCategoryAttribute } from '../../../product-attributes/common-variant-attributes/plu-secondary-category-attribute'
import {
  ParsedVariantReportingFields,
  VariantReportingFieldsParser,
} from '../../../product/logic/models/variant-reporting'
import { CtAttributesResolver } from '../../../ct-utils/get-attribute-value'
import { ProductCategoryAttribute } from '../../../product-attributes/common-variant-attributes/product-category-attribute'
import { ProductSubCategoryAttribute } from '../../../product-attributes/common-variant-attributes/product-sub-category-attribute'
import { PluPrimaryCategoryAttribute } from '../../../product-attributes/common-variant-attributes/plu-primary-category-attribute'
import { ParentProductSkuAttribute } from '../../../product-attributes/common-variant-attributes/parent-product-sku-attribute'
import { AverageWeightAttribute } from '../../../product-attributes/common-variant-attributes/average-weight-attribute'
import { ProductRangeAttribute } from '../../../product-attributes/common-variant-attributes/product-range-attribute'
import { FoodVariantAttributes } from '../../../product-attributes/food-variant-attributes'
import { ReviewStatusService } from '../../../product/logic/review-status/review-status.service'
import { DIFF_TYPES } from '../../../product/logic/review-status/models/diff-types'
import { ReviewStatusCounter } from '../../../product/logic/review-status/review-status-counter/review-status-counter'

import { GetVariantVersionDto } from './get-variant-version.dto'

export interface IGetVariantVersionService {
  getVariantVersion(params: VariantVersionControllerParams): Promise<GetVariantVersionDto>
}

// todo make smaller and test
@Injectable()
export class GetVariantVersionService implements IGetVariantVersionService {
  // todo extract these services to separate module and use DI
  private readonly _draftChangesCounter = new DraftChangesCounterService()

  constructor(
    @Inject(VariantVersionFetcherService)
    private readonly _versionsService: ICanFetchVariantVersions,

    @Inject(CtProductDao) private readonly _ctProductDao: ICanGetCtProduct,

    @Inject(PricingService)
    private readonly _pricingService: ICanFetchPricingChannelsByCountryCode,

    @Inject(ProductImageService)
    private readonly _productImageService: ICanFetchProductImages,

    @Inject(AllergenDtoCreator)
    private readonly allergenDtoCreator: ICanCreateAllergensDto,

    @Inject(NutritionalsDtoCreator)
    private readonly nutritionalsDtoCreator: ICanCreateNutritionalsDto,

    private readonly _productLabellingCardService: ProductLabellingCardService,

    private readonly _reviewStatusService: ReviewStatusService,
  ) {}

  private async getAllVersions(sku: string, variant: ProductVariant): Promise<VariantVersion[]> {
    return this._versionsService
      .fetchVariantVersionsForVariant(sku, variant)
      .then((result) => result.map((r) => r.model))
  }

  // todo refactor this to have some steps, like first get live, then apply draft and approved from version
  async getVariantVersion(params: VariantVersionControllerParams): Promise<GetVariantVersionDto> {
    const product = await this._ctProductDao
      .getOneProductBySkuOrThrow(params.masterSku)
      .then((ctProduct) => new ProductGroup(ctProduct))

    const variantsExtractor = product.createVariantsExtractor()

    const relatedVariant = variantsExtractor.getVariantBySkuOrThrow(params.variantSku)
    const version = await this._versionsService.fetchVariantVersionByKeyOrThrow(params.versionKey)

    const commonVariantAttributes = new CommonProductVariantAttributes(relatedVariant.attributes!)
    const foodVariantAttributes = new FoodVariantAttributes(relatedVariant.attributes!)

    const image = await this._productImageService.getImageForSingleSku(params.variantSku)

    const pricingChannels = await this._pricingService.getPricingChannelsByCountryCode(
      commonVariantAttributes.country.asEnum(),
    )

    const variantVersion = VariantVersion.fromRawCtObject(
      version.id,
      relatedVariant.sku!,
      version.data,
    )

    const liveSchedule = new LiveSchedule({
      on: variantVersion.liveFrom,
      off: variantVersion.liveTo,
    })

    const getAttribute = CtAttributesResolver.constructAttributeValueGetter(
      relatedVariant.attributes!,
    )

    const parsedReportingFields: ParsedVariantReportingFields = variantVersion.approved.reporting
      ? new VariantReportingFieldsParser(variantVersion.approved.reporting).parse()
      : new VariantReportingFieldsParser({
          starKisProductCategoryID:
            getAttribute<{ key: string }>(ProductCategoryAttribute)?.key ?? null,
          pluReportingName: getAttribute(PluReportingNameAttribute),
          starKisProductSubCategoryID:
            getAttribute<{ key: string }>(ProductSubCategoryAttribute)?.key ?? null,
          pluSecondaryCategoryID:
            getAttribute<{ key: string }>(PluSecondaryCategoryAttribute)?.key ?? null,
          posID: getAttribute(PosIdAttribute),
          pluPrimaryCategoryID:
            getAttribute<{ key: string }>(PluPrimaryCategoryAttribute)?.key ?? null,
          parentProductSku: getAttribute(ParentProductSkuAttribute),
          productRange:
            getAttribute<{ key: string; label: string }[]>(ProductRangeAttribute)?.map(
              ({ key }) => key,
            ) ?? null,
        }).parse()

    const labelling = variantVersion.approved.labelling
      ? new VariantLabelling(variantVersion.approved.labelling)
      : VariantLabelling.fromCtVariant(relatedVariant)

    const prices = mapPricesToChannelPriceDto(
      relatedVariant.prices,
      pricingChannels,
      commonVariantAttributes.country.value,
    ).map((genericPriceChannel) => {
      const approvedPrice = variantVersion.approved.pricing?.find(
        ({ channelName }) => channelName === genericPriceChannel.channelName,
      )

      if (!approvedPrice) {
        return genericPriceChannel
      }

      return merge(
        {},
        genericPriceChannel,
        approvedPrice.toDto(
          new MultilangString({
            'en-GB': pricingChannels.find(({ key }) => key === approvedPrice.channelName)!.name!.en,
          }),
        ),
      )
    })

    const allergensDTO = await this.allergenDtoCreator.getDtoFromKeys(
      variantVersion.allergens || [],
    )

    const nutritionalsDto = await this.nutritionalsDtoCreator.getDtoFromBaseNutritionals(
      variantVersion.nutritionals || [],
    )

    const howToCardCodes = [
      variantVersion.hgCode.value,
      ...variantVersion.constituentHGCodes,
    ].filter(Boolean)
    const howToCard = await this._productLabellingCardService.getProductVariantHowToCardForHgID(
      howToCardCodes,
    )

    const variantDtoBuilder = new ProductVariantDtoBuilder()
      .withLiveSchedule(liveSchedule)
      .asMasterVariant(variantsExtractor.isMasterVariant(params.variantSku))
      .withPrices(prices)
      .withImage(image.imageUrl)
      .withVersionsPreview(await this.getAllVersions(params.variantSku, relatedVariant))
      .withSku(params.variantSku)
      .withSize(new AverageWeightAttribute(variantVersion.size || 0))
      .withName(
        new MultilangString(variantVersion.approved.name || product.getProductGroupName('current')),
      )
      .withDescription({
        standard:
          variantVersion.approved.description || product.getProductGroupDescription('current'),
      })
      .withAvailability(
        variantVersion.approved.availability
          ? VariantAvailability.fromVariantAvailability(variantVersion.approved.availability)
          : VariantAvailability.fromCtVariant(relatedVariant),
      )
      .withStatus(commonVariantAttributes.visible) // todo how to map to HG?
      .withHamiltonGrant({
        productCode: variantVersion.hgCode,
        hgSyncDate: variantVersion.lastUpdatedFromHG,
        constituentHGCodes: variantVersion.constituentHGCodes,
        hgRecipeStatus: variantVersion.hgRecipeStatus,
        recipeTypes: variantVersion.recipeTypes,
      })
      .withHowToDisplay(
        variantVersion.approved.howToDisplay?.keys ||
          VariantHowToDisplayFactory.fromCtVariant(relatedVariant).keys,
      )
      .withReporting(parsedReportingFields)
      .withNutrition({
        ...new VariantNutritionService().getNutritionFromVariant(relatedVariant),
        isVegan: variantVersion.vegan,
        isVegetarian: variantVersion.vegetarian,
      })
      .withLabelling(labelling.toDto(howToCard))

    if (product.isBaristaType()) {
      const baristaAttributes = variantVersion.approved.baristaAttributes
        ? new BaristaAttributes(variantVersion.approved.baristaAttributes).toDto()
        : new BaristaBeverageVariantAttributes(relatedVariant.attributes).toDto()

      variantDtoBuilder.withBaristaBeverageAttributes(baristaAttributes)
    }

    if (product.isFoodType()) {
      variantDtoBuilder.withParentProductSku(
        parsedReportingFields.parentProductSku ?? foodVariantAttributes.parentProductSku ?? null,
      )
    }

    const variantDTO = variantDtoBuilder.build()

    variantDTO.hamiltonGrant.allergens = allergensDTO
    variantDTO.hamiltonGrant.nutrition = nutritionalsDto
    variantDTO.hamiltonGrant.ingredients = variantVersion.ingredients.toDto()

    const draftDto = this.createDraftChanges(variantDTO, variantVersion, howToCard)

    const variantVersionModel = VariantVersion.mapVersionToVariantModel(
      variantVersion.approved,
      version.data,
      product.getProductType(),
      relatedVariant,
      product.getProductGroupName('current'),
    )

    const draftVariantVersionModel = VariantVersion.mapVersionToVariantModel(
      variantVersion.draft,
      version.data,
      product.getProductType(),
      relatedVariant,
      product.getProductGroupName('staged'),
    )

    const reviewStatusesForVersion = await this._reviewStatusService.getFieldReviewStatuses(
      params.variantSku,
      DIFF_TYPES.version,
      params.versionKey,
      true,
    )

    const reviewStatusesDto = reviewStatusesForVersion
      ? {
          ...reviewStatusesForVersion,
          statusCount: ReviewStatusCounter.countVariantStatuses(
            ReviewStatusCounter.getStatusesForChangedVersionFields(
              reviewStatusesForVersion,
              variantVersion,
            ),
          ),
        }
      : null

    const draftWithChangesCount: ProductVariantDraftChangesDto = {
      ...draftDto,
      changesCount: {
        marketing: this._draftChangesCounter.compareVariantMarketing(
          variantVersionModel,
          draftVariantVersionModel,
        ),
        reporting: this._draftChangesCounter.compareVariantReporting(
          variantVersionModel,
          draftVariantVersionModel,
        ),
        attributes: product.isBaristaType()
          ? this._draftChangesCounter.compareVariantAttributes(
              variantVersionModel,
              draftVariantVersionModel,
            )
          : 0,
        total: this._draftChangesCounter.compareVariant(
          variantVersionModel,
          draftVariantVersionModel,
        ),
        pricing: this._draftChangesCounter.compareVariantPricing(
          variantVersionModel,
          draftVariantVersionModel,
        ),
        labelling: product.isFoodType()
          ? this._draftChangesCounter.compareVariantLabelling(
              variantVersionModel,
              draftVariantVersionModel,
            )
          : 0,
      },
      reviewStatuses: reviewStatusesDto,
    }

    const publishStateResolver = new VariantVersionsPublishStateService(
      commonVariantAttributes.liveFrom?.value.toISOString() || null,
    )

    const tabApprovedCompletionService = new VersionObjectCompletionChecker(variantVersion.approved)
    const tabDraftCompletionService = new VersionObjectCompletionChecker(variantVersion.draft)

    return {
      variant: variantDTO,
      draft: draftWithChangesCount,
      variantVersion: variantVersion.version,
      id: variantVersion.id,
      publishState: publishStateResolver.getVariantPublishState(variantVersion),
      key: params.versionKey,
      approvedTabs: {
        marketing: tabApprovedCompletionService.isMarketingSectionComplete(),
        labelling: product.isFoodType()
          ? tabApprovedCompletionService.isLabellingSectionComplete()
          : undefined,
        baristaAttributes: product.isBaristaType()
          ? tabApprovedCompletionService.isBaristaAttributesSectionComplete()
          : undefined,
        pricing: tabApprovedCompletionService.isPricingSectionComplete(),
        reporting: tabApprovedCompletionService.isReportingSectionComplete(),
      },
      draftTabs: {
        marketing: tabDraftCompletionService.isMarketingSectionComplete(),
        labelling: product.isFoodType()
          ? tabDraftCompletionService.isLabellingSectionComplete()
          : undefined,
        baristaAttributes: product.isBaristaType()
          ? tabDraftCompletionService.isBaristaAttributesSectionComplete()
          : undefined,
        pricing: tabDraftCompletionService.isPricingSectionComplete(),
        reporting: tabDraftCompletionService.isReportingSectionComplete(),
      },
    }
  }

  // todo -use builder 2nd time here?
  private createDraftChanges(
    liveVariantDTO: ProductVariantDto,
    variantVersion: VariantVersion,
    card: HowToCardData,
  ): Omit<ProductVariantDraftChangesDto, 'changesCount'> {
    const draftAvailability: VariantAvailability =
      (variantVersion.draft.availability &&
        VariantAvailability.fromVariantAvailability(variantVersion.draft.availability)) ||
      (variantVersion.approved.availability &&
        VariantAvailability.fromVariantAvailability(variantVersion.approved.availability)) ||
      VariantAvailability.fromAvailabilityDto(liveVariantDTO.availability)

    const draftReporting: ParsedVariantReportingFields =
      (variantVersion.draft.reporting &&
        new VariantReportingFieldsParser(variantVersion.draft.reporting).parse()) ||
      (variantVersion.approved.reporting &&
        new VariantReportingFieldsParser(variantVersion.approved.reporting).parse()) ||
      new VariantReportingFieldsParser({
        pluSecondaryCategoryID: liveVariantDTO.pluSecondaryCategoryID,
        starKisProductCategoryID: liveVariantDTO.starKisProductCategoryID,
        starKisProductSubCategoryID: liveVariantDTO.starKisProductSubCategoryID,
        pluPrimaryCategoryID: liveVariantDTO.pluPrimaryCategoryID,
        pluReportingName: liveVariantDTO.pluReportingName,
        parentProductSku: liveVariantDTO.parentProductSku,
        posID: liveVariantDTO.posID,
        productRange: liveVariantDTO.productRange,
      }).parse()

    const prices = liveVariantDTO.prices.map((approvedPriceChannel) => {
      const draftPrice = variantVersion.draft.pricing?.find(
        (c) => c.channelName === approvedPriceChannel.channelName,
      )

      if (!draftPrice) {
        return approvedPriceChannel
      }

      return merge(
        {},
        approvedPriceChannel,
        draftPrice.toDto(
          MultilangString.fromDto(
            liveVariantDTO.prices.find((c) => c.channelName === draftPrice.channelName)!
              .channelLabel,
          ),
        ),
      )
    })

    const draftChanges: Omit<ProductVariantDraftChangesDto, 'changesCount'> = {
      ...liveVariantDTO,
      size: variantVersion.size?.toString(),
      name: new MultilangString(
        variantVersion.draft.name || variantVersion.approved.name || liveVariantDTO.name,
      ),
      description: {
        standard:
          variantVersion.draft.description ||
          variantVersion.approved.description ||
          liveVariantDTO.description.standard,
      },
      availability: draftAvailability.toDto(
        new LiveSchedule(liveVariantDTO.availability.liveSchedule),
      ),
      hamiltonGrant: {
        ...liveVariantDTO.hamiltonGrant,
        lastSyncedAt: variantVersion.lastUpdatedFromHG.value.toISOString(),
        cuisine: {
          ...liveVariantDTO.hamiltonGrant.cuisine,
          isVegan: variantVersion.vegan,
          isVegetarian: variantVersion.vegetarian,
        },
        ingredients: variantVersion.ingredients.toDto(),
      },
      posID: draftReporting.posID?.value ?? null,
      pluPrimaryCategoryID: draftReporting.pluPrimaryCategoryID?.value ?? null,
      pluSecondaryCategoryID: draftReporting.pluSecondaryCategoryID?.value ?? null,
      starKisProductCategoryID: draftReporting.starKisProductCategoryID?.value ?? null,
      starKisProductSubCategoryID: draftReporting.starKisProductSubCategoryID?.value ?? null,
      pluReportingName: draftReporting.pluReportingName?.value ?? null,
      parentProductSku: draftReporting.parentProductSku?.value ?? null,
      prices: prices,
      howToDisplay: variantVersion.draft.howToDisplay
        ? variantVersion.draft.howToDisplay.keys
        : liveVariantDTO.howToDisplay,
      productRange: draftReporting.productRange?.value ?? null,
    }

    if (draftChanges.attributes) {
      draftChanges.attributes =
        (variantVersion.draft.baristaAttributes &&
          new BaristaAttributes(variantVersion.draft.baristaAttributes).toDto()) ||
        (variantVersion.approved.baristaAttributes &&
          new BaristaAttributes(variantVersion.approved.baristaAttributes).toDto()) ||
        draftChanges.attributes
    }

    if (draftChanges.labelling) {
      draftChanges.labelling =
        (variantVersion.draft.labelling &&
          new VariantLabelling(variantVersion.draft.labelling).toDto(card)) ||
        (variantVersion.approved.labelling &&
          new VariantLabelling(variantVersion.approved.labelling).toDto(card)) ||
        draftChanges.labelling
    }

    return draftChanges
  }
}
