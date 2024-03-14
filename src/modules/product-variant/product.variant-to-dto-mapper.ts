import { Channel } from '@commercetools/platform-sdk'

import { CanGenerateHowToCard } from '../labelling-card/product-labelling-card.service'
import { ProductSkuWithImage } from '../content-management/services/product-image.service'
import { LocalizedContainsAllergensAttribute } from '../product-attributes/common-variant-attributes/localized-contains-allergens-attribute'
import { AllergenDto, NutritionItemDto } from '../../shared/dto/hamilton-grant.dto'
import { MultilangString } from '../product/logic/models/multilang-string'
import { NutritionalsAttribute } from '../product-attributes/common-variant-attributes/nutritionals-attribute'
import { NutritionalsMapper } from '../../shared/model/nutritional'
import { VariantVersion } from '../variant-version/model/variant-version'
import { ProductVariantDto } from '../../shared/dto/product-variant.dto'
import { VariantVersionsPublishStateService } from '../variant-version/services/variant-versions-publish-state/variant-versions-publish-state.service'
import { DisplayAsNewFactory } from '../../shared/model/display-as-new'
import { LiveStatus } from '../../shared/model/live-status'
import { mapPricesToChannelPriceDto } from '../ct-utils/get-channel-price'
import { Sku } from '../../shared/model/sku'

import { BaristaProductVariant, FoodProductVariant } from './product-variant'

export class VariantToDtoMapper {
  constructor(
    private opts: {
      howToCardGenerator: CanGenerateHowToCard
      images: ProductSkuWithImage[]
      pricingChannels: Channel[]
    },
  ) {}

  private mapAllergenKeysToLabelPairs(
    allergens: LocalizedContainsAllergensAttribute,
  ): AllergenDto[] {
    return allergens.value.map((localisedAllergen) => ({
      name: localisedAllergen.key,
      label: new MultilangString(localisedAllergen.label).toDto(),
    }))
  }

  private mapNutritionalsFromAttribute(attr: NutritionalsAttribute): NutritionItemDto[] {
    const models = NutritionalsMapper.mapNutritionalsAttributeToModel(attr)

    return models.map((nutr) => NutritionalsMapper.mapNutritionalToDto(nutr))
  }

  private resolveVariantImage(sku: Sku) {
    const relatedImageUrl = this.opts.images.find((img) => img.sku === sku.value)?.imageUrl

    if (relatedImageUrl) {
      return {
        default: relatedImageUrl,
        thumbnail: relatedImageUrl,
      }
    }

    return null
  }

