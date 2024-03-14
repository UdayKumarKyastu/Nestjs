import { BaristaProductVariant, FoodProductVariant } from '../product-variant/product-variant'
import { Sku } from '../../shared/model/sku'
import { MultilangString } from '../product/logic/models/multilang-string'
import { PluReportingNameAttribute } from '../product-attributes/common-variant-attributes/plu-reporting-name-attribute'
import { PluPrimaryCategoryAttribute } from '../product-attributes/common-variant-attributes/plu-primary-category-attribute'
import { PluSecondaryCategoryAttribute } from '../product-attributes/common-variant-attributes/plu-secondary-category-attribute'
import { CountryOfOriginDescriptionAttribute } from '../product-attributes/common-variant-attributes/country-of-origin-description-attribute'
import { UseByAttribute } from '../product-attributes/common-variant-attributes/use-by-attribute'
import { SellByAttribute } from '../product-attributes/common-variant-attributes/sell-by-attribute'
import { LegalTitleAttribute } from '../product-attributes/food-variant-attributes/legal-title-attribute'
import { IncludeAverageWeightOnLabelAttribute } from '../product-attributes/food-variant-attributes/include-average-weight-on-label-attribute'
import { IsDecafPodAttribute } from '../product-attributes/barista-variant-attributes/is-decaf-pod-attribute'
import { IsBlackAttribute } from '../product-attributes/barista-variant-attributes/is-black-attribute'
import { MilkIsSemiSkimmedAttribute } from '../product-attributes/barista-variant-attributes/milk-is-semi-skimmed-attribute'
import { MilkIsSkimmedAttribute } from '../product-attributes/barista-variant-attributes/milk-is-skimmed-attribute'
import { MilkIsOatAttribute } from '../product-attributes/barista-variant-attributes/milk-is-oat-attribute'
import { MilkIsRiceCoconutAttribute } from '../product-attributes/barista-variant-attributes/milk-is-rice-coconut-attribute'
import { MilkIsSoyaAttribute } from '../product-attributes/barista-variant-attributes/milk-is-soya-attribute'
import { AvailableForCollectionAttribute } from '../product-attributes/common-variant-attributes/available-for-collection-attribute'
import { AvailableForOutpostsAttribute } from '../product-attributes/common-variant-attributes/available-for-outposts-attribute'
import { AvailableForPretDeliversAttribute } from '../product-attributes/common-variant-attributes/available-for-pret-delivers-attribute'
import { VisibleOnDeliveryWebsiteAttribute } from '../product-attributes/common-variant-attributes/visible-on-delivery-website-attribute'
import { PretDeliversAvailableForLunchAttribute } from '../product-attributes/common-variant-attributes/pret-delivers-available-for-lunch-attribute'
import { PretDeliversAvailableAllDayAttribute } from '../product-attributes/common-variant-attributes/pret-delivers-available-all-day-attribute'
import { NewUntilAttribute } from '../product-attributes/common-variant-attributes/new-until-attribute'
import { VisibleAttribute } from '../product-attributes/common-variant-attributes/visible-attribute'
import { DisplayAsNewAttribute } from '../product-attributes/common-variant-attributes/display-as-new-attribute'
import { ChefSpecialAttribute } from '../product-attributes/common-variant-attributes/chef-special-attribute'
import { HowToDisplayAttribute } from '../product-attributes/common-variant-attributes/how-to-display-attribute'

import { ProductVariantChangesCounter } from './product-variant-changes-counter'
import { variantAttributesMock } from './mocks/variant-attributes.mock'
import { variantPricesMock } from './mocks/variant-prices.mock'

