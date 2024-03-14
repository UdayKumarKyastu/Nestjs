import { Test, TestingModule } from '@nestjs/testing'
import { Product, ProductVariant, Attribute } from '@commercetools/platform-sdk'

import { CommercetoolsCustomObjectDao } from '../../../commercetools/commercetools-custom-object.dao'
import { ProductDraftChangesService } from '../product-draft-changes.service'
import { VariantVersionFetcherService } from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { ProductMapper } from '../../../product/logic/product.mapper'
import { ProductService } from '../product.service'
import { CtProductDao } from '../../../ct-product/ct-product.dao'
import mockDraftProduct from '../mocks/mock-draft-product'
import { ProductTypeKey } from '../../../product-type/product-type-key'
import { MultilangString } from '../../../product/logic/models/multilang-string'
import { BaristaProductVariant } from '../../../product-variant/product-variant'
import { Sku } from '../../../../shared/model/sku'

import { STATUS_TYPES } from './models/status-types'
import { ReviewStatusService } from './review-status.service'

const mockDate = new Date()

const masterSku = 'UK007260'

const mockProduct = {
  version: 1,
  productType: {
    obj: {
      key: ProductTypeKey.BaristaBeverage,
    },
  },
  key: masterSku,
  masterData: {
    current: {
      name: {
        'en-GB': 'Latte',
      },
      masterVariant: {
        sku: masterSku,
        attributes: mockDraftProduct.masterData.current.masterVariant.attributes,
        key: masterSku,
      },
      categories: mockDraftProduct.masterData.current.categories,
      variants: [],
    },
    staged: {
      name: {
        'en-GB': 'Latte',
      },
      masterVariant: {
        sku: masterSku,
        attributes: mockDraftProduct.masterData.staged.masterVariant.attributes,
        key: masterSku,
      },
      categories: mockDraftProduct.masterData.current.categories,
      variants: [],
    },
  },
} as any as Product

const replaceAttributes = (currentAttributes: Attribute[], newAttributes: Attribute[]) => {
  return currentAttributes.map((currentAttribute) => {
    const attributeToReplace = newAttributes.find(({ name }) => name === currentAttribute.name)

    return attributeToReplace || currentAttribute
  })
}

describe('ReviewStatusService', () => {
  let service: ReviewStatusService

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [ReviewStatusService],
    })
      .useMocker((token) => {
        let calls = 0
        if (token === CtProductDao) {
          return {
            async getOneProductBySku(sku: string): Promise<Product | null> {
              calls++
              if (sku === 'UK007260') {
                return mockProduct
              }
              if (sku === 'UK007260-withChanges') {
                return {
                  ...mockProduct,
                  masterData: {
                    ...mockProduct.masterData,
                    staged: {
                      ...mockProduct.masterData.current,
                      name: {
                        'en-GB': 'modified',
                      },
                      categories: [
                        mockDraftProduct.masterData.current.categories[0],
                        mockDraftProduct.masterData.current.categories[1],
                      ],
                      masterVariant: {
                        ...mockProduct.masterData.staged.masterVariant,
                        sku: 'UK007260-withChanges',
                        attributes:
                          calls === 1
                            ? mockProduct.masterData.staged.masterVariant.attributes
                            : replaceAttributes(
                                mockProduct.masterData.staged.masterVariant.attributes!,
                                [
                                  { name: 'pluReportingName', value: 'modified' },
                                  { name: 'legalTitle', value: 'modified' },
                                  { name: 'requiresIceMachine', value: true },
                                  { name: 'description', value: 'modified' },
                                  { name: 'variantName', value: 'modified' },
                                ],
                              ),
                      },
                    },
                  },
                }
              }

              return Promise.resolve(mockDraftProduct)
            },
            async getOneProductBySkuOrThrow(): Promise<Product | null> {
              return Promise.resolve(null)
            },
          }
        }
        if (token === CommercetoolsCustomObjectDao) {
          return {
            async getCustomObjectByKey() {
              return {}
            },
            async writeCustomObject() {
              return {}
            },
          }
        }
        if (token === ProductMapper) {
          return {
            mapCtVariantToVariantModel: (
              variant: ProductVariant,
              type: ProductTypeKey,
              isMaster: boolean,
              productGroupName: MultilangString,
            ) => {
              return BaristaProductVariant.create({
                sku: new Sku(variant.sku!),
                name: variant.attributes?.find((attr) => attr.name === 'variantName')?.value,
                prices: variant.prices || [],
                description: variant.attributes?.find((attr) => attr.name === 'description')?.value,
                ctAttributes: variant.attributes!,
              })
            },
          }
        }
        if (token === VariantVersionFetcherService) {
          return {}
        }
        if (token === ProductService) {
          return {
            async findOneBySku() {
              return {}
            },
            async mapProjectionToProductDto() {
              return {}
            },
          }
        }
        if (token === ProductDraftChangesService) {
          return {
            async getProductDraftChanges(sku: string) {
              return {}
            },
          }
        }
      })
      .compile()
    service = module.get<ReviewStatusService>(ReviewStatusService)
  })

  it('should create an empty review status for a variant with no changes', async () => {
    await service.setOriginalProduct('UK007260')
    const res = await service.generateFieldReviewStatuses('UK007260', 'UK007260')
    expect(res).toEqual({
      sku: 'UK007260',
      marketing: {},
      labelling: null,
      reporting: {},
      prices: [],
      attributes: {},
    })
  })

  it('should create populated review status object for a variant with some changes between drafts', async () => {
    await service.setOriginalProduct('UK007260-withChanges')
    const res = await service.generateFieldReviewStatuses(
      'UK007260-withChanges',
      'UK007260-withChanges',
    )
    expect(res).toEqual({
      sku: 'UK007260-withChanges',
      marketing: {
        name: {
          'en-GB': {
            modifiedAt: mockDate.toISOString(),
            status: STATUS_TYPES.pending,
            user: {
              id: null,
              name: null,
            },
          },
        },
        description: {
          'en-GB': {
            modifiedAt: mockDate.toISOString(),
            status: STATUS_TYPES.pending,
            user: {
              id: null,
              name: null,
            },
          },
        },
      },
      labelling: null,
      reporting: {
        pluReportingName: {
          modifiedAt: mockDate.toISOString(),
          status: STATUS_TYPES.pending,
          user: {
            id: null,
            name: null,
          },
        },
      },
      prices: [],
      attributes: {},
    })
  })

  it('should create an empty review status for a product with no changes', async () => {
    await service.setOriginalProduct('UK007260')
    const res = await service.generateFieldReviewStatuses('UK007260')
    expect(res).toEqual({
      sku: 'UK007260',
      categories: [],
      setUp: {},
    })
  })

  it('should create populated review status object for a product with some changes', async () => {
    await service.setOriginalProduct('UK007260-withChanges')
    const res = await service.generateFieldReviewStatuses('UK007260-withChanges')

    expect(res).toEqual({
      sku: 'UK007260-withChanges',
      categories: [
        {
          modifiedAt: mockDate.toISOString(),
          status: STATUS_TYPES.pending,
          user: {
            id: null,
            name: null,
          },
          value: ['c5d020de-8521-433e-96aa-5662655a27d6'],
        },
      ],
      setUp: {
        iceMachineRequired: {
          modifiedAt: mockDate.toISOString(),
          status: STATUS_TYPES.pending,
          user: {
            id: null,
            name: null,
          },
        },
      },
    })
  })
})
