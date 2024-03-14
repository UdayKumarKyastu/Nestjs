import { isEqual } from 'lodash'

import { MultiLangStringDto } from '../../shared/dto/multi-lang-string.dto'
import {
  ParsedVariantReportingFields,
  VariantReportingChangesComparator,
  VariantReportingFactory,
} from '../product/logic/models/variant-reporting'
import { VariantAvailability } from '../../shared/model/variant-availability'
import { DisplayAsNewComparator } from '../../shared/model/display-as-new'
import { VariantLabellingSerialized } from '../../shared/model/variant-labelling'
import { IncludeNutritionalInformationOnLabelAttribute } from '../product-attributes/food-variant-attributes/include-nutritional-information-on-label-attribute'

import { BaristaProductVariant, FoodProductVariant } from './product-variant'

type CustomPriceFields = {
  eatInPrice: {
    type: 'centPrecision'
    currencyCode: string
    centAmount: number
    fractionDigits: number
  }
  eatInTax: number
  takeAwayTax?: number
  deliveryPrice: {
    type: 'centPrecision'
    currencyCode: string
    centAmount: number
    fractionDigits: number
  }
  deliveryTax?: number
  eatInClubPret: {
    type: 'centPrecision'
    currencyCode: string
    centAmount: number
    fractionDigits: number
  }
  takeAwayClubPret: {
    type: 'centPrecision'
    currencyCode: string
    centAmount: number
    fractionDigits: number
  }
}

export interface ICanCountVariantDraftChanges {
  countReporting(): number
  countPrices(): number
  countName(): number
  countDescription(): number
  countHowToDisplay(): number
  countBaristaAttributes(): number
  countAvailability(): number
  countLabelling(): number
  countChanges(): number
}

export class ProductVariantChangesCounter implements ICanCountVariantDraftChanges {
  private liveVariant: FoodProductVariant | BaristaProductVariant
  private draftVariant: FoodProductVariant | BaristaProductVariant

  constructor(
    liveVariant: FoodProductVariant | BaristaProductVariant,
    draftVariant: FoodProductVariant | BaristaProductVariant,
  ) {
    this.liveVariant = liveVariant
    this.draftVariant = draftVariant
  }

  private compareMultiLangString(multiLang1: MultiLangStringDto, multiLang2: MultiLangStringDto) {
    return Object.keys(multiLang1).reduce<number>((changesAcc, keyName) => {
      const assertKey = keyName as keyof MultiLangStringDto

      return multiLang1[assertKey] !== multiLang2[assertKey] ? changesAcc + 1 : changesAcc
    }, 0)
  }

  countBaristaAttributes(): number {
    if (this.liveVariant.isFoodVariant() || this.draftVariant.isFoodVariant()) {
      throw new Error('Barista attributes can be only counted if variant is barista type')
    }

    const liveBaristaAttrs = this.liveVariant.baristaAttributes.toDto()
    const draftBaristaAttrs = this.draftVariant.baristaAttributes.toDto()

    return Object.keys(liveBaristaAttrs).reduce((primitivesChanges, _primitiveKey) => {
      const primitiveKey = _primitiveKey as keyof typeof liveBaristaAttrs

      return (
        primitivesChanges +
        (liveBaristaAttrs[primitiveKey] === draftBaristaAttrs[primitiveKey] ? 0 : 1)
      )
    }, 0)
  }

  countAvailability(): number {
    let changes = 0

    const liveAvailability = VariantAvailability.fromCommonAttributes(
      this.liveVariant.commonAttributes,
    )

    const draftAvailability = VariantAvailability.fromCommonAttributes(
      this.draftVariant.commonAttributes,
    )

    const liveDisplayAsNew = liveAvailability.displayAsNew
    const draftDisplayAsNew = draftAvailability.displayAsNew

    changes += new DisplayAsNewComparator(liveDisplayAsNew).compareTo(draftDisplayAsNew)

    const { displayAsNew: _l, ...livePrimitives } = liveAvailability.serialize()
    const { displayAsNew: _d, ...draftPrimitives } = draftAvailability.serialize()

    changes += Object.keys(livePrimitives).reduce((primitivesChanges, _primitiveKey) => {
      const primitiveKey = _primitiveKey as keyof typeof livePrimitives

      return (
        primitivesChanges + (livePrimitives[primitiveKey] === draftPrimitives[primitiveKey] ? 0 : 1)
      )
    }, 0)

    return changes
  }

  countChanges(): number {
    let changes = 0

    changes += this.countPrices()
    changes += this.countName()
    changes += this.countDescription()
    changes += this.countHowToDisplay()
    changes += this.countAvailability()
    changes += this.countReporting()

    if (this.liveVariant.isBaristaVariant()) {
      changes += this.countBaristaAttributes()
    }

    if (this.liveVariant.isFoodVariant()) {
      changes += this.countLabelling()
    }

    return changes
  }

  countDescription(): number {
    return this.compareMultiLangString(this.liveVariant.description, this.draftVariant.description)
  }

  countHowToDisplay(): number {
    const liveHtd = this.liveVariant.commonAttributes.howToDisplay
    const draftHtd = this.draftVariant.commonAttributes.howToDisplay

    return isEqual(liveHtd.value, draftHtd.value) ? 0 : 1
  }

