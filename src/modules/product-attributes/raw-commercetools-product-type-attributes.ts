import { Attribute, LocalizedString } from '@commercetools/platform-sdk'

import { CtAttributesResolver } from '../ct-utils/get-attribute-value'
import { Allergen } from '../product/logic/models/allergen'
import { DateString } from '../product/logic/models/date-string'
import { IsoDateTimeString } from '../product/logic/models/iso-date-time-string'

import { CountryOfOriginDescriptionAttribute } from './common-variant-attributes/country-of-origin-description-attribute'
import { Ean13CodeAttribute } from './food-variant-attributes/ean-13-code-attribute'
import { UseByAttribute } from './common-variant-attributes/use-by-attribute'
import { SellByAttribute } from './common-variant-attributes/sell-by-attribute'
import { LegalTitleAttribute } from './food-variant-attributes/legal-title-attribute'
import { IncludeAverageWeightOnLabelAttribute } from './food-variant-attributes/include-average-weight-on-label-attribute'
import { StorageConditionsAttribute } from './food-variant-attributes/storage-conditions-attribute'
import { PosIdAttribute } from './common-variant-attributes/pos-id-attribute'
import { HgCodeAttribute } from './common-variant-attributes/hg-code-attribute'
import { ParentProductSkuAttribute } from './common-variant-attributes/parent-product-sku-attribute'
import { NewUntilAttribute } from './common-variant-attributes/new-until-attribute'
import { LiveFromAttribute } from './common-variant-attributes/live-from-attribute'
import { LiveToAttribute } from './common-variant-attributes/live-to-attribute'
import { ChefSpecialAttribute } from './common-variant-attributes/chef-special-attribute'
import { DisplayAsNewAttribute } from './common-variant-attributes/display-as-new-attribute'
import { CountryAttribute } from './common-variant-attributes/country-attribute'
import { IngredientsAttribute } from './common-variant-attributes/ingredients-attribute'
import { DescriptionAttribute } from './common-variant-attributes/description-attribute'
import { SuitableForVegetariansAttribute } from './common-variant-attributes/suitable-for-vegetarians-attribute'
import { SuitableForVegansAttribute } from './common-variant-attributes/suitable-for-vegans-attribute'
import { VisibleAttribute } from './common-variant-attributes/visible-attribute'
import { AverageWeightAttribute } from './common-variant-attributes/average-weight-attribute'
import { LastUpdatedFromHgAttribute } from './common-variant-attributes/last-updated-from-hg-attribute'
import { ContainsAllergensAttribute } from './common-variant-attributes/contains-allergens-attribute'
import { AvailableForCollectionAttribute } from './common-variant-attributes/available-for-collection-attribute'
import { AvailableForOutpostsAttribute } from './common-variant-attributes/available-for-outposts-attribute'
import { PretDeliversAvailableAllDayAttribute } from './common-variant-attributes/pret-delivers-available-all-day-attribute'
import { PretDeliversAvailableForLunchAttribute } from './common-variant-attributes/pret-delivers-available-for-lunch-attribute'
import { AvailableForPretDeliversAttribute } from './common-variant-attributes/available-for-pret-delivers-attribute'
import { VisibleOnDeliveryWebsiteAttribute } from './common-variant-attributes/visible-on-delivery-website-attribute'
import { HowToDisplayAttribute } from './common-variant-attributes/how-to-display-attribute'
import { LocalizedContainsAllergensAttribute } from './common-variant-attributes/localized-contains-allergens-attribute'
import { IncludeNutritionalInformationOnLabelAttribute } from './food-variant-attributes/include-nutritional-information-on-label-attribute'
import { PluPrimaryCategoryAttribute } from './common-variant-attributes/plu-primary-category-attribute'
import { PluSecondaryCategoryAttribute } from './common-variant-attributes/plu-secondary-category-attribute'
import { PluReportingNameAttribute } from './common-variant-attributes/plu-reporting-name-attribute'
import { ProductSubCategoryAttribute } from './common-variant-attributes/product-sub-category-attribute'
import { ProductCategoryAttribute } from './common-variant-attributes/product-category-attribute'
import {
  CtNutritionItem,
  NutritionalsAttribute,
} from './common-variant-attributes/nutritionals-attribute'
import { CanBeCookedInTurboChefAttribute } from './common-variant-attributes/can-be-cooked-in-turbo-chef-attribute'
import { UseByTurboChefAttribute } from './common-variant-attributes/use-by-turbo-chef-attribute'
import { SellByTurboChefAttribute } from './common-variant-attributes/sell-by-turbo-chef-attribute'
import { ProductVariantVersionsAttribute } from './common-variant-attributes/product-variant-versions-attribute'
import { VersionAttribute } from './common-variant-attributes/version-attribute'
import { ProductServesAttribute } from './common-variant-attributes/product-serves-attribute'
import { ConstituentItems } from './common-variant-attributes/constituent-items'
import { HgRecipeStatusAttribute } from './food-variant-attributes/hg-recipe-status'
import { RecipeTypeAttribute } from './food-variant-attributes/recipe-type-attribute'
import { ProductRangeAttribute } from './common-variant-attributes/product-range-attribute'

