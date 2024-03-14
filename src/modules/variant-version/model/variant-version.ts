import { plainToClass } from 'class-transformer'
import { cloneDeep } from 'lodash'
import { Attribute, ProductVariant } from '@commercetools/platform-sdk'

import { MultilangString } from '../../product/logic/models/multilang-string'
import { VariantVersionPreviewDto } from '../dto/variant-version-preview.dto'
import { VariantAvailability } from '../../../shared/model/variant-availability'
import { BaristaAttributes } from '../../../shared/model/barista-attributes'
import { ChannelPrice } from '../../../shared/model/channel-price'
import {
  VariantHowToDisplay,
  VariantHowToDisplayFactory,
} from '../../../shared/model/variant-how-to-display'
import { ProductTypeKey } from '../../product-type/product-type-key'
import { Sku } from '../../../shared/model/sku'
import { NutritionItemBase } from '../../variant-nutrition/variant-nutrition'
import { VariantLabelling } from '../../../shared/model/variant-labelling'
import { BaristaProductVariant, FoodProductVariant } from '../../product-variant/product-variant'
import { HgCodeAttribute } from '../../product-attributes/common-variant-attributes/hg-code-attribute'
import { LastUpdatedFromHgAttribute } from '../../product-attributes/common-variant-attributes/last-updated-from-hg-attribute'
import { CommonProductVariantAttributes } from '../../product-attributes/common-product-variant-attributes'
import { FoodVariantAttributes } from '../../../modules/product-attributes/food-variant-attributes'
import { mapChannelsToCtPrices } from '../../ct-utils/get-channel-price'
import { getAttributeByDtoKey } from '../../product-attributes/get-attribute-by-dto-key'
import { HgRecipeStatusAttribute } from '../../product-attributes/food-variant-attributes/hg-recipe-status'
import { DescriptionAttribute } from '../../product-attributes/common-variant-attributes/description-attribute'

import { VariantVersionPortalFields, VersionCustomObjectPayload } from './version-custom-object'
import { VariantVersionPublishState } from './variant-version-publish-state'

export class VariantVersion {
  // todo should it be here?
  sku!: string
  id!: string
  hgCode!: HgCodeAttribute
  liveFrom!: string
  liveTo!: string | null
  vegan!: boolean
  vegetarian!: boolean
  lastUpdatedFromHG!: LastUpdatedFromHgAttribute
  size!: number
  ingredients!: MultilangString
  version!: number
  key!: string
  approved!: Partial<Omit<VariantVersionPortalFields, 'labelling'>> & {
    name: VariantVersionPortalFields['name']
    labelling?: VariantLabelling
  }
  draft!: Partial<Omit<VariantVersionPortalFields, 'labelling'>> & {
    name: VariantVersionPortalFields['name']
    labelling?: VariantLabelling
  }
  hgName!: string
  allergens!: string[]
  nutritionals!: NutritionItemBase[]
  constituentHGCodes!: string[]
  hgRecipeStatus!: HgRecipeStatusAttribute | null
  recipeTypes!: string[] | null

  toPreviewDto(publishState: VariantVersionPublishState): VariantVersionPreviewDto {
    return {
      id: this.id,
      liveFrom: this.liveFrom,
      name: this.approved.name?.toDto() || new MultilangString({ 'en-GB': this.hgName }),
      version: this.version,
      key: this.key,
      sku: this.sku,
      hgCode: this.hgCode.value,
      publishState,
    }
  }

