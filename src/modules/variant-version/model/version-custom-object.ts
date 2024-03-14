import { CustomObject } from '@commercetools/platform-sdk'

import { SerializedVariantAvailabilityFields } from '../../../shared/model/variant-availability'
import { MultilangString } from '../../product/logic/models/multilang-string'
import { SerializedVariantReportingFields } from '../../product/logic/models/variant-reporting'
import { BaristaAttributes } from '../../../shared/model/barista-attributes'
import { ChannelPrice } from '../../../shared/model/channel-price'
import { VariantHowToDisplay } from '../../../shared/model/variant-how-to-display'
import { VariantLabellingSerialized } from '../../../shared/model/variant-labelling'

export interface VariantVersionPortalFields {
  name?: MultilangString
  description?: MultilangString
  availability?: SerializedVariantAvailabilityFields
  reporting?: SerializedVariantReportingFields
  baristaAttributes?: BaristaAttributes
  pricing?: ChannelPrice[]
  howToDisplay?: VariantHowToDisplay
  labelling?: VariantLabellingSerialized
}

// this represents data stored in ct custom object
export interface VersionCustomObjectPayload {
  key: string
  hg: {
    averageWeight: number
    country: string
    ingredients: {
      'en-GB': string
    }
    lastUpdatedFromHG: string
    liveFrom: string
    liveTo?: string
    localizedClaims: any[]
    localizedContainsAllergens: string[]
    name: string
    nutritionals: Array<{
      code: string
      per100grams: number
      perServing: number
    }>
    suitableForVegans: boolean
    suitableForVegetarians: boolean
    hgCode: string
    version: number
    productCountry: string
    productId: {
      code: string
      version: string
    }
    constituentItems: Array<{
      constituentItemCode: string
      constituentItemQuantity: string
      constituentItemVersion: number
    }>
    hgRecipeStatus: string
    recipeType: string[]
  }
  approved?: VariantVersionPortalFields
  draft?: VariantVersionPortalFields
  hasDraftChanges?: boolean
}

export type VariantVersionCustomObject = Omit<CustomObject, 'value'> & {
  value: VersionCustomObjectPayload
}
