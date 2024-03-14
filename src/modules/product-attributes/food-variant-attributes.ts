import { Attribute } from '@commercetools/platform-sdk'

import { RawCommercetoolsProductTypeAttributes } from './raw-commercetools-product-type-attributes'
import { IncludeNutritionalInformationOnLabelAttribute } from './food-variant-attributes/include-nutritional-information-on-label-attribute'
import { LegalTitleAttribute } from './food-variant-attributes/legal-title-attribute'
import { Ean13CodeAttribute } from './food-variant-attributes/ean-13-code-attribute'
import { ParentProductSkuAttribute } from './common-variant-attributes/parent-product-sku-attribute'
import { IncludeAverageWeightOnLabelAttribute } from './food-variant-attributes/include-average-weight-on-label-attribute'
import { CountryOfOriginDescriptionAttribute } from './common-variant-attributes/country-of-origin-description-attribute'
import { UseByAttribute } from './common-variant-attributes/use-by-attribute'
import { SellByAttribute } from './common-variant-attributes/sell-by-attribute'
import { StorageConditionsAttribute } from './food-variant-attributes/storage-conditions-attribute'
import { CanBeCookedInTurboChefAttribute } from './common-variant-attributes/can-be-cooked-in-turbo-chef-attribute'
import { UseByTurboChefAttribute } from './common-variant-attributes/use-by-turbo-chef-attribute'
import { SellByTurboChefAttribute } from './common-variant-attributes/sell-by-turbo-chef-attribute'
import { ProductServesAttribute } from './common-variant-attributes/product-serves-attribute'
import { HgRecipeStatusAttribute } from './food-variant-attributes/hg-recipe-status'
import { RecipeTypeAttribute } from './food-variant-attributes/recipe-type-attribute'

export class FoodVariantAttributes {
  private raw = new RawCommercetoolsProductTypeAttributes(this.attributes)

  includeNutritionalInformationOnLabel = new IncludeNutritionalInformationOnLabelAttribute(
    this.raw.showNutritionalData ?? IncludeNutritionalInformationOnLabelAttribute.DEFAULT_VALUE,
  )

  legalTitle = this.raw.legalTitle ? new LegalTitleAttribute(this.raw.legalTitle) : null

  ean13Code = this.raw.ean13Code ? new Ean13CodeAttribute(this.raw.ean13Code) : null

  parentProductSku = this.raw.parentProductSku
    ? new ParentProductSkuAttribute(this.raw.parentProductSku)
    : null

  storageConditions: StorageConditionsAttribute | null = this.raw.storageConditions
    ? new StorageConditionsAttribute(this.raw.storageConditions.key)
    : null

  includeAverageWeightOnLabel = new IncludeAverageWeightOnLabelAttribute(
    this.raw.includeAverageWeightOnLabel ?? IncludeAverageWeightOnLabelAttribute.DEFAULT_VALUE,
  )

  countryOfOriginDescription = this.raw.countryOfOriginDescription
    ? new CountryOfOriginDescriptionAttribute(this.raw.countryOfOriginDescription)
    : null

  useBy = this.raw.useBy ? new UseByAttribute(this.raw.useBy.key) : null

  sellBy = this.raw.sellBy ? new SellByAttribute(this.raw.sellBy.key) : null

  productServes = this.raw.productServes
    ? new ProductServesAttribute(this.raw.productServes.key)
    : null

  canBeCookedInTurboChef = new CanBeCookedInTurboChefAttribute(
    this.raw.canBeCookedInTurboChef ?? CanBeCookedInTurboChefAttribute.DEFAULT_VALUE,
  )

  useByTurboChef = this.raw.useByTurboChef
    ? new UseByTurboChefAttribute(this.raw.useByTurboChef.key)
    : null

  sellByTurboChef = this.raw.sellByTurboChef
    ? new SellByTurboChefAttribute(this.raw.sellByTurboChef.key)
    : null

  hgRecipeStatus = this.raw.hgRecipeStatus
    ? new HgRecipeStatusAttribute(this.raw.hgRecipeStatus)
    : null

  recipeTypes = new RecipeTypeAttribute(this.raw.recipeTypes || RecipeTypeAttribute.DEFAULT_VALUE)

  constructor(private attributes: Attribute[]) {}
}
