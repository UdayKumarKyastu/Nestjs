import { Product } from '@commercetools/platform-sdk'

import { CountryCode } from '../../../shared/model/country-code'
import { ProductTypeKey } from '../../product-type/product-type-key'

export const productMock: Product = {
  productType: {
    obj: {
      key: ProductTypeKey.BaristaBeverage,
    },
  },
  id: 'UK10001',
  key: 'UK10001',
  masterData: {
    current: {
      name: {
        'en-GB': 'Test name',
      },
      categories: [],
      masterVariant: {
        sku: 'UK10001',
        attributes: [
          {
            name: 'country',
            value: { key: CountryCode.UK, value: 'UK' },
          },
        ],
        key: 'UK10001',
      },
      variants: [],
    },
    staged: {
      name: {
        'en-GB': 'Test name draft',
      },
      categories: [],
      masterVariant: {
        sku: 'UK10001',
        attributes: [
          {
            name: 'country',
            value: { key: CountryCode.UK, value: 'UK' },
          },
        ],
        key: 'UK10001',
      },
      variants: [],
    },
  },
} as any as Product

export const productWithVersionMock: Product = {
  productType: {
    obj: {
      key: ProductTypeKey.BaristaBeverage,
    },
  },
  id: 'UK10002',
  key: 'UK10002',
  masterData: {
    current: {
      name: {
        'en-GB': 'Test name',
      },
      categories: [],
      masterVariant: {
        sku: 'UK10002',
        attributes: [
          {
            name: 'country',
            value: { key: CountryCode.UK, value: 'UK' },
          },
          {
            name: 'productVariantVersions',
            value: [
              {
                typeId: 'key-value-document',
                id: '1e164521-1e41-4ca9-bc2a-513e399a5310',
              },
            ],
          },
        ],
        key: 'UK10002',
      },
      variants: [],
    },
    staged: {
      name: {
        'en-GB': 'Test name',
      },
      categories: [],
      masterVariant: {
        sku: 'UK10002',
        attributes: [
          {
            name: 'country',
            value: { key: CountryCode.UK, value: 'UK' },
          },
          {
            name: 'productVariantVersions',
            value: [
              {
                typeId: 'key-value-document',
                id: '1e164521-1e41-4ca9-bc2a-513e399a5310',
              },
            ],
          },
        ],
        key: 'UK10002',
      },
      variants: [],
    },
  },
} as any as Product
