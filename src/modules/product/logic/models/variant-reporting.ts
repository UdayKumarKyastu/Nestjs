import { isEqual } from 'lodash'

import { PosIdAttribute } from '../../../product-attributes/common-variant-attributes/pos-id-attribute'
import { PluReportingNameAttribute } from '../../../product-attributes/common-variant-attributes/plu-reporting-name-attribute'
import { PluPrimaryCategoryAttribute } from '../../../product-attributes/common-variant-attributes/plu-primary-category-attribute'
import { PluSecondaryCategoryAttribute } from '../../../product-attributes/common-variant-attributes/plu-secondary-category-attribute'
import { ProductCategoryAttribute } from '../../../product-attributes/common-variant-attributes/product-category-attribute'
import { ProductSubCategoryAttribute } from '../../../product-attributes/common-variant-attributes/product-sub-category-attribute'
import { ParentProductSkuAttribute } from '../../../product-attributes/common-variant-attributes/parent-product-sku-attribute'
import { ProductRangeAttribute } from '../../../product-attributes/common-variant-attributes/product-range-attribute'
import { BaristaProductVariant, FoodProductVariant } from '../../../product-variant/product-variant'

export interface SerializedVariantReportingFields {
  posID: string | null
  pluReportingName: string | null
  pluPrimaryCategoryID: string | null
  pluSecondaryCategoryID: string | null
  starKisProductCategoryID: string | null
  starKisProductSubCategoryID: string | null
  parentProductSku: string | null
  productRange: string[] | null
}

export interface ParsedVariantReportingFields {
  posID: PosIdAttribute | null
  pluReportingName: PluReportingNameAttribute | null
  pluPrimaryCategoryID: PluPrimaryCategoryAttribute | null
  pluSecondaryCategoryID: PluSecondaryCategoryAttribute | null
  starKisProductCategoryID: ProductCategoryAttribute | null
  starKisProductSubCategoryID: ProductSubCategoryAttribute | null
  parentProductSku: ParentProductSkuAttribute | null
  productRange: ProductRangeAttribute | null
}

export class VariantReportingFieldsParser {
  constructor(private serializedFields: SerializedVariantReportingFields) {}

  parse(): ParsedVariantReportingFields {
    const {
      pluReportingName,
      pluSecondaryCategoryID,
      pluPrimaryCategoryID,
      parentProductSku,
      starKisProductCategoryID,
      starKisProductSubCategoryID,
      posID,
      productRange,
    } = this.serializedFields

    return {
      posID: posID ? new PosIdAttribute(posID) : null,
      parentProductSku: parentProductSku ? new ParentProductSkuAttribute(parentProductSku) : null,
      pluReportingName: pluReportingName ? new PluReportingNameAttribute(pluReportingName) : null,
      pluPrimaryCategoryID: pluPrimaryCategoryID
        ? new PluPrimaryCategoryAttribute(pluPrimaryCategoryID)
        : null,
      pluSecondaryCategoryID: pluSecondaryCategoryID
        ? new PluSecondaryCategoryAttribute(pluSecondaryCategoryID)
        : null,
      starKisProductCategoryID: starKisProductCategoryID
        ? new ProductCategoryAttribute(starKisProductCategoryID)
        : null,
      starKisProductSubCategoryID: starKisProductSubCategoryID
        ? new ProductSubCategoryAttribute(starKisProductSubCategoryID)
        : null,
      productRange: productRange ? new ProductRangeAttribute(productRange) : null,
    }
  }
}

export class VariantReportingFactory {
  buildFromVariant(
    variant: FoodProductVariant | BaristaProductVariant,
  ): ParsedVariantReportingFields {
    return {
      pluReportingName: variant.commonAttributes.pluReportingName,
      pluPrimaryCategoryID: variant.commonAttributes.pluPrimaryCategoryID,
      pluSecondaryCategoryID: variant.commonAttributes.pluSecondaryCategoryID,
      starKisProductCategoryID: variant.commonAttributes.starKisProductCategoryID,
      starKisProductSubCategoryID: variant.commonAttributes.starKisProductSubCategoryID,
      posID: variant.commonAttributes.posId,
      productRange: variant.commonAttributes.productRange,
      parentProductSku: variant.isFoodVariant() ? variant.foodAttributes.parentProductSku : null,
    }
  }
}

export class VariantReportingChangesComparator {
  constructor(
    private reporting: ParsedVariantReportingFields,
    private reportingToCompare: ParsedVariantReportingFields,
  ) {}

  countChanges(): number {
    return Object.keys(this.reporting).reduce((changesCount, _fieldKey) => {
      const fieldKey = _fieldKey as keyof ParsedVariantReportingFields

      const firstField = this.reporting[fieldKey]
      const secondField = this.reportingToCompare[fieldKey]

      if (firstField === null && secondField === null) {
        return changesCount
      }

      if ((firstField === null && secondField) || (firstField && secondField === null)) {
        return changesCount + 1
      }

      if (fieldKey === ProductRangeAttribute.COMMERCE_TOOLS_ATTR_NAME) {
        return isEqual(firstField?.value, secondField?.value) ? changesCount : changesCount + 1
      }

      if (firstField && secondField) {
        changesCount += this.reporting[fieldKey]?.sameValueAs(
          this.reportingToCompare[fieldKey]?.value ?? '',
        )
          ? 0
          : 1

        return changesCount
      }

      console.warn('Fallthrough condition, should not happen')

      return changesCount
    }, 0)
  }
}
