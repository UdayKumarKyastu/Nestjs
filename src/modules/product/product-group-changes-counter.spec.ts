import { Attribute, ProductData, Product } from '@commercetools/platform-sdk'

import { CountryCode } from '../../shared/model/country-code'
import { BaristaSetupDto } from '../../shared/dto/barista-setup.dto'
import { ProductDraftChangesDto } from '../../shared/dto/product-draft-changes.dto'
import { CategoryListItemDto } from '../../shared/dto/category-list-item.dto'
import { ProductDto } from '../../shared/dto/product.dto'
import { ProductTypeKey } from '../product-type/product-type-key'

import { MultiLangStringMockFactory } from './logic/models/multilang-string'
import { ProductGroupChangesCounter } from './product-group-changes-counter'

const getDefaultSetupFields = (): Attribute[] => {
  return [
    {
      name: 'requiresBlender',
      value: false,
    },
    {
      name: 'canAddExtraShot',
      value: false,
    },
    {
      name: 'canAddSyrup',
      value: false,
    },
    {
      name: 'canAddWhippedCream',
      value: false,
    },
    {
      name: 'canBeDecaf',
      value: false,
    },
    {
      name: 'milkCanBeOat',
      value: false,
    },
    {
      name: 'milkCanBeRiceCoconut',
      value: false,
    },
    {
      name: 'milkCanBeSemiSkimmed',
      value: false,
    },
    {
      name: 'milkCanBeSkimmed',
      value: false,
    },
    {
      name: 'milkCanBeSoya',
      value: false,
    },
    {
      name: 'canBeBlack',
      value: false,
    },
    {
      name: 'canHaveVariants',
      value: false,
    },
    {
      name: 'requiresIceMachine',
      value: false,
    },
  ]
}

const getEditedSetupFields = (): Attribute[] => {
  return [
    {
      name: 'requiresBlender',
      value: true,
    },
    {
      name: 'canAddExtraShot',
      value: true,
    },
    {
      name: 'canAddSyrup',
      value: true,
    },
    {
      name: 'canAddWhippedCream',
      value: false,
    },
    {
      name: 'canBeDecaf',
      value: false,
    },
    {
      name: 'milkCanBeOat',
      value: false,
    },
    {
      name: 'milkCanBeRiceCoconut',
      value: false,
    },
    {
      name: 'milkCanBeSemiSkimmed',
      value: false,
    },
    {
      name: 'milkCanBeSkimmed',
      value: false,
    },
    {
      name: 'milkCanBeSoya',
      value: false,
    },
    {
      name: 'canBeBlack',
      value: false,
    },
    {
      name: 'canHaveVariants',
      value: false,
    },
    {
      name: 'requiresIceMachine',
      value: false,
    },
  ]
}

const masterSku = 'UK10000'

const getMockProduct = () => {
  return {
    version: 1,
    productType: {
      obj: {
        key: ProductTypeKey.BaristaBeverage,
      },
    },
    key: masterSku,
    masterData: {
      current: {
        masterVariant: {
          sku: masterSku,
          attributes: getDefaultSetupFields(),
          key: masterSku,
        },
        categories: [],
      },
      staged: {
        masterVariant: {
          sku: masterSku,
          attributes: getEditedSetupFields(),
          key: masterSku,
        },
        categories: [],
      },
    },
  } as any
}

describe('ProductGroupChangesCounter', () => {
  describe('Set-up changes', () => {
    it('Counts set-up changes', () => {
      const product = getMockProduct()

      const counter = new ProductGroupChangesCounter(
        product.masterData.current,
        product.masterData.staged,
      )

      expect(counter.compareSetUp()).toBe(3)
    })
  })

  describe('Categories changes', () => {
    it('Counts categories changes - the same, empty', () => {
      const product = getMockProduct()

      const counter = new ProductGroupChangesCounter(
        product.masterData.current,
        product.masterData.staged,
      )

      expect(counter.compareCategories()).toBe(0)
    })

    it('Counts categories changes - the same - one list', () => {
      const product = getMockProduct()

      product.masterData.current.categories = [
        { typeId: 'category', id: 'b47c6a6b-60a5-4a9b-94f7-432b32a532da' },
      ]
      product.masterData.staged.categories = [
        { typeId: 'category', id: 'b47c6a6b-60a5-4a9b-94f7-432b32a532da' },
      ]

      const counter = new ProductGroupChangesCounter(
        product.masterData.current,
        product.masterData.staged,
      )

      expect(counter.compareCategories()).toBe(0)
    })

    it('Counts categories changes - extra on in draft', () => {
      const product = getMockProduct()

      product.masterData.staged.categories = [
        { typeId: 'category', id: 'b47c6a6b-60a5-4a9b-94f7-432b32a532da' },
      ]

      const counter = new ProductGroupChangesCounter(
        product.masterData.current,
        product.masterData.staged,
      )

      expect(counter.compareCategories()).toBe(1)
    })

    it('Counts categories changes - extra 2 in draft', () => {
      const product = getMockProduct()

      product.masterData.staged.categories = [
        { typeId: 'category', id: 'b47c6a6b-60a5-4a9b-94f7-432b32a532da' },
        { typeId: 'category', id: '830ca573-9c71-423d-bf7b-c4d97ac2c0c4' },
      ]

      const counter = new ProductGroupChangesCounter(
        product.masterData.current,
        product.masterData.staged,
      )

      expect(counter.compareCategories()).toBe(2)
    })

    it('Counts categories changes - extra 1 in published', () => {
      const product = getMockProduct()

      product.masterData.current.categories = [
        { typeId: 'category', id: 'b47c6a6b-60a5-4a9b-94f7-432b32a532da' },
      ]

      const counter = new ProductGroupChangesCounter(
        product.masterData.current,
        product.masterData.staged,
      )

      expect(counter.compareCategories()).toBe(1)
    })

    /**
     * This is some specific business case.
     * Take category [1, 2, 3] which we change to [1, 2, 3, 4].
     * We are not exactly sure if it was edited.
     * So what happens is [1, 2, 3] was removed = 1st diff
     * And [1, 2, 3, 4] ias added = 2nd diff
     */
    it('Counts categories changes - one different in draft shows 2 diffs', () => {
      const product = getMockProduct()

      product.masterData.current.categories = [
        { typeId: 'category', id: 'b47c6a6b-60a5-4a9b-94f7-432b32a532da' },
      ]
      product.masterData.staged.categories = [
        { typeId: 'category', id: '830ca573-9c71-423d-bf7b-c4d97ac2c0c4' },
      ]

      const counter = new ProductGroupChangesCounter(
        product.masterData.current,
        product.masterData.staged,
      )

      expect(counter.compareCategories()).toBe(2)
    })
  })

  describe('All product changes', () => {
    it('Counts changes in set-up and categories', () => {
      const product = getMockProduct()

      product.masterData.current.categories = [
        { typeId: 'category', id: 'b47c6a6b-60a5-4a9b-94f7-432b32a532da' },
      ]

      const counter = new ProductGroupChangesCounter(
        product.masterData.current,
        product.masterData.staged,
      )

      expect(counter.countChanges()).toBe(4)
    })
  })
})