  async mapVariantToDto(
    isMaster: boolean,
    variant: BaristaProductVariant | FoodProductVariant,
    versions: VariantVersion[],
  ): Promise<ProductVariantDto> {
    const { howToCardGenerator } = this.opts

    const publishedStateDetector = new VariantVersionsPublishStateService(
      variant.commonAttributes.liveFrom?.value.toISOString() ?? null,
    )

    const isBarista = variant.isBaristaVariant()
    const isFood = !isBarista

    const constituentHGCodes = (variant.commonAttributes.constituentItems || []).map(
      ([firstElement]) => firstElement.value,
    )

    const howToCodes = [variant.commonAttributes.hgCode?.value, ...constituentHGCodes].filter(
      Boolean,
    ) as string[]

    return {
      description: {
        standard: variant.description.toDto(),
      },
      prices: mapPricesToChannelPriceDto(
        variant.prices,
        this.opts.pricingChannels,
        variant.commonAttributes.country.value,
      ),
      image: this.resolveVariantImage(variant.sku),
      // todo filter out versions with wrong parent
      versions: versions.map((v) =>
        v.toPreviewDto(publishedStateDetector.getVariantPublishState(v)),
      ),
      name: variant.name.toDto(),
      hamiltonGrant: {
        lastSyncedAt: variant.commonAttributes.lastUpdatedFromHG?.value.toISOString() ?? null,
        cuisine: {
          isVegetarian: variant.commonAttributes.suitableForVegetarians.value,
          isVegan: variant.commonAttributes.suitableForVegans.value,
        },
        productCode: variant.commonAttributes.hgCode?.value ?? null,
        ingredients: variant.commonAttributes.ingredients.toMultiLangString().toDto(),
        allergens: this.mapAllergenKeysToLabelPairs(
          variant.commonAttributes.localizedContainsAllergens,
        ),
        nutrition: variant.commonAttributes.nutritionals
          ? this.mapNutritionalsFromAttribute(variant.commonAttributes.nutritionals)
          : [],
        constituentHGCodes: constituentHGCodes,
        hgRecipeStatus: (isFood && variant.foodAttributes.hgRecipeStatus?.value) || null,
        recipeTypes:
          (isFood && variant.foodAttributes.recipeTypes?.value.map(({ key }) => key)) || null,
      },
      availability: {
        displayAsNew: DisplayAsNewFactory.create(
          variant.commonAttributes.displayAsNew,
          variant.commonAttributes.newUntil,
        ),
        availableAllDay: variant.commonAttributes.availableAllDay.value,
        availableForLunch: variant.commonAttributes.availableForLunch.value,
        availableForOutposts: variant.commonAttributes.availableForOutposts.value,
        isLive: variant.commonAttributes.visible.value,
        isChefsSpecial: variant.commonAttributes.chefSpecial.value,
        availableForClickAndCollect: variant.commonAttributes.availableForCollection.value,
        availableForPretDelivers: variant.commonAttributes.availableForPretDelivers.value,
        visibleOnDeliveryWebsite: variant.commonAttributes.visibleOnDeliveryWebsite.value,
        liveSchedule: {
          on: variant.commonAttributes.liveFrom?.value.toISOString() ?? null,
          off: variant.commonAttributes.liveTo?.value.toISOString() ?? null,
        },
      },
      pluReportingName: variant.commonAttributes.pluReportingName?.value ?? null,
      pluPrimaryCategoryID: variant.commonAttributes.pluPrimaryCategoryID?.value ?? null,
      starKisProductCategoryID: variant.commonAttributes.starKisProductCategoryID?.value ?? null,
      pluSecondaryCategoryID: variant.commonAttributes.pluSecondaryCategoryID?.value ?? null,
      starKisProductSubCategoryID:
        variant.commonAttributes.starKisProductSubCategoryID?.value ?? null,
      posID: variant.commonAttributes.posId?.value ?? null,
      attributes: isBarista ? variant.baristaAttributes.toDto() : null,
      sku: variant.sku.value,
      howToDisplay: variant.commonAttributes.howToDisplay.value.map((v) => v.key),
      size: variant.commonAttributes.averageWeight.toString(),
      isMaster: isMaster,
      status: variant.commonAttributes.visible.value ? LiveStatus.ACTIVE : LiveStatus.INACTIVE,
      parentProductSku: isFood ? variant.foodAttributes.parentProductSku?.value ?? null : null,
      version: variant.commonAttributes.version.value,
      productRange: variant.commonAttributes.productRange?.value ?? null,
      labelling: isFood
        ? {
            includeNutritionalInformationOnLabel:
              variant.foodAttributes.includeNutritionalInformationOnLabel.value,
            useBy: variant.foodAttributes.useBy?.value ?? null,
            sellBy: variant.foodAttributes.sellBy?.value ?? null,
            storageConditions: variant.foodAttributes.storageConditions?.value ?? null,
            countryOfOriginDescription:
              variant.foodAttributes.countryOfOriginDescription?.value ?? null,
            ean13Code: variant.foodAttributes.ean13Code?.value ?? null,
            legalTitle: variant.foodAttributes.legalTitle?.value ?? null,
            includeAverageWeightOnLabel:
              variant.foodAttributes.includeAverageWeightOnLabel?.value ?? null,
            howToCard: await howToCardGenerator!.getProductVariantHowToCardForHgID(
              howToCodes ?? null,
            ),
            canBeCookedInTurboChef: variant.foodAttributes.canBeCookedInTurboChef.value ?? false,
            useByTurboChef: variant.foodAttributes.useByTurboChef?.value ?? null,
            sellByTurboChef: variant.foodAttributes.sellByTurboChef?.value ?? null,
            productServes: variant.foodAttributes.productServes?.value ?? null,
          }
        : null,
    }
  }
}