describe('ProductVariantChangesCounter', () => {
  let variant: BaristaProductVariant
  let draftVariant: BaristaProductVariant

  beforeEach(() => {
    variant = BaristaProductVariant.create({
      sku: new Sku('UK123'),
      name: new MultilangString({ 'en-GB': 'Test name' }),
      prices: [...variantPricesMock],
      description: new MultilangString({ 'en-GB': 'Test description' }),
      ctAttributes: [...variantAttributesMock],
    })

    draftVariant = BaristaProductVariant.create({
      sku: new Sku('UK123'),
      name: new MultilangString({ 'en-GB': 'Test name' }),
      prices: [...variantPricesMock],
      description: new MultilangString({ 'en-GB': 'Test description' }),
      ctAttributes: [...variantAttributesMock],
    })
  })

  describe('Variant name changes', () => {
    it('counts 0 if variant and draft name are the same', () => {
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      expect(counter.countName()).toBe(0)
    })

    it('counts 1 if GB name is changed', () => {
      draftVariant.name['en-GB'] = `${variant.name['en-GB']} draft`
      const counter = new ProductVariantChangesCounter(variant, draftVariant)
      expect(counter.countName()).toBe(1)
    })

    it('counts 2 if variant GB and FR name is changed', () => {
      draftVariant.name['en-GB'] = `${variant.name['en-GB']} draft`
      draftVariant.name['fr-FR'] = `${variant.name['fr-FR']} draft`
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      expect(counter.countName()).toBe(2)
    })
  })

  describe('Variant description changes', () => {
    it('counts 0 if variant and draft description are the same', () => {
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      expect(counter.countDescription()).toBe(0)
    })

    it('counts 1 if GB description is changed', () => {
      draftVariant.description['en-GB'] = `${variant.description['en-GB']} draft`
      const counter = new ProductVariantChangesCounter(variant, draftVariant)
      expect(counter.countDescription()).toBe(1)
    })

    it('counts 2 if variant GB and FR description is changed', () => {
      draftVariant.description['en-GB'] = `${variant.description['en-GB']} draft`
      draftVariant.description['fr-FR'] = `${variant.description['fr-FR']} draft`
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      expect(counter.countDescription()).toBe(2)
    })
  })

  describe('Variant availability changes', () => {
    it('counts availability attributes', () => {
      draftVariant.commonAttributes.availableForCollection = new AvailableForCollectionAttribute(
        !variant.commonAttributes.availableForCollection?.value,
      )
      draftVariant.commonAttributes.availableForPretDelivers =
        new AvailableForPretDeliversAttribute(
          !variant.commonAttributes.availableForPretDelivers?.value,
        )
      draftVariant.commonAttributes.availableForOutposts = new AvailableForOutpostsAttribute(
        !variant.commonAttributes.availableForCollection?.value,
      )
      const counter = new ProductVariantChangesCounter(variant, draftVariant)
      expect(counter.countAvailability()).toBe(3)
    })

    it('counts visibility attributes', () => {
      draftVariant.commonAttributes.visibleOnDeliveryWebsite =
        new VisibleOnDeliveryWebsiteAttribute(
          !variant.commonAttributes.visibleOnDeliveryWebsite?.value,
        )
      draftVariant.commonAttributes.visible = new VisibleAttribute(
        !variant.commonAttributes.visible?.value,
      )
      const counter = new ProductVariantChangesCounter(variant, draftVariant)
      expect(counter.countAvailability()).toBe(2)
    })

    it('counts display attributes', () => {
      draftVariant.commonAttributes.displayAsNew = new DisplayAsNewAttribute(
        !variant.commonAttributes.displayAsNew?.value,
      )
      draftVariant.commonAttributes.chefSpecial = new ChefSpecialAttribute(
        !variant.commonAttributes.chefSpecial?.value,
      )
      draftVariant.commonAttributes.newUntil = new NewUntilAttribute('2021-10-28')

      const counter = new ProductVariantChangesCounter(variant, draftVariant)
      expect(counter.countAvailability()).toBe(3)
    })

    it('counts delivery attributes', () => {
      draftVariant.commonAttributes.availableAllDay = new PretDeliversAvailableAllDayAttribute(
        !variant.commonAttributes.availableAllDay?.value,
      )
      draftVariant.commonAttributes.availableForLunch = new PretDeliversAvailableForLunchAttribute(
        !variant.commonAttributes.availableForLunch?.value,
      )

      const counter = new ProductVariantChangesCounter(variant, draftVariant)
      expect(counter.countAvailability()).toBe(2)
    })

    it('counts howToDisplay attribute', () => {
      draftVariant.commonAttributes.howToDisplay = new HowToDisplayAttribute([
        { key: 'draft', label: 'draft' },
      ])

      const counter = new ProductVariantChangesCounter(variant, draftVariant)
      expect(counter.countHowToDisplay()).toBe(1)
    })
  })

  describe('Variant pricing changes', () => {
    it('counts 0 if there are no changes', () => {
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      expect(counter.countPrices()).toBe(0)
    })

    it('counts 1 if single tax rate in single channel is changed', () => {
      draftVariant.prices[0] = {
        ...variant.prices[0],
        custom: {
          fields: {
            ...(variant.prices[0].custom?.fields || {}),
            eatInTax: 0.26,
          },
          type: {} as any,
        },
      }
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      expect(counter.countPrices()).toBe(1)
    })

    it('counts 2 if tax rates in two channels are changed', () => {
      draftVariant.prices[0] = {
        ...variant.prices[0],
        custom: {
          fields: {
            ...(variant.prices[0].custom?.fields || {}),
            eatInTax: 0.26,
          },
          type: {} as any,
        },
      }

      draftVariant.prices[1] = {
        ...variant.prices[1],
        custom: {
          fields: {
            ...(variant.prices[1].custom?.fields || {}),
            eatInTax: 0.26,
          },
          type: {} as any,
        },
      }
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      expect(counter.countPrices()).toBe(2)
    })

    it('counts 2 if value is changed in two prices', () => {
      draftVariant.prices[0] = {
        ...variant.prices[0],
        value: {
          ...variant.prices[0].value,
          centAmount: 222,
        },
      }

      draftVariant.prices[1] = {
        ...variant.prices[1],
        value: {
          ...variant.prices[1].value,
          centAmount: 222,
        },
      }
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      expect(counter.countPrices()).toBe(2)
    })
  })

  describe('Variant reporting changes', () => {
    it('counts 0 if there are no changes', () => {
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      expect(counter.countReporting()).toBe(0)
    })

    it('counts 1 if one reporting attribute is changed', () => {
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      draftVariant.commonAttributes.pluReportingName = new PluReportingNameAttribute(
        `${variant.commonAttributes.pluReportingName?.value} draft`,
      )

      expect(counter.countReporting()).toBe(1)
    })

    it('counts 3 if three reporting attributes are changed', () => {
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      draftVariant.commonAttributes.pluReportingName = new PluReportingNameAttribute(
        `${variant.commonAttributes.pluReportingName?.value} draft`,
      )
      draftVariant.commonAttributes.pluPrimaryCategoryID = new PluPrimaryCategoryAttribute(
        `${variant.commonAttributes.pluPrimaryCategoryID?.value} draft`,
      )
      draftVariant.commonAttributes.pluSecondaryCategoryID = new PluSecondaryCategoryAttribute(
        `${variant.commonAttributes.pluSecondaryCategoryID?.value} draft`,
      )
      expect(counter.countReporting()).toBe(3)
    })
  })

  describe('Variant attributes changes', () => {
    it('counts 0 if there are no changes', () => {
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      expect(counter.countBaristaAttributes()).toBe(0)
    })

    it('counts 1 if single barista attribute is changed', () => {
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      draftVariant.baristaAttributes.isDecafPod = new IsDecafPodAttribute(
        !variant.baristaAttributes.isDecafPod?.value,
      )

      expect(counter.countBaristaAttributes()).toBe(1)
    })

    it('counts 7 if seven barista attribute are changed', () => {
      const counter = new ProductVariantChangesCounter(variant, draftVariant)

      draftVariant.baristaAttributes.isDecafPod = new IsDecafPodAttribute(
        !variant.baristaAttributes.isDecafPod?.value,
      )

      draftVariant.baristaAttributes.isBlack = new IsBlackAttribute(
        !variant.baristaAttributes.isBlack?.value,
      )

      draftVariant.baristaAttributes.milkIsSemiSkimmed = new MilkIsSemiSkimmedAttribute(
        !variant.baristaAttributes.milkIsSemiSkimmed?.value,
      )

      draftVariant.baristaAttributes.milkIsSkimmed = new MilkIsSkimmedAttribute(
        !variant.baristaAttributes.milkIsSkimmed?.value,
      )

      draftVariant.baristaAttributes.milkIsOat = new MilkIsOatAttribute(
        !variant.baristaAttributes.milkIsOat?.value,
      )

      draftVariant.baristaAttributes.milkIsRiceCoconut = new MilkIsRiceCoconutAttribute(
        !variant.baristaAttributes.milkIsRiceCoconut?.value,
      )

      draftVariant.baristaAttributes.milkIsSoya = new MilkIsSoyaAttribute(
        !variant.baristaAttributes.milkIsSoya?.value,
      )

      expect(counter.countBaristaAttributes()).toBe(7)
    })
  })

  describe('Food product', () => {
    let variant: FoodProductVariant
    let draftVariant: FoodProductVariant

    beforeEach(() => {
      variant = FoodProductVariant.create({
        sku: new Sku('UK123'),
        name: new MultilangString({ 'en-GB': 'Test name' }),
        prices: [...variantPricesMock],
        description: new MultilangString({ 'en-GB': 'Test description' }),
        ctAttributes: variantAttributesMock,
      })

      draftVariant = FoodProductVariant.create({
        sku: new Sku('UK123'),
        name: new MultilangString({ 'en-GB': 'Test name' }),
        prices: [...variantPricesMock],
        description: new MultilangString({ 'en-GB': 'Test description' }),
        ctAttributes: variantAttributesMock,
      })
    })

    describe('Variant labelling changes', () => {
      it('counts 0 if there are no changes', () => {
        const counter = new ProductVariantChangesCounter(variant, draftVariant)

        expect(counter.countLabelling()).toBe(0)
      })

      it('counts 5 if five labelling attributes are changed', () => {
        const counter = new ProductVariantChangesCounter(variant, draftVariant)

        draftVariant.foodAttributes.countryOfOriginDescription =
          new CountryOfOriginDescriptionAttribute(
            `${variant.foodAttributes.countryOfOriginDescription?.value} draft`,
          )

        draftVariant.foodAttributes.useBy = new UseByAttribute(
          `${variant.foodAttributes.useBy?.value} draft`,
        )

        draftVariant.foodAttributes.sellBy = new SellByAttribute(
          `${variant.foodAttributes.useBy?.value} draft`,
        )

        draftVariant.foodAttributes.legalTitle = new LegalTitleAttribute(
          `${variant.foodAttributes.legalTitle?.value} draft`,
        )

        draftVariant.foodAttributes.includeAverageWeightOnLabel =
          new IncludeAverageWeightOnLabelAttribute(
            !variant.foodAttributes.includeAverageWeightOnLabel?.value,
          )
        expect(counter.countLabelling()).toBe(5)
      })

      describe('Variant attributes changes', () => {
        it('throws error for food type variant', () => {
          const counter = new ProductVariantChangesCounter(variant, draftVariant)

          expect(counter.countBaristaAttributes).toThrow()
        })
      })
    })
  })
})
