import { ProductGroup } from '../../../../../shared/model/product-group'
import mockDraftProduct from '../../mocks/mock-draft-product'

import { ProductReviewStatusGenerator } from './product-review-status-generator'

const mockDate = new Date()

describe('ProductReviewStatusGenerator', () => {
  let originalProduct: ProductGroup
  let modifiedProduct: ProductGroup

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    originalProduct = new ProductGroup(mockDraftProduct)
    modifiedProduct = new ProductGroup(mockDraftProduct)
  })

  it('creates proper diff object for changed setup attributes', () => {
    const requiresBlenderIndex = modifiedProduct
      .getMasterVariant()
      .attributes?.findIndex(({ name }) => name === 'requiresBlender')
    modifiedProduct.getMasterVariant().attributes![requiresBlenderIndex!] = {
      name: 'requiresBlender',
      value: true,
    }

    const canAddSyrupIndex = modifiedProduct
      .getMasterVariant()
      .attributes?.findIndex(({ name }) => name === 'canAddSyrup')
    modifiedProduct.getMasterVariant().attributes![canAddSyrupIndex!] = {
      name: 'canAddSyrup',
      value: false,
    }

    const productStatusGenerator = new ProductReviewStatusGenerator(
      originalProduct,
      modifiedProduct,
    )

    expect(productStatusGenerator.getSetupDiff()).toEqual({
      blenderRequired: {
        modifiedAt: mockDate.toISOString(),
        status: 'PENDING',
        user: {
          id: null,
          name: null,
        },
      },
      canAddSyrup: {
        modifiedAt: mockDate.toISOString(),
        status: 'PENDING',
        user: {
          id: null,
          name: null,
        },
      },
    })
  })

  it('creates proper diff object for changed categories', () => {
    modifiedProduct
      .getMasterData()
      .staged.categories.push({ typeId: 'category', id: 'b47c6a6b-60a5-4a9b-94f7-432b32a532da' })

    const productStatusGenerator = new ProductReviewStatusGenerator(
      originalProduct,
      modifiedProduct,
    )

    expect(productStatusGenerator.getCategoriesDiff()).toEqual([
      {
        modifiedAt: mockDate.toISOString(),
        status: 'PENDING',
        user: {
          id: null,
          name: null,
        },
        value: ['b47c6a6b-60a5-4a9b-94f7-432b32a532da'],
      },
    ])
  })
})
