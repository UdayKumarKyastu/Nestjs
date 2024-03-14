import { Attribute } from '@commercetools/platform-sdk'
import { isArray } from 'lodash'

import { CountryCodeParser } from '../../shared/model/country-code'

import { CountryAttribute } from './common-variant-attributes/country-attribute'
import { VisibleAttribute } from './common-variant-attributes/visible-attribute'
import { ChefSpecialAttribute } from './common-variant-attributes/chef-special-attribute'
import { DisplayAsNewAttribute } from './common-variant-attributes/display-as-new-attribute'
import { AverageWeightAttribute } from './common-variant-attributes/average-weight-attribute'
import { SuitableForVegansAttribute } from './common-variant-attributes/suitable-for-vegans-attribute'
import { SuitableForVegetariansAttribute } from './common-variant-attributes/suitable-for-vegetarians-attribute'
import { AvailableForCollectionAttribute } from './common-variant-attributes/available-for-collection-attribute'
import { AvailableForOutpostsAttribute } from './common-variant-attributes/available-for-outposts-attribute'
import { VisibleOnDeliveryWebsiteAttribute } from './common-variant-attributes/visible-on-delivery-website-attribute'
import { AvailableForPretDeliversAttribute } from './common-variant-attributes/available-for-pret-delivers-attribute'
import { PretDeliversAvailableForLunchAttribute } from './common-variant-attributes/pret-delivers-available-for-lunch-attribute'
import { PretDeliversAvailableAllDayAttribute } from './common-variant-attributes/pret-delivers-available-all-day-attribute'
import { NewUntilAttribute } from './common-variant-attributes/new-until-attribute'
import { RawCommercetoolsProductTypeAttributes } from './raw-commercetools-product-type-attributes'
import { PosIdAttribute } from './common-variant-attributes/pos-id-attribute'
import { HgCodeAttribute } from './common-variant-attributes/hg-code-attribute'
import { LastUpdatedFromHgAttribute } from './common-variant-attributes/last-updated-from-hg-attribute'
import { LiveFromAttribute } from './common-variant-attributes/live-from-attribute'
import { LiveToAttribute } from './common-variant-attributes/live-to-attribute'
import { IngredientsAttribute } from './common-variant-attributes/ingredients-attribute'
import { DescriptionAttribute } from './common-variant-attributes/description-attribute'
import { LocalizedContainsAllergensAttribute } from './common-variant-attributes/localized-contains-allergens-attribute'
import { ContainsAllergensAttribute } from './common-variant-attributes/contains-allergens-attribute'
import { HowToDisplayAttribute } from './common-variant-attributes/how-to-display-attribute'
import { PluPrimaryCategoryAttribute } from './common-variant-attributes/plu-primary-category-attribute'
import { PluSecondaryCategoryAttribute } from './common-variant-attributes/plu-secondary-category-attribute'
import { PluReportingNameAttribute } from './common-variant-attributes/plu-reporting-name-attribute'
import { ProductSubCategoryAttribute } from './common-variant-attributes/product-sub-category-attribute'
import { ProductCategoryAttribute } from './common-variant-attributes/product-category-attribute'
import { NutritionalsAttribute } from './common-variant-attributes/nutritionals-attribute'
import { VersionAttribute } from './common-variant-attributes/version-attribute'
import { ProductVariantVersionsAttribute } from './common-variant-attributes/product-variant-versions-attribute'
import { ProductRangeAttribute } from './common-variant-attributes/product-range-attribute'

export class CommonProductVariantAttributes {
  private raw = new RawCommercetoolsProductTypeAttributes(this.attributes)

  versions = new ProductVariantVersionsAttribute(
    this.raw.versions?.map((ref) => ref.id) ?? ProductVariantVersionsAttribute.DEFAULT_VALUE,
  )

  ingredients = new IngredientsAttribute(this.raw.ingredients)

  description = new DescriptionAttribute(this.raw.description)

  suitableForVegetarians = new SuitableForVegetariansAttribute(
    this.raw.suitableForVegetarians ?? SuitableForVegetariansAttribute.DEFAULT_VALUE,
  )

  suitableForVegans = new SuitableForVegansAttribute(
    this.raw.suitableForVegans ?? SuitableForVegansAttribute.DEFAULT_VALUE,
  )

  visible = new VisibleAttribute(this.raw.visible ?? VisibleAttribute.DEFAULT_VALUE)

