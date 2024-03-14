import { ProductVariant } from '@commercetools/platform-sdk'

import { LabellingDto } from '../dto/labelling.dto'
import { Ean13CodeAttribute } from '../../modules/product-attributes/food-variant-attributes/ean-13-code-attribute'
import { IncludeAverageWeightOnLabelAttribute } from '../../modules/product-attributes/food-variant-attributes/include-average-weight-on-label-attribute'
import { LegalTitleAttribute } from '../../modules/product-attributes/food-variant-attributes/legal-title-attribute'
import { SellByAttribute } from '../../modules/product-attributes/common-variant-attributes/sell-by-attribute'
import { UseByAttribute } from '../../modules/product-attributes/common-variant-attributes/use-by-attribute'
import { CountryOfOriginDescriptionAttribute } from '../../modules/product-attributes/common-variant-attributes/country-of-origin-description-attribute'
import { IncludeNutritionalInformationOnLabelAttribute } from '../../modules/product-attributes/food-variant-attributes/include-nutritional-information-on-label-attribute'
import { FoodVariantAttributes } from '../../modules/product-attributes/food-variant-attributes'
import { StorageConditionsAttribute } from '../../modules/product-attributes/food-variant-attributes/storage-conditions-attribute'
import { CanBeCookedInTurboChefAttribute } from '../../modules/product-attributes/common-variant-attributes/can-be-cooked-in-turbo-chef-attribute'
import { UseByTurboChefAttribute } from '../../modules/product-attributes/common-variant-attributes/use-by-turbo-chef-attribute'
import { SellByTurboChefAttribute } from '../../modules/product-attributes/common-variant-attributes/sell-by-turbo-chef-attribute'
import { ProductServesAttribute } from '../../modules/product-attributes/common-variant-attributes/product-serves-attribute'

export interface VariantLabellingSerialized {
  storageConditions: StorageConditionsAttribute['value'] | null
  includeAverageWeightOnLabel: IncludeAverageWeightOnLabelAttribute['value']
  countryOfOriginDescription: CountryOfOriginDescriptionAttribute['value'] | null
  ean13Code: Ean13CodeAttribute['value'] | null
  useBy: UseByAttribute['value'] | null
  sellBy: SellByAttribute['value'] | null
  legalTitle: LegalTitleAttribute['value'] | null
  includeNutritionalInformationOnLabel: IncludeNutritionalInformationOnLabelAttribute['value'] // todo nullable?
  canBeCookedInTurboChef: CanBeCookedInTurboChefAttribute['value'] | null
  useByTurboChef: UseByTurboChefAttribute['value'] | null
  sellByTurboChef: SellByTurboChefAttribute['value'] | null
  productServes: ProductServesAttribute['value'] | null
}

export type HowToCardData = LabellingDto['howToCard']

/**
 * @deprecated
 *
 * Dont use groups like this because these attributes change and its hard to manage
 *
 * Keep only DTO and serialized for context of Client and Custom Object
 */
export class VariantLabelling {
  private _tag = 'VariantLabelling'

  storageConditions!: StorageConditionsAttribute | null
  includeAverageWeightOnLabel!: IncludeAverageWeightOnLabelAttribute
  countryOfOriginDescription!: CountryOfOriginDescriptionAttribute | null
  ean13Code!: Ean13CodeAttribute | null
  useBy!: UseByAttribute | null
  sellBy!: SellByAttribute | null
  legalTitle!: LegalTitleAttribute | null
  includeNutritionalInformationOnLabel: IncludeNutritionalInformationOnLabelAttribute
  canBeCookedInTurboChef!: CanBeCookedInTurboChefAttribute
  useByTurboChef!: UseByTurboChefAttribute | null
  sellByTurboChef!: SellByTurboChefAttribute | null
  productServes!: ProductServesAttribute | null

