import { Test } from '@nestjs/testing'

import { CountryCode } from '../../../../shared/model/country-code'
import { ProductImageService } from '../../../content-management/services/product-image.service'
import { versionMock } from '../../mocks/variant-version'
import { productMock, productWithVersionMock } from '../../mocks/product'

import { GetLiveSoonProductsDao } from './get-live-soon-products.dao'
import { GetLiveSoonProductsService } from './get-live-soon-products.service'

describe('GetLiveSoonProductsService', () => {
  let getLiveSoonProductsService: GetLiveSoonProductsService
  let getLiveSoonProductsDao: GetLiveSoonProductsDao

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GetLiveSoonProductsService],
    })
      .useMocker((token) => {
        if (token === ProductImageService) {
          return {
            getImagesForGivenSkus: async () => Promise.resolve([]),
          }
        }

        if (token === GetLiveSoonProductsDao) {
          return {
            getLiveSoonProducts: async () => Promise.resolve([productMock]),
            getLiveSoonVersions: async () => Promise.resolve([]),
            getProductsContainingLiveSoonVersions: async () => Promise.resolve([]),
          }
        }
      })
      .compile()

    getLiveSoonProductsService = moduleRef.get<GetLiveSoonProductsService>(
      GetLiveSoonProductsService,
    )
    getLiveSoonProductsDao = moduleRef.get<GetLiveSoonProductsDao>(GetLiveSoonProductsDao)
  })

  it('returns CT products mapped to live soon products DTO', async () => {
    const results = await getLiveSoonProductsService.getLiveSoonProducts(CountryCode.UK)

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
                "imageUrl": undefined,
                "isMaster": true,
                "liveFrom": null,
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

  it('properly connects live soon version to its parent product', async () => {
    jest
      .spyOn(getLiveSoonProductsDao, 'getProductsContainingLiveSoonVersions')
      .mockResolvedValue([productWithVersionMock])
    jest.spyOn(getLiveSoonProductsDao, 'getLiveSoonVersions').mockResolvedValue([versionMock])
    const results = await getLiveSoonProductsService.getLiveSoonProducts(CountryCode.UK)

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
                "imageUrl": undefined,
                "isMaster": true,
                "liveFrom": null,
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
                "imageUrl": undefined,
                "isMaster": true,
                "liveFrom": null,
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
                    "imageUrl": undefined,
                    "isMaster": true,
                    "liveFrom": "2020-01-01T10:00:00",
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