  averageWeight = new AverageWeightAttribute(
    this.raw.averageWeight ?? AverageWeightAttribute.DEFAULT_VALUE,
  )

  lastUpdatedFromHG = this.raw.lastUpdatedFromHG
    ? new LastUpdatedFromHgAttribute(this.raw.lastUpdatedFromHG)
    : null

  newUntil = this.raw.newUntil ? new NewUntilAttribute(this.raw.newUntil) : null

  liveFrom = this.raw.liveFrom ? new LiveFromAttribute(this.raw.liveFrom) : null

  liveTo = this.raw.liveTo ? new LiveToAttribute(this.raw.liveTo) : null

  chefSpecial = new ChefSpecialAttribute(this.raw.chefSpecial ?? ChefSpecialAttribute.DEFAULT_VALUE)

  displayAsNew = new DisplayAsNewAttribute(
    this.raw.displayAsNew ?? DisplayAsNewAttribute.DEFAULT_VALUE,
  )

  country = new CountryAttribute(new CountryCodeParser().parse(this.raw.country.key))

  containsAllergens = new ContainsAllergensAttribute(
    this.raw.containsAllergens ?? ContainsAllergensAttribute.DEFAULT_VALUE,
  )

  localizedContainsAllergens = new LocalizedContainsAllergensAttribute(
    this.raw.localizedContainsAllergens ?? LocalizedContainsAllergensAttribute.DEFAULT_VALUE,
  )

  posId = this.raw.posId ? new PosIdAttribute(this.raw.posId) : null

  hgCode = this.raw.hgCode ? new HgCodeAttribute(this.raw.hgCode) : null

  availableForCollection = new AvailableForCollectionAttribute(
    this.raw.availableForCollection ?? AvailableForCollectionAttribute.DEFAULT_VALUE,
  )

  availableForOutposts = new AvailableForOutpostsAttribute(
    this.raw.availableForOutposts ?? AvailableForOutpostsAttribute.DEFAULT_VALUE,
  )

  howToDisplay = new HowToDisplayAttribute(
    this.raw.howToDisplay ?? HowToDisplayAttribute.DEFAULT_VALUE,
  )

  visibleOnDeliveryWebsite = new VisibleOnDeliveryWebsiteAttribute(
    this.raw.visibleOnDeliveryWebsite ?? VisibleOnDeliveryWebsiteAttribute.DEFAULT_VALUE,
  )

  availableForPretDelivers = new AvailableForPretDeliversAttribute(
    this.raw.availableForPretDelivers ?? AvailableForPretDeliversAttribute.DEFAULT_VALUE,
  )

  availableForLunch = new PretDeliversAvailableForLunchAttribute(
    this.raw.pretDeliversAvailableForLunch ?? PretDeliversAvailableForLunchAttribute.DEFAULT_VALUE,
  )

  availableAllDay = new PretDeliversAvailableAllDayAttribute(
    this.raw.pretDeliversAvailableAllDay ?? PretDeliversAvailableAllDayAttribute.DEFAULT_VALUE,
  )

  pluPrimaryCategoryID = this.raw.pluPrimaryCategoryID?.key
    ? new PluPrimaryCategoryAttribute(this.raw.pluPrimaryCategoryID.key)
    : null

  pluSecondaryCategoryID = this.raw.pluSecondaryCategoryID?.key
    ? new PluSecondaryCategoryAttribute(this.raw.pluSecondaryCategoryID.key)
    : null

  pluReportingName = this.raw.pluReportingName
    ? new PluReportingNameAttribute(this.raw.pluReportingName)
    : null

  starKisProductSubCategoryID = this.raw.starKisProductSubCategoryID?.key
    ? new ProductSubCategoryAttribute(this.raw.starKisProductSubCategoryID.key)
    : null

  starKisProductCategoryID = this.raw.starKisProductCategoryID?.key
    ? new ProductCategoryAttribute(this.raw.starKisProductCategoryID.key)
    : null

  nutritionals = this.raw.nutritionals ? new NutritionalsAttribute(this.raw.nutritionals) : null

  version = new VersionAttribute(this.raw.version ?? VersionAttribute.DEFAULT_VALUE)

  constituentItems = this.raw.constituentItems

  productRange = isArray(this.raw.productRange)
    ? new ProductRangeAttribute(this.raw.productRange?.map((option) => option.key ?? option))
    : null

  constructor(private attributes: Attribute[] = []) {}
}
