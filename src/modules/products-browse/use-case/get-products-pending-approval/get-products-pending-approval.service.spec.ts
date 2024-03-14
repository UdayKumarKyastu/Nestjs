import { Test } from '@nestjs/testing'

import { CountryCode } from '../../../../shared/model/country-code'
import { ProductImageService } from '../../../content-management/services/product-image.service'
import { versionMock } from '../../mocks/variant-version'
import { productMock, productWithVersionMock } from '../../mocks/product'

import { GetProductsWithStagedChangesService } from './get-products-with-staged-changes.service'
import { GetVersionsWithStagedChangesService } from './get-versions-with-staged-changes.service'
import { GetProductsPendingApprovalService } from './get-products-pending-approval.service'

describe('GetProductsPendingApprovalService', () => {
  let getProductsPendingApprovalService: GetProductsPendingApprovalService
  let getVersionsWithStagedChangesService: GetVersionsWithStagedChangesService
  let getProductsWithStagedChangesService: GetProductsWithStagedChangesService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GetProductsPendingApprovalService],
    })
      .useMocker((token) => {
        if (token === ProductImageService) {
          return {
            getImagesForGivenSkus: async () => Promise.resolve([]),
          }
        }

        if (token === GetProductsWithStagedChangesService) {
          return {
            getProducts: async () => Promise.resolve([[productMock], 1]),
            getProductsContainingCustomObjectsWithDraftChanges: async () => Promise.resolve([]),
          }
        }

        if (token === GetVersionsWithStagedChangesService) {
          return {
            getVersions: async () => Promise.resolve(),
            getVersionsWithDraftChanges: async () => Promise.resolve([versionMock]),
          }
        }
      })
      .compile()

    getProductsPendingApprovalService = moduleRef.get<GetProductsPendingApprovalService>(
      GetProductsPendingApprovalService,
    )

    getVersionsWithStagedChangesService = moduleRef.get<GetVersionsWithStagedChangesService>(
      GetVersionsWithStagedChangesService,
    )

    getProductsWithStagedChangesService = moduleRef.get<GetProductsWithStagedChangesService>(
      GetProductsWithStagedChangesService,
    )
  })

  it('returns CT products mapped to pending approval products DTO', async () => {
    const results = await getProductsPendingApprovalService.getProductsPendingApproval({
      country: CountryCode.UK,
    })

    expect(results).toMatchInlineSnapshot(`
      Object {
        "productGroups": Array [
          Object {
            "changesCount": 1,
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
                "changesCount": 1,
                "countryCode": "UK",
                "imageUrl": undefined,
                "isMaster": true,
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

  it('properly connects version with draft changes to its parent product', async () => {
    jest
      .spyOn(getVersionsWithStagedChangesService, 'getVersionsWithDraftChanges')
      .mockResolvedValue([versionMock])

    jest
      .spyOn(
        getProductsWithStagedChangesService,
        'getProductsContainingCustomObjectsWithDraftChanges',
      )
      .mockResolvedValue([productWithVersionMock])

    const results = await getProductsPendingApprovalService.getProductsPendingApproval({
      country: CountryCode.UK,
    })

    expect(results).toMatchInlineSnapshot(`
      Object {
        "productGroups": Array [
          Object {
            "changesCount": 1,
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
                "changesCount": 1,
                "countryCode": "UK",
                "imageUrl": undefined,
                "isMaster": true,
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
            "changesCount": 5,
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
                "changesCount": 0,
                "countryCode": "UK",
                "imageUrl": undefined,
                "isMaster": true,
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
                    "changesCount": 5,
                    "countryCode": "UK",
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
