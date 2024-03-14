import { FieldStatus } from './field-status'

export interface LabellingReviewStatus {
  storageConditions?: FieldStatus
  includeAverageWeightOnLabel?: FieldStatus
  countryOfOriginDescription?: FieldStatus
  ean13Code?: FieldStatus
  useBy?: FieldStatus
  sellBy?: FieldStatus
  legalTitle?: FieldStatus
  includeNutritionalInformationOnLabel?: FieldStatus
  canBeCookedInTurboChef?: FieldStatus
  useByTurboChef?: FieldStatus
  sellByTurboChef?: FieldStatus
  productServes?: FieldStatus
}

export interface BaristaAttributesReviewStatus {
  withDecafPods?: FieldStatus
  withoutMilk?: FieldStatus
  withSemiSkimmedMilk?: FieldStatus
  withSkimmedMilk?: FieldStatus
  withOatMilk?: FieldStatus
  withRiceCoconutMilk?: FieldStatus
  withSoyMilk?: FieldStatus
}
export interface AvailabilityReviewStatus {
  availableForClickAndCollect?: FieldStatus
  availableForPretDelivers?: FieldStatus
  availableForOutposts?: FieldStatus
  isLive?: FieldStatus
  visibleOnDeliveryWebsite?: FieldStatus
  isChefsSpecial?: FieldStatus
  availableForLunch?: FieldStatus
  availableAllDay?: FieldStatus
  displayAsNewUntil?: FieldStatus
  isDisplayed?: FieldStatus
}
export interface PriceStatus extends FieldStatus {
  value: {
    channelName: string
    field:
      | 'takeAwayPrice'
      | 'eatInPrice'
      | 'deliveryPrice'
      | 'eatInTax'
      | 'takeAwayTax'
      | 'deliveryTax'
      | 'eatInClubPret'
      | 'takeAwayClubPret'
  }
}

export interface VariantReviewStatus {
  marketing: {
    name?: {
      [key: string]: FieldStatus
    }
    description?: {
      [key: string]: FieldStatus
    }
    availableForClickAndCollect?: FieldStatus
    availableForPretDelivers?: FieldStatus
    availableForOutposts?: FieldStatus
    isLive?: FieldStatus
    visibleOnDeliveryWebsite?: FieldStatus
    isChefsSpecial?: FieldStatus
    availableForLunch?: FieldStatus
    availableAllDay?: FieldStatus
    displayAsNewUntil?: FieldStatus
    isDisplayed?: FieldStatus
    howToDisplay?: FieldStatus
  }
  prices: PriceStatus[]
  reporting: {
    pluReportingName?: FieldStatus
    pluPrimaryCategoryID?: FieldStatus
    pluSecondaryCategoryID?: FieldStatus
    starKisProductCategoryID?: FieldStatus
    starKisProductSubCategoryID?: FieldStatus
    parentProductSku?: FieldStatus
    posID?: FieldStatus
    productRange?: FieldStatus
  }
  labelling: LabellingReviewStatus | null
  attributes: BaristaAttributesReviewStatus | null
}
