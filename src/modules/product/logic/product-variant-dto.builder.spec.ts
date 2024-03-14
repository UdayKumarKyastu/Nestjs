import { mapPricesToChannelPriceDto } from '../../../modules/ct-utils/get-channel-price'
import { LiveSchedule } from '../../../shared/model/live-schedule'
import { PosIdAttribute } from '../../product-attributes/common-variant-attributes/pos-id-attribute'
import { AverageWeightAttribute } from '../../product-attributes/common-variant-attributes/average-weight-attribute'
import { VariantAvailability } from '../../../shared/model/variant-availability'
import { CountryCode } from '../../../shared/model/country-code'
import { ParentProductSkuAttribute } from '../../product-attributes/common-variant-attributes/parent-product-sku-attribute'
import { VisibleAttribute } from '../../product-attributes/common-variant-attributes/visible-attribute'
import { HgCodeAttribute } from '../../product-attributes/common-variant-attributes/hg-code-attribute'
import { LastUpdatedFromHgAttribute } from '../../product-attributes/common-variant-attributes/last-updated-from-hg-attribute'
import { VersionAttribute } from '../../product-attributes/common-variant-attributes/version-attribute'
import { HgRecipeStatusAttribute } from '../../product-attributes/food-variant-attributes/hg-recipe-status'
import { ProductRangeAttribute } from '../../product-attributes/common-variant-attributes/product-range-attribute'

import { ProductVariantDtoBuilder } from './product-variant-dto.builder'
import { MultiLangStringMockFactory } from './models/multilang-string'

