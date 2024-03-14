import { PluPrimaryCategoryAttribute } from './common-variant-attributes/plu-primary-category-attribute'
import { PluSecondaryCategoryAttribute } from './common-variant-attributes/plu-secondary-category-attribute'
import { IsDecafPodAttribute } from './barista-variant-attributes/is-decaf-pod-attribute'
import { IsBlackAttribute } from './barista-variant-attributes/is-black-attribute'
import { MilkIsSemiSkimmedAttribute } from './barista-variant-attributes/milk-is-semi-skimmed-attribute'
import { MilkIsSkimmedAttribute } from './barista-variant-attributes/milk-is-skimmed-attribute'
import { MilkIsOatAttribute } from './barista-variant-attributes/milk-is-oat-attribute'
import { MilkIsRiceCoconutAttribute } from './barista-variant-attributes/milk-is-rice-coconut-attribute'
import { MilkIsSoyaAttribute } from './barista-variant-attributes/milk-is-soya-attribute'
import { NewUntilAttribute } from './common-variant-attributes/new-until-attribute'
import { DisplayAsNewAttribute } from './common-variant-attributes/display-as-new-attribute'
import { ChefSpecialAttribute } from './common-variant-attributes/chef-special-attribute'
import { ProductCategoryAttribute } from './common-variant-attributes/product-category-attribute'
import { ProductSubCategoryAttribute } from './common-variant-attributes/product-sub-category-attribute'
import { PretDeliversAvailableAllDayAttribute } from './common-variant-attributes/pret-delivers-available-all-day-attribute'
import { PretDeliversAvailableForLunchAttribute } from './common-variant-attributes/pret-delivers-available-for-lunch-attribute'
import { AvailableForCollectionAttribute } from './common-variant-attributes/available-for-collection-attribute'
import { VisibleAttribute } from './common-variant-attributes/visible-attribute'

export const getAttributeByDtoKey = (key: string) => {
  switch (key) {
    case 'withDecafPods':
      return IsDecafPodAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'withoutMilk':
      return IsBlackAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'withSkimmedMilk':
      return MilkIsSkimmedAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'withSemiSkimmedMilk':
      return MilkIsSemiSkimmedAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'withOatMilk':
      return MilkIsOatAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'withRiceCoconutMilk':
      return MilkIsRiceCoconutAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'withSoyMilk':
      return MilkIsSoyaAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'isChefsSpecial':
      return ChefSpecialAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'isDisplayed':
      return DisplayAsNewAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'until':
      return NewUntilAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'pluPrimaryCategoryID':
      return PluPrimaryCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'pluSecondaryCategoryID':
      return PluSecondaryCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'starKisProductCategoryID':
      return ProductCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'starKisProductSubCategoryID':
      return ProductSubCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'starKisProductSubCategoryID':
      return ProductSubCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'availableAllDay':
      return PretDeliversAvailableAllDayAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'availableForLunch':
      return PretDeliversAvailableForLunchAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'availableForClickAndCollect':
      return AvailableForCollectionAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'isLive':
      return VisibleAttribute.COMMERCE_TOOLS_ATTR_NAME
    case 'iceMachineRequired':
      return 'requiresIceMachine'
    case 'blenderRequired':
      return 'requiresBlender'
    default:
      return key
  }
}