  static fromRawCtObject(id: string, sku: string, obj: VersionCustomObjectPayload): VariantVersion {
    const { draft, approved, hg, key } = obj

    // todo - remove plainToClass since its not type safe
    const instance = plainToClass(VariantVersion, {
      sku,
      liveFrom: hg.liveFrom,
      id,
      vegan: hg.suitableForVegans,
      vegetarian: hg.suitableForVegetarians,
      size: hg.averageWeight,
      version: hg.version,
      key: key,
      hgName: hg.name,
      allergens: hg.localizedContainsAllergens,
      liveTo: hg.liveTo || null,
    })

    instance.hgCode = new HgCodeAttribute(hg.hgCode)
    instance.lastUpdatedFromHG = new LastUpdatedFromHgAttribute(hg.lastUpdatedFromHG)

    instance.nutritionals = obj.hg.nutritionals?.map((hgNut) => ({
      item: hgNut.code,
      per100g: hgNut.per100grams,
      perServing: hgNut.perServing,
    }))

    instance.constituentHGCodes = (hg.constituentItems || [])?.map(
      ({ constituentItemCode }) => constituentItemCode,
    )

    instance.hgRecipeStatus = hg.hgRecipeStatus
      ? new HgRecipeStatusAttribute(hg.hgRecipeStatus)
      : null

    instance.recipeTypes = hg.recipeType

    instance.ingredients = new MultilangString(hg.ingredients)
    instance.approved = {
      name: new MultilangString(
        approved?.name
          ? approved.name
          : {
              'en-GB': hg.name,
            },
      ),
      availability: approved?.availability
        ? VariantAvailability.fromVariantAvailability(approved?.availability).serialize()
        : undefined,
      reporting: approved?.reporting,
      description: approved?.description && new MultilangString(approved.description),
      baristaAttributes:
        approved?.baristaAttributes && new BaristaAttributes(approved.baristaAttributes),
      pricing: approved?.pricing && approved.pricing.map((p) => new ChannelPrice(p)),
      howToDisplay: approved?.howToDisplay && new VariantHowToDisplay(approved.howToDisplay.keys),
      labelling: approved?.labelling && new VariantLabelling(approved.labelling),
    }
    instance.draft = {
      name: new MultilangString(
        draft?.name
          ? draft.name
          : {
              'en-GB': hg.name,
            },
      ),
      availability: draft?.availability
        ? VariantAvailability.fromVariantAvailability(draft?.availability).serialize()
        : undefined,
      reporting: draft?.reporting,
      description: draft?.description && new MultilangString(draft.description),
      baristaAttributes: draft?.baristaAttributes && new BaristaAttributes(draft.baristaAttributes),
      pricing: draft?.pricing && draft.pricing.map((p) => new ChannelPrice(p)),
      howToDisplay: draft?.howToDisplay && new VariantHowToDisplay(draft.howToDisplay.keys),
      labelling: draft?.labelling && new VariantLabelling(draft.labelling),
    }

    return instance
  }

