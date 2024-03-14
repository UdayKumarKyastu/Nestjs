import { VariantReviewStatus, AvailabilityReviewStatus } from '../models/variant-review-status'
import { STATUS_TYPES } from '../models/status-types'
import { Area } from '../models/area'

import { VariantFieldStatusUpdater } from './variant-field-status-updater'

const mockDate = new Date()

describe('VariantFieldStatusUpdater', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('Marketing fields', () => {
    const primitiveFields = [
      'availableForClickAndCollect',
      'availableForPretDelivers',
      'availableForOutposts',
      'isLive',
      'visibleOnDeliveryWebsite',
      'isChefsSpecial',
      'availableForLunch',
      'availableAllDay',
    ]

    it('properly updates name status', () => {
      const originalStatusObject: Partial<VariantReviewStatus> = {
        marketing: {
          name: {
            'en-GB': {
              modifiedAt: '2020-01-01T10:00:00',
              status: STATUS_TYPES.pending,
              user: {
                id: null,
                name: null,
              },
            },
          },
        },
      }

      const variantFieldStatusUpdater = new VariantFieldStatusUpdater(
        originalStatusObject as VariantReviewStatus,
      )

      expect(
        variantFieldStatusUpdater.updateReviewStatusObject(
          Area.MARKETING,
          'name',
          'approve',
          'en-GB',
        ),
      ).toEqual({
        marketing: {
          name: {
            'en-GB': {
              modifiedAt: mockDate.toISOString(),
              status: STATUS_TYPES.accepted,
              user: {
                id: null,
                name: null,
              },
            },
          },
        },
      })
    })

    it('properly updates description status', () => {
      const originalStatusObject: Partial<VariantReviewStatus> = {
        marketing: {
          description: {
            'en-GB': {
              modifiedAt: '2020-01-01T10:00:00',
              status: STATUS_TYPES.pending,
              user: {
                id: null,
                name: null,
              },
            },
          },
        },
      }

      const variantFieldStatusUpdater = new VariantFieldStatusUpdater(
        originalStatusObject as VariantReviewStatus,
      )

      expect(
        variantFieldStatusUpdater.updateReviewStatusObject(
          Area.MARKETING,
          'description',
          'approve',
          'en-GB',
        ),
      ).toEqual({
        marketing: {
          description: {
            'en-GB': {
              modifiedAt: mockDate.toISOString(),
              status: STATUS_TYPES.accepted,
              user: {
                id: null,
                name: null,
              },
            },
          },
        },
      })
    })

    it.each(primitiveFields)('properly updates %s status', (key) => {
      const mappedKey = key as keyof AvailabilityReviewStatus
      const originalStatusObject: Partial<VariantReviewStatus> = {
        marketing: {
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
      const variantFieldStatusUpdater = new VariantFieldStatusUpdater(
        originalStatusObject as VariantReviewStatus,
      )

      expect(
        variantFieldStatusUpdater.updateReviewStatusObject(Area.MARKETING, mappedKey, 'approve'),
      ).toEqual({
        marketing: {
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
  })

  describe('Reporting fields', () => {
    const reportingKeys = [
      'pluReportingName',
      'pluPrimaryCategoryID',
      'pluSecondaryCategoryID',
      'starKisProductCategoryID',
      'starKisProductSubCategoryID',
      'posID',
      'parentProductSku',
      'productRange',
    ]

    it.each(reportingKeys)('properly updates %s status', (key) => {
      const originalStatusObject: Partial<VariantReviewStatus> = {
        reporting: {
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
      const variantFieldStatusUpdater = new VariantFieldStatusUpdater(
        originalStatusObject as VariantReviewStatus,
      )

      expect(
        variantFieldStatusUpdater.updateReviewStatusObject(Area.REPORTING, key, 'approve'),
      ).toEqual({
        reporting: {
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
  })

  describe('Labelling fields', () => {
    const labellingKeys = [
      'storageConditions',
      'ean13Code',
      'countryOfOriginDescription',
      'includeAverageWeightOnLabel',
      'legalTitle',
      'sellBy',
      'useBy',
      'includeNutritionalInformationOnLabel',
      'useByTurboChef',
      'sellByTurboChef',
      'canBeCookedInTurboChef',
    ]

    it.each(labellingKeys)('properly updates %s status', (key) => {
      const originalStatusObject: Partial<VariantReviewStatus> = {
        labelling: {
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
      const variantFieldStatusUpdater = new VariantFieldStatusUpdater(
        originalStatusObject as VariantReviewStatus,
      )

      expect(
        variantFieldStatusUpdater.updateReviewStatusObject(Area.LABELLING, key, 'approve'),
      ).toEqual({
        labelling: {
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
  })

  describe('Barista attributes fields', () => {
    const baristaAttributesKeys = [
      'withDecafPods',
      'withoutMilk',
      'withSemiSkimmedMilk',
      'withSkimmedMilk',
      'withOatMilk',
      'withRiceCoconutMilk',
      'withSoyMilk',
    ]

    it.each(baristaAttributesKeys)('properly updates %s status', (key) => {
      const originalStatusObject: Partial<VariantReviewStatus> = {
        attributes: {
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
      const variantFieldStatusUpdater = new VariantFieldStatusUpdater(
        originalStatusObject as VariantReviewStatus,
      )

      expect(
        variantFieldStatusUpdater.updateReviewStatusObject(Area.ATTRIBUTES, key, 'approve'),
      ).toEqual({
        attributes: {
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
  })

  it('properly updates pricing fields', () => {
    const originalStatusObject: Partial<VariantReviewStatus> = {
      prices: [
        {
          modifiedAt: '2020-01-01T10:00:00',
          status: STATUS_TYPES.pending,
          user: {
            id: null,
            name: null,
          },
          value: {
            channelName: 'uk_core',
            field: 'takeAwayPrice',
          },
        },
      ],
    }

    const variantFieldStatusUpdater = new VariantFieldStatusUpdater(
      originalStatusObject as VariantReviewStatus,
    )

    expect(
      variantFieldStatusUpdater.updateReviewStatusObject(Area.PRICING, 'takeAwayPrice', 'approve', {
        channelName: 'uk_core',
        field: 'takeAwayPrice',
      }),
    ).toEqual({
      prices: [
        {
          modifiedAt: mockDate.toISOString(),
          status: STATUS_TYPES.accepted,
          user: {
            id: null,
            name: null,
          },
          value: {
            channelName: 'uk_core',
            field: 'takeAwayPrice',
          },
        },
      ],
    })
  })
})
