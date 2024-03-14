import { Test } from '@nestjs/testing'

import { CountryCode } from '../../../../shared/model/country-code'
import { ProductImageService } from '../../../content-management/services/product-image.service'
import { versionMock } from '../../mocks/variant-version'
import { productMock, productWithVersionMock } from '../../mocks/product'

import { GetNewProductsDao } from './get-new-products.dao'
import { GetNewProductsService } from './get-new-products.service'

describe('GetNewProductsService', () => {
  let getNewProductsService: GetNewProductsService
  let getNewProductsDao: GetNewProductsDao

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GetNewProductsService],
    })
      .useMocker((token) => {
        if (token === ProductImageService) {
          return {
            getImagesForGivenSkus: async () => Promise.resolve([]),
          }
        }

        if (token === GetNewProductsDao) {
          return {
            getNewProducts: async () => Promise.resolve([productMock]),
            getNewVersions: async () => Promise.resolve([]),
            getProductsContainingNewVersions: async () => Promise.resolve([]),
          }
        }
      })
      .compile()

    getNewProductsService = moduleRef.get<GetNewProductsService>(GetNewProductsService)
    getNewProductsDao = moduleRef.get<GetNewProductsDao>(GetNewProductsDao)
  })

  it('returns CT products mapped to new products DTO', async () => {
    const results = await getNewProductsService.getNewProducts(CountryCode.UK)

    expect(results).toMatchInlineSnapshot(`
      Object {
        "productGroups": Array [
          Object {
            "countryCode": "UK",
            "imageUrl": undefined,
            "name": MultilangString {
              "en-GB": "Test name",
              "en-HK": "",
              "en-US": "",
              "fr-FR": "",
              "zh-HK": "",
            },
            "sku": "UK10001",
            "variants": Array [
              Object {
                "countryCode": "UK",
                "createdAt": undefined,
                "imageUrl": undefined,
                "isMaster": true,
                "masterSku": "UK10001",
                "name": MultilangString {
                  "en-GB": "Test name",
                  "en-HK": "",
                  "en-US": "",
                  "fr-FR": "",
                  "zh-HK": "",
                },
                "recipeID": null,
                "sku": "UK10001",
                "versions": Array [],
              },
            ],
          },
        ],
      }
    `)
  })

  it('properly connects new version to its parent product', async () => {
    jest
      .spyOn(getNewProductsDao, 'getProductsContainingNewVersions')
      .mockResolvedValue([productWithVersionMock])
    jest.spyOn(getNewProductsDao, 'getNewVersions').mockResolvedValue([versionMock])
    const results = await getNewProductsService.getNewProducts(CountryCode.UK)

    expect(results).toMatchInlineSnapshot(`
      Object {
        "productGroups": Array [
          Object {
            "countryCode": "UK",
            "imageUrl": undefined,
            "name": MultilangString {
              "en-GB": "Test name",
              "en-HK": "",
              "en-US": "",
              "fr-FR": "",
              "zh-HK": "",
            },
            "sku": "UK10001",
            "variants": Array [
              Object {
                "countryCode": "UK",
                "createdAt": undefined,
                "imageUrl": undefined,
                "isMaster": true,
                "masterSku": "UK10001",
                "name": MultilangString {
                  "en-GB": "Test name",
                  "en-HK": "",
                  "en-US": "",
                  "fr-FR": "",
                  "zh-HK": "",
                },
                "recipeID": null,
                "sku": "UK10001",
                "versions": Array [],
              },
            ],
          },
          Object {
            "countryCode": "UK",
            "imageUrl": undefined,
            "name": MultilangString {
              "en-GB": "Test name",
              "en-HK": "",
              "en-US": "",
              "fr-FR": "",
              "zh-HK": "",
            },
            "sku": "UK10002",
            "variants": Array [
              Object {
                "countryCode": "UK",
                "createdAt": undefined,
                "imageUrl": undefined,
                "isMaster": true,
                "masterSku": "UK10002",
                "name": MultilangString {
                  "en-GB": "Test name",
                  "en-HK": "",
                  "en-US": "",
                  "fr-FR": "",
                  "zh-HK": "",
                },
                "recipeID": null,
                "sku": "UK10002",
                "versions": Array [
                  Object {
                    "countryCode": "UK",
                    "createdAt": undefined,
                    "imageUrl": undefined,
                    "isMaster": true,
                    "name": Object {
                      "en-GB": "name-en-GB",
                      "en-HK": "name-en-HK",
                      "en-US": "name-en-US",
                      "fr-FR": "name-fr-FR",
                      "zh-HK": "name-zh-HK",
                    },
                    "recipeID": "FP1234",
                    "sku": "UK10002",
                    "versionNumber": 1,
                  },
                ],
              },
            ],
          },
        ],
      }
    `)
  })
})