  constructor(payload: VariantLabellingSerialized | VariantLabelling) {
    if (payload instanceof VariantLabelling) {
      this.storageConditions = payload.storageConditions
      this.includeAverageWeightOnLabel = payload.includeAverageWeightOnLabel
      this.countryOfOriginDescription = payload.countryOfOriginDescription
      this.ean13Code = payload.ean13Code
      this.useBy = payload.useBy
      this.sellBy = payload.sellBy
      this.productServes = payload.productServes
      this.legalTitle = payload.legalTitle
      this.includeNutritionalInformationOnLabel = payload.includeNutritionalInformationOnLabel
      this.canBeCookedInTurboChef = payload.canBeCookedInTurboChef
      this.useByTurboChef = payload.useByTurboChef
      this.sellByTurboChef = payload.sellByTurboChef
    } else {
      this.storageConditions = payload.storageConditions
        ? new StorageConditionsAttribute(payload.storageConditions)
        : null
      this.includeAverageWeightOnLabel = new IncludeAverageWeightOnLabelAttribute(
        payload.includeAverageWeightOnLabel ?? IncludeAverageWeightOnLabelAttribute.DEFAULT_VALUE,
      )
      this.countryOfOriginDescription = payload.countryOfOriginDescription
        ? new CountryOfOriginDescriptionAttribute(payload.countryOfOriginDescription)
        : null
      this.ean13Code = payload.ean13Code ? new Ean13CodeAttribute(payload.ean13Code) : null
      this.useBy = payload.useBy ? new UseByAttribute(payload.useBy) : null
      this.sellBy = payload.sellBy ? new SellByAttribute(payload.sellBy) : null
      this.legalTitle = payload.legalTitle ? new LegalTitleAttribute(payload.legalTitle) : null
      this.includeNutritionalInformationOnLabel = new IncludeNutritionalInformationOnLabelAttribute(
        payload.includeNutritionalInformationOnLabel ??
          IncludeNutritionalInformationOnLabelAttribute.DEFAULT_VALUE,
      )
      this.canBeCookedInTurboChef = new CanBeCookedInTurboChefAttribute(
        payload.canBeCookedInTurboChef ?? CanBeCookedInTurboChefAttribute.DEFAULT_VALUE,
      )
      this.useByTurboChef = payload.useByTurboChef
        ? new UseByTurboChefAttribute(payload.useByTurboChef)
        : null
      this.sellByTurboChef = payload.sellByTurboChef
        ? new SellByTurboChefAttribute(payload.sellByTurboChef)
        : null
      this.productServes = payload.productServes
        ? new ProductServesAttribute(payload.productServes)
        : null
    }
  }

  static fromCtVariant(variant: Pick<ProductVariant, 'attributes'>) {
    const foodAttrs = new FoodVariantAttributes(variant.attributes!)

    return new VariantLabelling({
      storageConditions: foodAttrs.storageConditions?.value ?? null,
      includeAverageWeightOnLabel: foodAttrs.includeAverageWeightOnLabel.value,
      countryOfOriginDescription: foodAttrs.countryOfOriginDescription?.value ?? null,
      ean13Code: foodAttrs.ean13Code?.value ?? null,
      useBy: foodAttrs.useBy?.value ?? null,
      sellBy: foodAttrs.sellBy?.value ?? null,
      legalTitle: foodAttrs.legalTitle?.value ?? null,
      includeNutritionalInformationOnLabel: foodAttrs.includeNutritionalInformationOnLabel.value,
      canBeCookedInTurboChef: foodAttrs.canBeCookedInTurboChef.value,
      useByTurboChef: foodAttrs.useByTurboChef?.value ?? null,
      sellByTurboChef: foodAttrs.sellByTurboChef?.value ?? null,
      productServes: foodAttrs.productServes?.value ?? null,
    })
  }

  toDto(howToCardData: HowToCardData): LabellingDto {
    return {
      storageConditions: this.storageConditions?.value ?? null,
      useBy: this.useBy?.value ?? null,
      sellBy: this.sellBy?.value ?? null,
      ean13Code: this.ean13Code ? this.ean13Code.value : null,
      countryOfOriginDescription: this.countryOfOriginDescription?.value ?? null,
      includeAverageWeightOnLabel: this.includeAverageWeightOnLabel?.value,
      legalTitle: this.legalTitle?.value ?? null,
      howToCard: howToCardData,
      includeNutritionalInformationOnLabel: this.includeNutritionalInformationOnLabel.value,
      canBeCookedInTurboChef: this.canBeCookedInTurboChef.value,
      useByTurboChef: this.useByTurboChef?.value ?? null,
      sellByTurboChef: this.sellByTurboChef?.value ?? null,
      productServes: this.productServes?.value ?? null,
    }
  }
}
