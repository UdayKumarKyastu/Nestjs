import { ProductVariant } from '@commercetools/platform-sdk'

import { MultiLangStringMockFactory } from '../../product/logic/models/multilang-string'
import { VariantVersionPreviewDto } from '../dto/variant-version-preview.dto'
import { variantAttributesMock } from '../../product-variant/mocks/variant-attributes.mock'
import { variantPricesMock } from '../../product-variant/mocks/variant-prices.mock'

import { VariantVersion } from './variant-version'
import { VariantVersionPublishState } from './variant-version-publish-state'
import { VersionCustomObjectPayload } from './version-custom-object'

const getMockCustomObject = (): VersionCustomObjectPayload => {
  return {
    approved: {
      name: MultiLangStringMockFactory.createMultiLangString('name appr'),
      description: MultiLangStringMockFactory.createMultiLangString('name appr'),
    },
    hg: {
      productCountry: 'UK',
      productId: {
        version: '1',
        code: 'FP123',
      },
      hgCode: 'FP123',
      version: 1,
      liveFrom: '2020-08-01',
      ingredients: MultiLangStringMockFactory.createMultiLangString('ingredients'),
      averageWeight: 123,
      lastUpdatedFromHG: '2020-07-01T10:00:00Z',
      name: 'TEST',
      suitableForVegans: true,
      nutritionals: [],
      localizedContainsAllergens: [],
      localizedClaims: [],
      country: 'UK',
      suitableForVegetarians: true,
      constituentItems: [],
      hgRecipeStatus: 'Approved',
      recipeType: [],
    },
    key: 'FP123-1',
    draft: {
      name: MultiLangStringMockFactory.createMultiLangString('name appr'),
      description: MultiLangStringMockFactory.createMultiLangString('name appr'),
    },
  }
}

