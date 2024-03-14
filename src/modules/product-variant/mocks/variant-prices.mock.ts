import { Price } from '@commercetools/platform-sdk'

export const variantPricesMock: Price[] = [
  {
    value: {
      type: 'centPrecision',
      currencyCode: 'GBP',
      centAmount: 189,
      fractionDigits: 2,
    },
    id: '8ee0a33e-0b6b-4d0a-9e9b-477f76897035',
    channel: {
      id: 'd1d2bc59-347f-4919-a8cb-93b02aab0137',
      typeId: 'channel',
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
    custom: {
      type: {
        typeId: 'type',
        id: '',
      },
      fields: {
        type: {
          typeId: 'type',
          id: '',
        },
        eatInPrice: {
          centAmount: 200,
        },
        eatInTax: 0.25,
      },
    },
  },
  {
    value: {
      type: 'centPrecision',
      currencyCode: 'GBP',
      centAmount: 200,
      fractionDigits: 2,
    },
    id: '8ee0a33e-0b6b-4d0a-9e9b-477f76897035',
    channel: {
      id: '7880620c-36ef-4613-bac5-3bbe501ec029',
      typeId: 'channel',
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
    custom: {
      type: {
        typeId: 'type',
        id: '',
      },
      fields: {
        type: {
          typeId: 'type',
          id: '',
        },
        eatInPrice: {
          centAmount: 150,
        },
        eatInTax: 0.2,
      },
    },
  },
]