  static getVariantCtFieldsFromVersionObject(
    version: VersionCustomObjectPayload,
    versionFields: VariantVersion['approved' | 'draft'],
    relatedVariant: ProductVariant,
  ): Attribute[] {
    const foodAttrs = new FoodVariantAttributes(relatedVariant.attributes!)
    const commonAttributes = new CommonProductVariantAttributes(relatedVariant.attributes!)

    const labelling = versionFields.labelling || {
      storageConditions: foodAttrs.storageConditions ?? null,
      includeAverageWeightOnLabel: foodAttrs.includeAverageWeightOnLabel ?? null,
      countryOfOriginDescription: foodAttrs.countryOfOriginDescription ?? null,
      ean13Code: foodAttrs.ean13Code ?? null,
      useBy: foodAttrs.useBy ?? null,
      sellBy: foodAttrs.sellBy ?? null,
      useByTurboChef: foodAttrs.useByTurboChef ?? null,
      sellByTurboChef: foodAttrs.sellByTurboChef ?? null,
      canBeCookedInTurboChef: foodAttrs.canBeCookedInTurboChef ?? null,
      legalTitle: foodAttrs.legalTitle ?? null,
      includeNutritionalInformationOnLabel: foodAttrs.includeNutritionalInformationOnLabel ?? null,
      productServes: foodAttrs.productServes ?? null,
    }

    const availability = versionFields.availability
      ? {
          ...versionFields.availability,
          chefSpecial: versionFields.availability.isChefsSpecial,
        }
      : {
          displayAsNew: {
            isDisplayed: commonAttributes.displayAsNew.value,
            until: commonAttributes.newUntil?.value,
          },
          availableForLunch: commonAttributes.availableForLunch.value,
          availableAllDay: commonAttributes.availableAllDay.value,
          availableForPretDelivers: commonAttributes.availableForPretDelivers.value,
          availableForClickAndCollect: commonAttributes.availableForCollection.value,
          availableForOutposts: commonAttributes.availableForOutposts.value,
          chefSpecial: commonAttributes.chefSpecial.value,
          visible: commonAttributes.visible.value,
          visibleOnDeliveryWebsite: commonAttributes.visibleOnDeliveryWebsite.value,
        }

    const rawAttributes: { [key: string]: any } = {
      ingredients: cloneDeep(version.hg.ingredients),
      description: cloneDeep(versionFields?.description),
      suitableForVegetarians: version.hg.suitableForVegetarians,
      suitableForVegans: version.hg.suitableForVegans,
      country: {
        key: version.hg.country,
        label: version.hg.country,
      },
      productVariantVersions: [],
      hgCode: version.hg.hgCode,
      liveFrom: version.hg.liveFrom,
      howToDisplay:
        versionFields.howToDisplay?.keys ||
        VariantHowToDisplayFactory.fromCtVariant(relatedVariant).keys,
      version: version.hg.version,
      lastUpdatedFromHG: version.hg.lastUpdatedFromHG,
      averageWeight: null,
      nutritionals: cloneDeep(version.hg.nutritionals),
      localizedContainsAllergens: cloneDeep(version.hg.localizedContainsAllergens),
      pluReportingName: versionFields.reporting?.pluReportingName,
      pluPrimaryCategory: { key: versionFields.reporting?.pluPrimaryCategoryID },
      pluSecondaryCategory: { key: versionFields.reporting?.pluSecondaryCategoryID },
      productCategory: { key: versionFields.reporting?.starKisProductCategoryID },
      productSubCategory: { key: versionFields.reporting?.starKisProductSubCategoryID },
      productRange: versionFields.reporting?.productRange,
      parentProductSku: versionFields.reporting?.parentProductSku,
      storageConditions: { key: labelling.storageConditions?.value || '' },
      includeAverageWeightOnLabel: labelling.includeAverageWeightOnLabel?.value,
      countryOfOriginDescription: labelling.countryOfOriginDescription?.value,
      ean13Code: labelling.ean13Code?.value,
      useBy: { key: labelling.useBy?.value || '' },
      sellBy: { key: labelling.sellBy?.value || '' },
      canBeCookedInTurboChef: labelling.canBeCookedInTurboChef?.value,
      useByTurboChef: { key: labelling.useByTurboChef?.value || '' },
      sellByTurboChef: { key: labelling.sellByTurboChef?.value || '' },
      productServes: { key: labelling.productServes?.value || '' },
      includeNutritionalInformationOnLabel: labelling.includeNutritionalInformationOnLabel?.value,
      legalTitle: labelling.legalTitle?.value,
      ...availability,
      displayAsNew: availability.displayAsNew.isDisplayed,
      newUntil: availability.displayAsNew.until,
      hgRecipeStatus: version.hg.hgRecipeStatus,
    }

    return Object.keys(rawAttributes).map((key) => {
      const attributeName = getAttributeByDtoKey(key)

      return {
        name: attributeName,
        value: rawAttributes[key],
      }
    })
  }

  static mapVersionToVariantModel(
    variantVersion: VariantVersion['approved' | 'draft'],
    versionObject: VersionCustomObjectPayload,
    type: ProductTypeKey,
    relatedVariant: ProductVariant,
    productGroupName: MultilangString,
  ): BaristaProductVariant | FoodProductVariant {
    let variantModel: BaristaProductVariant | FoodProductVariant

    const versionCtAttributes = VariantVersion.getVariantCtFieldsFromVersionObject(
      versionObject,
      variantVersion,
      relatedVariant,
    )

    const relatedVariantDescription = relatedVariant.attributes?.find(
      ({ name }) => name === DescriptionAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )?.value

    switch (type) {
      case ProductTypeKey.Food:
        variantModel = FoodProductVariant.create({
          sku: new Sku(relatedVariant.sku!),
          name: variantVersion.name || productGroupName,
          prices: variantVersion?.pricing ? mapChannelsToCtPrices(variantVersion?.pricing) : [],
          description:
            variantVersion.description || new MultilangString(relatedVariantDescription || {}),
          ctAttributes: versionCtAttributes,
        })
        break
      case ProductTypeKey.BaristaBeverage:
        variantModel = BaristaProductVariant.create({
          sku: new Sku(relatedVariant.sku!),
          name: variantVersion.name || new MultilangString({}),
          prices: variantVersion?.pricing ? mapChannelsToCtPrices(variantVersion?.pricing) : [],
          description:
            variantVersion.description || new MultilangString(relatedVariantDescription || {}),
          ctAttributes: versionCtAttributes,
        })
        break
    }

    return variantModel
  }
}
