import { ClientResponse, Product, TaxCategory } from '@commercetools/platform-sdk'

import { TaxCategoriesService } from './tax-categories.service'
import { IProductTaxationDao } from './product-taxation.dao.service'

describe('TaxCategoriesService', () => {
  const baseTaxCategoryFields: TaxCategory = {
    name: 'Mock category',
    rates: [
      {
        name: 'Rate 1',
        amount: 0.3,
        id: 'rate-id',
        country: 'UK',
        subRates: [],
        includedInPrice: true,
      },
    ],
    id: 'tax-category-1',
    createdAt: new Date(2020, 1, 1).toISOString(),
    lastModifiedAt: new Date(2020, 1, 1).toISOString(),
    version: 1,
  }

  it('Returns formatted categories DTO', async () => {
    const dao: IProductTaxationDao = {
      async findAll(): Promise<TaxCategory[]> {
        return [
          baseTaxCategoryFields,
          {
            ...baseTaxCategoryFields,
            name: 'Mock category 2',
            id: 'tax-category-2',
          },
        ]
      },
      updateProductCategory(
        sku: string,
        taxCategoryId: string,
        version: number,
      ): Promise<ClientResponse<Product>> {
        throw new Error()
      },
    }

    const result = await new TaxCategoriesService(dao).findAll()

    expect(result).toMatchObject([
      {
        id: 'tax-category-1',
        name: 'Mock category',
      },
      {
        id: 'tax-category-2',
        name: 'Mock category 2',
      },
    ])
  })

  it('Filter categories by country', async () => {
    const dao: IProductTaxationDao = {
      async findAll(): Promise<TaxCategory[]> {
        return [
          baseTaxCategoryFields,
          {
            ...baseTaxCategoryFields,
            name: 'Mock category 2',
            id: 'tax-category-2',
            rates: [
              {
                country: 'US',
                name: 'Mock rate',
                amount: 0.1,
                id: 'rate-id',
                includedInPrice: true,
              },
            ],
          },
        ]
      },
      updateProductCategory(
        sku: string,
        taxCategoryId: string,
        version: number,
      ): Promise<ClientResponse<Product>> {
        throw new Error()
      },
    }

    const result = await new TaxCategoriesService(dao).findAll({
      filterByCountry: ['UK'],
    })

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tax-category-1')
  })
})