describe('ProductVariantDtoBuilder', () => {
  const getBaseBuilder = () => {
    return new ProductVariantDtoBuilder()
      .withLiveSchedule(
        new LiveSchedule({
          off: null,
          on: '2020-01-01T10:00:00',
        }),
      )
      .withSku('UK12345')
      .withSize(new AverageWeightAttribute(100))
      .withImage(null)
      .withName(MultiLangStringMockFactory.createMultiLangString('Name'))
      .withHamiltonGrant({
        productCode: new HgCodeAttribute('FP123123'),
        hgSyncDate: new LastUpdatedFromHgAttribute(new Date(2020, 1, 1, 12, 0, 0)),
        constituentHGCodes: [],
        hgRecipeStatus: new HgRecipeStatusAttribute('Approved'),
        recipeTypes: null,
      })
      .withNutrition({
        isVegan: false,
        allergens: [
          {
            key: 'a1',
            label: {
              en: 'a1',
            },
          },
        ],
        ingredients: {
          en: 'Ingr',
        },
        isVegetarian: false,
        nutritionals: [
          {
            perServing: 1,
            per100g: 1,
            localizedLabel: MultiLangStringMockFactory.createMultiLangString('Protein'),
            item: 'protein',
          },
        ],
      })
      .withReporting({
        starKisProductCategoryID: null,
        pluSecondaryCategoryID: null,
        pluPrimaryCategoryID: null,
        posID: new PosIdAttribute('123'),
        pluReportingName: null,
        starKisProductSubCategoryID: null,
        parentProductSku: null,
        productRange: new ProductRangeAttribute([]),
      })
      .withStatus(new VisibleAttribute(true))
      .withHowToDisplay(['htd1'])
      .asMasterVariant(true)
      .withDescription({
        standard: MultiLangStringMockFactory.createMultiLangString('desc'),
      })
      .withAvailability(
        new VariantAvailability({
          availableAllDay: true,
          availableForLunch: false,
          displayAsNew: {
            isDisplayed: true,
            until: '2020-01-01',
          },
          availableForOutposts: true,
          visibleOnDeliveryWebsite: false,
          isLive: true,
          isChefsSpecial: true,
          availableForPretDelivers: false,
          availableForClickAndCollect: true,
        }),
      )
      .withPrices(
        mapPricesToChannelPriceDto(
          [
            {
              value: {
                type: 'centPrecision',
                currencyCode: 'GBP',
                centAmount: 189,
                fractionDigits: 2,
              },
              id: '8ee0a33e-0b6b-4d0a-9e9b-477f76897035',
              channel: {
                id: '',
                typeId: '' as any,
                obj: {
                  id: '7880620c-36ef-4613-bac5-3bbe501ec029',
                  version: 1,
                  createdAt: '',
                  lastModifiedAt: '',
                  key: 'uk_london',
                  roles: ['ProductDistribution'],
                  name: {
                    en: 'UK London',
                  },
                },
              },
            },
          ],
          [],
          CountryCode.UK,
        ),
      )
      .withVersionsPreview([])
      .withParentProductSku(new ParentProductSkuAttribute('parent-sku'))
      .withLabelling({
        storageConditions: 'Enjoy on day of purchase',
        includeAverageWeightOnLabel: true,
        countryOfOriginDescription: 'Test 2 for Lukasz',
        ean13Code: 'Test 3 for lukasz',
        useBy: '1',
        sellBy: '1',
        productServes: '1',
        legalTitle: 'Some legal title',
        howToCard: {
          qrSvg: '',
          fileName: '',
          qrPng: '',
        },
        includeNutritionalInformationOnLabel: true,
        useByTurboChef: '2',
        sellByTurboChef: '2',
        canBeCookedInTurboChef: true,
      })
      .withVersion(new VersionAttribute(1))
  }

  it('Build when all methods and data provided', () => {
    const variant = getBaseBuilder()
      .withBaristaBeverageAttributes({
        withRiceCoconutMilk: true,
        withSoyMilk: false,
        withOatMilk: true,
        withSkimmedMilk: false,
        withSemiSkimmedMilk: true,
        withoutMilk: false,
        withDecafPods: true,
      })
      .build()

    expect(new Date(variant.hamiltonGrant.lastSyncedAt!)).toBeInstanceOf(Date)

    // @ts-expect-error - for test remove it because its a lot of work to make it work with snapshot, the assertion is above
    delete variant.hamiltonGrant.lastSyncedAt

    expect(variant).toMatchInlineSnapshot(`
      Object {
        "attributes": Object {
          "withDecafPods": true,
          "withOatMilk": true,
          "withRiceCoconutMilk": true,
          "withSemiSkimmedMilk": true,
          "withSkimmedMilk": false,
          "withSoyMilk": false,
          "withoutMilk": false,
        },
        "availability": Object {
          "availableAllDay": true,
          "availableForClickAndCollect": true,
          "availableForLunch": false,
          "availableForOutposts": true,
          "availableForPretDelivers": false,
          "displayAsNew": Object {
            "isDisplayed": true,
            "until": "2020-01-01",
          },
          "isChefsSpecial": true,
          "isLive": true,
          "liveSchedule": LiveSchedule {
            "off": null,
            "on": "2020-01-01T10:00:00",
          },
          "visibleOnDeliveryWebsite": false,
        },
        "description": Object {
          "standard": Object {
            "en-GB": "desc-en-GB",
            "en-HK": "desc-en-HK",
            "en-US": "desc-en-US",
            "fr-FR": "desc-fr-FR",
            "zh-HK": "desc-zh-HK",
          },
        },
        "hamiltonGrant": Object {
          "allergens": Array [
            Object {
              "label": Object {
                "en-GB": "",
                "en-HK": "",
                "en-US": "",
                "fr-FR": "",
                "zh-HK": "",
              },
              "name": "a1",
            },
          ],
          "constituentHGCodes": Array [],
          "cuisine": Object {
            "isVegan": false,
            "isVegetarian": false,
          },
          "hgRecipeStatus": "Approved",
          "ingredients": Object {
            "en-GB": "",
            "en-HK": "",
            "en-US": "",
            "fr-FR": "",
            "zh-HK": "",
          },
          "nutrition": Array [
            Object {
              "localisedLabel": Object {
                "en-GB": "Protein-en-GB",
                "en-HK": "Protein-en-HK",
                "en-US": "Protein-en-US",
                "fr-FR": "Protein-fr-FR",
                "zh-HK": "Protein-zh-HK",
              },
              "name": "protein",
              "per100g": 1,
              "perServing": 1,
            },
          ],
          "productCode": "FP123123",
          "recipeTypes": null,
        },
        "howToDisplay": Array [
          "htd1",
        ],
        "image": null,
        "isMaster": true,
        "labelling": Object {
          "canBeCookedInTurboChef": true,
          "countryOfOriginDescription": "Test 2 for Lukasz",
          "ean13Code": "Test 3 for lukasz",
          "howToCard": Object {
            "fileName": "",
            "qrPng": "",
            "qrSvg": "",
          },
          "includeAverageWeightOnLabel": true,
          "includeNutritionalInformationOnLabel": true,
          "legalTitle": "Some legal title",
          "productServes": "1",
          "sellBy": "1",
          "sellByTurboChef": "2",
          "storageConditions": "Enjoy on day of purchase",
          "useBy": "1",
          "useByTurboChef": "2",
        },
        "name": Object {
          "en-GB": "Name-en-GB",
          "en-HK": "Name-en-HK",
          "en-US": "Name-en-US",
          "fr-FR": "Name-fr-FR",
          "zh-HK": "Name-zh-HK",
        },
        "parentProductSku": "parent-sku",
        "pluPrimaryCategoryID": null,
        "pluReportingName": null,
        "pluSecondaryCategoryID": null,
        "posID": "123",
        "prices": Array [],
        "productRange": Array [],
        "size": "100",
        "sku": "UK12345",
        "starKisProductCategoryID": null,
        "starKisProductSubCategoryID": null,
        "status": "ACTIVE",
        "version": 1,
        "versions": Array [],
      }
    `)
  })

  it('Can build product without barista attributes', () => {
    const variant = getBaseBuilder().build()

    expect(variant).toBeDefined()
    expect(variant.attributes).toBeDefined()
  })
})
