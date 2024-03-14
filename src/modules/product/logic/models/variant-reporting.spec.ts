import { PosIdAttribute } from '../../../product-attributes/common-variant-attributes/pos-id-attribute'
import { ParentProductSkuAttribute } from '../../../product-attributes/common-variant-attributes/parent-product-sku-attribute'
import { ProductSubCategoryAttribute } from '../../../product-attributes/common-variant-attributes/product-sub-category-attribute'
import { ProductCategoryAttribute } from '../../../product-attributes/common-variant-attributes/product-category-attribute'
import { PluPrimaryCategoryAttribute } from '../../../product-attributes/common-variant-attributes/plu-primary-category-attribute'
import { PluSecondaryCategoryAttribute } from '../../../product-attributes/common-variant-attributes/plu-secondary-category-attribute'
import { PluReportingNameAttribute } from '../../../product-attributes/common-variant-attributes/plu-reporting-name-attribute'
import { ProductRangeAttribute } from '../../../product-attributes/common-variant-attributes/product-range-attribute'

import {
  ParsedVariantReportingFields,
  VariantReportingChangesComparator,
} from './variant-reporting'

const getBaseParsedReporitngModel = (): ParsedVariantReportingFields => {
  return {
    posID: new PosIdAttribute('123'),
    parentProductSku: new ParentProductSkuAttribute('UK12345'),
    starKisProductSubCategoryID: new ProductSubCategoryAttribute('foo'),
    starKisProductCategoryID: new ProductCategoryAttribute('Bar'),
    pluPrimaryCategoryID: new PluPrimaryCategoryAttribute('plucat'),
    pluSecondaryCategoryID: new PluSecondaryCategoryAttribute('pluseccat'),
    pluReportingName: new PluReportingNameAttribute('reporting name'),
    productRange: new ProductRangeAttribute([]),
  }
}

describe('VariantReportingChangesComparator', function () {
  describe('Compares reporting and count changes', () => {
    test('Models are the same', () => {
      const reporting1 = getBaseParsedReporitngModel()
      const reporting2 = getBaseParsedReporitngModel()

      const comparator = new VariantReportingChangesComparator(reporting1, reporting2)

      expect(comparator.countChanges()).toBe(0)
    })

    test('ParentProductSku is null for both (barista case)', () => {
      const reporting1 = getBaseParsedReporitngModel()
      const reporting2 = getBaseParsedReporitngModel()

      reporting1.parentProductSku = null
      reporting2.parentProductSku = null

      const comparator = new VariantReportingChangesComparator(reporting1, reporting2)

      expect(comparator.countChanges()).toBe(0)
    })

    test('Everything is null', () => {
      const reporting1 = getBaseParsedReporitngModel() as any
      const reporting2 = getBaseParsedReporitngModel() as any

      Object.keys(reporting1).forEach((key) => {
        reporting1[key as keyof typeof reporting1] = null
        reporting2[key as keyof typeof reporting1] = null
      })

      const comparator = new VariantReportingChangesComparator(reporting1, reporting2)

      expect(comparator.countChanges()).toBe(0)
    })

    test('1st has null fields, 2nd is filled', () => {
      const reporting1 = getBaseParsedReporitngModel()
      const reporting2 = getBaseParsedReporitngModel()

      reporting1.pluReportingName = null
      reporting1.parentProductSku = null
      reporting1.pluPrimaryCategoryID = null

      const comparator = new VariantReportingChangesComparator(reporting1, reporting2)

      expect(comparator.countChanges()).toBe(3)
    })

    test('2nd has null fields, 1st is filled', () => {
      const reporting1 = getBaseParsedReporitngModel()
      const reporting2 = getBaseParsedReporitngModel()

      reporting2.pluReportingName = null
      reporting2.parentProductSku = null
      reporting2.pluPrimaryCategoryID = null

      const comparator = new VariantReportingChangesComparator(reporting1, reporting2)

      expect(comparator.countChanges()).toBe(3)
    })
  })
})