  countLabelling(): number {
    if (this.liveVariant.isBaristaVariant() || this.draftVariant.isBaristaVariant()) {
      throw new Error('Labelling can be only counted if variant is food type')
    }

    const liveFoodAttrs = this.liveVariant.foodAttributes
    const draftFoodAttrs = this.draftVariant.foodAttributes

    const liveLabelling: VariantLabellingSerialized = {
      includeNutritionalInformationOnLabel:
        liveFoodAttrs.includeNutritionalInformationOnLabel?.value ??
        IncludeNutritionalInformationOnLabelAttribute.DEFAULT_VALUE,
      useBy: liveFoodAttrs.useBy?.value ?? null,
      sellBy: liveFoodAttrs.sellBy?.value ?? null,
      ean13Code: liveFoodAttrs.ean13Code?.value ?? null,
      legalTitle: liveFoodAttrs.legalTitle?.value ?? null,
      includeAverageWeightOnLabel: liveFoodAttrs.includeAverageWeightOnLabel?.value ?? null,
      countryOfOriginDescription: liveFoodAttrs.countryOfOriginDescription?.value ?? null,
      storageConditions: liveFoodAttrs.storageConditions?.value ?? null,
      canBeCookedInTurboChef: liveFoodAttrs.canBeCookedInTurboChef?.value ?? null,
      useByTurboChef: liveFoodAttrs.useByTurboChef?.value ?? null,
      sellByTurboChef: liveFoodAttrs.sellByTurboChef?.value ?? null,
      productServes: liveFoodAttrs.productServes?.value ?? null,
    }

    const draftLabelling: VariantLabellingSerialized = {
      includeNutritionalInformationOnLabel:
        draftFoodAttrs.includeNutritionalInformationOnLabel?.value ??
        IncludeNutritionalInformationOnLabelAttribute.DEFAULT_VALUE,
      useBy: draftFoodAttrs.useBy?.value ?? null,
      sellBy: draftFoodAttrs.sellBy?.value ?? null,
      ean13Code: draftFoodAttrs.ean13Code?.value ?? null,
      legalTitle: draftFoodAttrs.legalTitle?.value ?? null,
      includeAverageWeightOnLabel: draftFoodAttrs.includeAverageWeightOnLabel?.value ?? null,
      countryOfOriginDescription: draftFoodAttrs.countryOfOriginDescription?.value ?? null,
      storageConditions: draftFoodAttrs.storageConditions?.value ?? null,
      canBeCookedInTurboChef: draftFoodAttrs.canBeCookedInTurboChef?.value ?? null,
      useByTurboChef: draftFoodAttrs.useByTurboChef?.value ?? null,
      sellByTurboChef: draftFoodAttrs.sellByTurboChef?.value ?? null,
      productServes: draftFoodAttrs.productServes?.value ?? null,
    }

    return Object.keys(liveLabelling).reduce((primitivesChanges, _primitiveKey) => {
      const primitiveKey = _primitiveKey as keyof typeof liveLabelling

      return (
        primitivesChanges + (liveLabelling[primitiveKey] === draftLabelling[primitiveKey] ? 0 : 1)
      )
    }, 0)
  }

  countName(): number {
    return this.compareMultiLangString(this.liveVariant.name, this.draftVariant.name)
  }

  /**
   * TODO
   * Move this to some PriceComparator class
   */
  countPrices(): number {
    const livePrices = this.liveVariant.prices
    const draftPrices = this.draftVariant.prices

    return draftPrices.reduce((changesCount, nextPriceChannel) => {
      const liveChannel = livePrices.find(
        (price) => price?.channel?.id === nextPriceChannel?.channel?.id,
      )

      const draftCustomFields = nextPriceChannel?.custom?.fields as CustomPriceFields
      const liveCustomFields = liveChannel?.custom?.fields as CustomPriceFields

      const livePrimitives = [
        liveChannel?.value?.centAmount ?? 0,
        liveCustomFields?.eatInPrice?.centAmount ?? 0,
        liveCustomFields?.eatInTax ?? 0,
        liveCustomFields?.takeAwayTax ?? 0,
        liveCustomFields?.deliveryPrice?.centAmount ?? 0,
        liveCustomFields?.deliveryTax ?? 0,
        liveCustomFields?.eatInClubPret?.centAmount ?? 0,
        liveCustomFields?.takeAwayClubPret?.centAmount ?? 0,
      ]

      const draftPrimitives = [
        nextPriceChannel?.value?.centAmount ?? 0,
        draftCustomFields?.eatInPrice?.centAmount ?? 0,
        draftCustomFields?.eatInTax ?? 0,
        draftCustomFields?.takeAwayTax ?? 0,
        draftCustomFields?.deliveryPrice?.centAmount ?? 0,
        draftCustomFields?.deliveryTax ?? 0,
        draftCustomFields?.eatInClubPret?.centAmount ?? 0,
        draftCustomFields?.takeAwayClubPret?.centAmount ?? 0,
      ]

      return (
        changesCount +
        draftPrimitives.reduce((primitiveChanges, value, index) => {
          if (isEqual(value, livePrimitives[index])) {
            return primitiveChanges
          }

          return primitiveChanges + 1
        }, 0)
      )
    }, 0)
  }

  countReporting(): number {
    const liveReportingFields: ParsedVariantReportingFields =
      new VariantReportingFactory().buildFromVariant(this.liveVariant)

    const draftReportingFields: ParsedVariantReportingFields =
      new VariantReportingFactory().buildFromVariant(this.draftVariant)

    return new VariantReportingChangesComparator(
      liveReportingFields,
      draftReportingFields,
    ).countChanges()
  }
}
