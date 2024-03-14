import { STATUS_TYPES } from '../models/status-types'
import { ProductReviewStatus } from '../models/product-review-status'
import { Area } from '../models/area'

import { ProductFieldStatusUpdater } from './product-field-status-updater'

const mockDate = new Date()

describe('ProductFieldStatusUpdater', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('Setup fields', () => {
    const setupFields = [
      'requiresIceMachine',
      'requiresBlender',
      'canHaveVariants',
      'canAddSyrup',
      'canAddExtraShot',
      'canAddWhippedCream',
    ]

    it.each(setupFields)('properly updates %s status', (key) => {
      const originalStatusObject: Partial<ProductReviewStatus> = {
        setUp: {
          [key]: {
            modifiedAt: '2020-01-01T10:00:00',
            status: STATUS_TYPES.pending,
            user: {
              id: null,
              name: null,
            },
          },
        },
      }
      const variantFieldStatusUpdater = new ProductFieldStatusUpdater(
        originalStatusObject as ProductReviewStatus,
      )

      expect(
        variantFieldStatusUpdater.updateReviewStatusObject(Area.SETUP, key, 'approve'),
      ).toEqual({
        setUp: {
          [key]: {
            modifiedAt: mockDate.toISOString(),
            status: STATUS_TYPES.accepted,
            user: {
              id: null,
              name: null,
            },
          },
        },
      })
    })

    describe('Category fields', () => {
      it('properly updates category field status', () => {
        const categoryValue = [
          'c5d020de-8521-433e-96aa-5662655a27d6',
          '46e4af9c-ebe0-4d01-8710-3dd4818b6561',
        ]

        const originalStatusObject: Partial<ProductReviewStatus> = {
          categories: [
            {
              modifiedAt: '2020-01-01T10:00:00',
              status: STATUS_TYPES.pending,
              user: {
                id: null,
                name: null,
              },
              value: categoryValue,
            },
          ],
        }
        const variantFieldStatusUpdater = new ProductFieldStatusUpdater(
          originalStatusObject as ProductReviewStatus,
        )

        expect(
          variantFieldStatusUpdater.updateReviewStatusObject(
            Area.CATEGORIES,
            '',
            'approve',
            categoryValue,
          ),
        ).toEqual({
          categories: [
            {
              modifiedAt: mockDate.toISOString(),
              status: STATUS_TYPES.accepted,
              user: {
                id: null,
                name: null,
              },
              value: categoryValue,
            },
          ],
        })
      })
    })
  })
})