// todo write test for each model
describe('VariantVersion', () => {
  it('Constructs from plain data', () => {
    const result = VariantVersion.fromRawCtObject(
      'e15a85f7-8fa3-4d26-ad94-bc4899fa9ff3',
      'UK12345',
      getMockCustomObject(),
    )

    expect(result).toMatchInlineSnapshot(`
      VariantVersion {
        "allergens": Array [],
        "approved": Object {
          "availability": undefined,
          "baristaAttributes": undefined,
          "description": MultilangString {
            "en-GB": "name appr-en-GB",
            "en-HK": "name appr-en-HK",
            "en-US": "name appr-en-US",
            "fr-FR": "name appr-fr-FR",
            "zh-HK": "name appr-zh-HK",
          },
          "howToDisplay": undefined,
          "labelling": undefined,
          "name": MultilangString {
            "en-GB": "name appr-en-GB",
            "en-HK": "name appr-en-HK",
            "en-US": "name appr-en-US",
            "fr-FR": "name appr-fr-FR",
            "zh-HK": "name appr-zh-HK",
          },
          "pricing": undefined,
          "reporting": undefined,
        },
        "constituentHGCodes": Array [],
        "draft": Object {
          "availability": undefined,
          "baristaAttributes": undefined,
          "description": MultilangString {
            "en-GB": "name appr-en-GB",
            "en-HK": "name appr-en-HK",
            "en-US": "name appr-en-US",
            "fr-FR": "name appr-fr-FR",
            "zh-HK": "name appr-zh-HK",
          },
          "howToDisplay": undefined,
          "labelling": undefined,
          "name": MultilangString {
            "en-GB": "name appr-en-GB",
            "en-HK": "name appr-en-HK",
            "en-US": "name appr-en-US",
            "fr-FR": "name appr-fr-FR",
            "zh-HK": "name appr-zh-HK",
          },
          "pricing": undefined,
          "reporting": undefined,
        },
        "hgCode": Object {
          "value": "FP123",
        },
        "hgName": "TEST",
        "hgRecipeStatus": Object {
          "value": "Approved",
        },
        "id": "e15a85f7-8fa3-4d26-ad94-bc4899fa9ff3",
        "ingredients": MultilangString {
          "en-GB": "ingredients-en-GB",
          "en-HK": "ingredients-en-HK",
          "en-US": "ingredients-en-US",
          "fr-FR": "ingredients-fr-FR",
          "zh-HK": "ingredients-zh-HK",
        },
        "key": "FP123-1",
        "lastUpdatedFromHG": Object {
          "value": "2020-07-01T10:00:00.000Z",
        },
        "liveFrom": "2020-08-01",
        "liveTo": null,
        "nutritionals": Array [],
        "recipeTypes": Array [],
        "size": 123,
        "sku": "UK12345",
        "vegan": true,
        "vegetarian": true,
        "version": 1,
      }
    `)
  })

  it('Can transform to VariantVersionPreviewDto', () => {
    const result = VariantVersion.fromRawCtObject(
      'e15a85f7-8fa3-4d26-ad94-bc4899fa9ff3',
      'UK12345',
      getMockCustomObject(),
    )

    const dto = result.toPreviewDto(VariantVersionPublishState.Current)

    expect(VariantVersionPreviewDto.validate(dto)).resolves.toBeUndefined()
  })

  it('Maps version object to CT variant attributes', () => {
    const customObjectMock = getMockCustomObject()

    const relatedVariant: ProductVariant = {
      id: 1,
      sku: 'UK123',
      attributes: [...variantAttributesMock],
      prices: [...variantPricesMock],
    }

    const result = VariantVersion.getVariantCtFieldsFromVersionObject(
      customObjectMock,
      customObjectMock.approved as VariantVersion['approved'],
      relatedVariant,
    )

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "ingredients",
          "value": MultilangString {
            "en-GB": "ingredients-en-GB",
            "en-HK": "ingredients-en-HK",
            "en-US": "ingredients-en-US",
            "fr-FR": "ingredients-fr-FR",
            "zh-HK": "ingredients-zh-HK",
          },
        },
        Object {
          "name": "description",
          "value": MultilangString {
            "en-GB": "name appr-en-GB",
            "en-HK": "name appr-en-HK",
            "en-US": "name appr-en-US",
            "fr-FR": "name appr-fr-FR",
            "zh-HK": "name appr-zh-HK",
          },
        },
        Object {
          "name": "suitableForVegetarians",
          "value": true,
        },
        Object {
          "name": "suitableForVegans",
          "value": true,
        },
        Object {
          "name": "country",
          "value": Object {
            "key": "UK",
            "label": "UK",
          },
        },
        Object {
          "name": "productVariantVersions",
          "value": Array [],
        },
        Object {
          "name": "hgCode",
          "value": "FP123",
        },
        Object {
          "name": "liveFrom",
          "value": "2020-08-01",
        },
        Object {
          "name": "howToDisplay",
          "value": Array [],
        },
        Object {
          "name": "version",
          "value": 1,
        },
        Object {
          "name": "lastUpdatedFromHG",
          "value": "2020-07-01T10:00:00Z",
        },
        Object {
          "name": "averageWeight",
          "value": null,
        },
        Object {
          "name": "nutritionals",
          "value": Array [],
        },
        Object {
          "name": "localizedContainsAllergens",
          "value": Array [],
        },
        Object {
          "name": "pluReportingName",
          "value": undefined,
        },
        Object {
          "name": "pluPrimaryCategory",
          "value": Object {
            "key": undefined,
          },
        },
        Object {
          "name": "pluSecondaryCategory",
          "value": Object {
            "key": undefined,
          },
        },
        Object {
          "name": "productCategory",
          "value": Object {
            "key": undefined,
          },
        },
        Object {
          "name": "productSubCategory",
          "value": Object {
            "key": undefined,
          },
        },
        Object {
          "name": "productRange",
          "value": undefined,
        },
        Object {
          "name": "parentProductSku",
          "value": undefined,
        },
        Object {
          "name": "storageConditions",
          "value": Object {
            "key": "",
          },
        },
        Object {
          "name": "includeAverageWeightOnLabel",
          "value": true,
        },
        Object {
          "name": "countryOfOriginDescription",
          "value": undefined,
        },
        Object {
          "name": "ean13Code",
          "value": undefined,
        },
        Object {
          "name": "useBy",
          "value": Object {
            "key": "",
          },
        },
        Object {
          "name": "sellBy",
          "value": Object {
            "key": "",
          },
        },
        Object {
          "name": "canBeCookedInTurboChef",
          "value": false,
        },
        Object {
          "name": "useByTurboChef",
          "value": Object {
            "key": "",
          },
        },
        Object {
          "name": "sellByTurboChef",
          "value": Object {
            "key": "",
          },
        },
        Object {
          "name": "productServes",
          "value": Object {
            "key": "",
          },
        },
        Object {
          "name": "includeNutritionalInformationOnLabel",
          "value": true,
        },
        Object {
          "name": "legalTitle",
          "value": undefined,
        },
        Object {
          "name": "displayAsNew",
          "value": false,
        },
        Object {
          "name": "pretDeliversAvailableForLunch",
          "value": false,
        },
        Object {
          "name": "pretDeliversAvailableAllDay",
          "value": false,
        },
        Object {
          "name": "availableForPretDelivers",
          "value": false,
        },
        Object {
          "name": "availableForCollection",
          "value": false,
        },
        Object {
          "name": "availableForOutposts",
          "value": false,
        },
        Object {
          "name": "chefSpecial",
          "value": false,
        },
        Object {
          "name": "visible",
          "value": false,
        },
        Object {
          "name": "visibleOnDeliveryWebsite",
          "value": false,
        },
        Object {
          "name": "newUntil",
          "value": undefined,
        },
        Object {
          "name": "hgRecipeStatus",
          "value": "Approved",
        },
      ]
    `)
  })

  it.todo('Maps draft availability fields from object to class')
  it.todo('Maps draft reporting fields from object to class')
  it.todo('Maps draft name and description fields from object to class')

  it.todo('Maps approved availability fields from object to class')
  it.todo('Maps approved reporting fields from object to class')
  it.todo('Maps approved name and description fields from object to class')
})