type CtEnum = { key: string; label: string }

/**
 * TODO
 * - Add missing fields (reporting)
 * - Move this to product-attributes folder
 */
export class RawCommercetoolsProductTypeAttributes {
  ingredients: LocalizedString
  description: LocalizedString
  suitableForVegetarians: boolean
  suitableForVegans: boolean
  visible?: boolean
  averageWeight?: number
  lastUpdatedFromHG: IsoDateTimeString | null
  newUntil?: DateString
  liveFrom?: DateString
  liveTo?: DateString
  chefSpecial?: boolean
  displayAsNew?: boolean
  country: { key: string; label: string }
  containsAllergens?: Allergen[]
  localizedContainsAllergens?: { key: string; label: LocalizedString }[]
  posId: string | null
  hgCode: string | null
  availableForCollection?: boolean
  availableForOutposts?: boolean
  howToDisplay?: { key: string; label: string }[]
  visibleOnDeliveryWebsite?: boolean
  availableForPretDelivers?: boolean
  pretDeliversAvailableForLunch?: boolean
  pretDeliversAvailableAllDay?: boolean
  parentProductSku: string | null
  storageConditions: CtEnum
  includeAverageWeightOnLabel: boolean
  countryOfOriginDescription?: string
  ean13Code: string
  useBy: CtEnum
  sellBy: CtEnum
  productServes: CtEnum
  legalTitle: string | null
  showNutritionalData?: boolean
  pluPrimaryCategoryID: CtEnum | null
  pluSecondaryCategoryID: CtEnum | null
  pluReportingName: string | null
  starKisProductSubCategoryID: CtEnum | null
  starKisProductCategoryID: CtEnum | null
  nutritionals?: CtNutritionItem[]
  canBeCookedInTurboChef: boolean
  useByTurboChef: CtEnum
  sellByTurboChef: CtEnum
  version: number
  versions: Array<{
    typeId: 'key-value-document'
    id: string
  }> = []
  constituentItems: Array<
    [
      { name: 'constituentItemCode'; value: string },
      { name: 'constituentItemQuantity'; value: string },
      { name: 'constituentItemVersion'; value: number },
    ]
  >
  hgRecipeStatus: string | null
  recipeTypes: CtEnum[]
  productRange: CtEnum[] | null

  constructor(attributes: Attribute[]) {
    const getAttributeValue = CtAttributesResolver.constructAttributeValueGetter(attributes)

    this.versions = getAttributeValue<
      Array<{
        typeId: 'key-value-document'
        id: string
      }>
    >(ProductVariantVersionsAttribute.COMMERCE_TOOLS_ATTR_NAME)

    this.pluPrimaryCategoryID = getAttributeValue<CtEnum>(PluPrimaryCategoryAttribute) ?? null
    this.pluSecondaryCategoryID = getAttributeValue<CtEnum>(PluSecondaryCategoryAttribute) ?? null
    this.pluReportingName = getAttributeValue(PluReportingNameAttribute) ?? null
    this.starKisProductSubCategoryID =
      getAttributeValue<CtEnum>(ProductSubCategoryAttribute) ?? null
    this.starKisProductCategoryID = getAttributeValue<CtEnum>(ProductCategoryAttribute) ?? null

    this.ingredients = getAttributeValue(IngredientsAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.description = getAttributeValue<LocalizedString>(
      DescriptionAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.suitableForVegetarians = getAttributeValue<boolean>(
      SuitableForVegetariansAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )

    this.suitableForVegans = getAttributeValue<boolean>(
      SuitableForVegansAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.visible = getAttributeValue<boolean>(VisibleAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.averageWeight = getAttributeValue<number>(AverageWeightAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.lastUpdatedFromHG =
      getAttributeValue<string>(LastUpdatedFromHgAttribute.COMMERCE_TOOLS_ATTR_NAME) || null
    this.newUntil = getAttributeValue<string>(NewUntilAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.liveFrom = getAttributeValue<string>(LiveFromAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.liveTo = getAttributeValue<string>(LiveToAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.chefSpecial = getAttributeValue<boolean>(ChefSpecialAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.displayAsNew = getAttributeValue<boolean>(DisplayAsNewAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.country = getAttributeValue<{ key: string; label: string }>(
      CountryAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.containsAllergens = getAttributeValue<string[]>(
      ContainsAllergensAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.localizedContainsAllergens = getAttributeValue<{ key: string; label: LocalizedString }[]>(
      LocalizedContainsAllergensAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.posId = getAttributeValue<string>(PosIdAttribute.COMMERCE_TOOLS_ATTR_NAME) || null
    this.hgCode = getAttributeValue<string>(HgCodeAttribute.COMMERCE_TOOLS_ATTR_NAME) || null
    this.availableForCollection = getAttributeValue<boolean>(
      AvailableForCollectionAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.availableForOutposts = getAttributeValue<boolean>(
      AvailableForOutpostsAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.howToDisplay = getAttributeValue<{ key: string; label: string }[]>(
      HowToDisplayAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.visibleOnDeliveryWebsite = getAttributeValue<boolean>(
      VisibleOnDeliveryWebsiteAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.availableForPretDelivers = getAttributeValue<boolean>(
      AvailableForPretDeliversAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.pretDeliversAvailableForLunch = getAttributeValue<boolean>(
      PretDeliversAvailableForLunchAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.pretDeliversAvailableAllDay = getAttributeValue<boolean>(
      PretDeliversAvailableAllDayAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.parentProductSku = getAttributeValue(ParentProductSkuAttribute.COMMERCE_TOOLS_ATTR_NAME)

    this.storageConditions = getAttributeValue<CtEnum>(
      StorageConditionsAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.includeAverageWeightOnLabel = getAttributeValue(
      IncludeAverageWeightOnLabelAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.countryOfOriginDescription = getAttributeValue(
      CountryOfOriginDescriptionAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )

    this.ean13Code = getAttributeValue(Ean13CodeAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.useBy = getAttributeValue<CtEnum>(UseByAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.sellBy = getAttributeValue<CtEnum>(SellByAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.productServes = getAttributeValue<CtEnum>(ProductServesAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.legalTitle = getAttributeValue(LegalTitleAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.showNutritionalData = getAttributeValue(
      IncludeNutritionalInformationOnLabelAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.nutritionals = getAttributeValue(NutritionalsAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.canBeCookedInTurboChef = getAttributeValue(
      CanBeCookedInTurboChefAttribute.COMMERCE_TOOLS_ATTR_NAME,
    )
    this.useByTurboChef = getAttributeValue(UseByTurboChefAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.sellByTurboChef = getAttributeValue(SellByTurboChefAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.version = getAttributeValue(VersionAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.constituentItems = getAttributeValue(ConstituentItems.COMMERCE_TOOLS_ATTR_NAME)
    this.hgRecipeStatus = getAttributeValue(HgRecipeStatusAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.recipeTypes = getAttributeValue(RecipeTypeAttribute.COMMERCE_TOOLS_ATTR_NAME)
    this.productRange = getAttributeValue(ProductRangeAttribute) ?? null
  }
}
