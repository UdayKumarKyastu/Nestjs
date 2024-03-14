import { ProductProjection } from '@commercetools/platform-sdk'
import { Inject, Injectable } from '@nestjs/common'

import { CommercetoolsContext } from '../commercetools/commercetools-context'
import { IProductTypeDao, ProductTypeDao } from '../product-type/product-type.dao'

import { SearchProperty } from './search-property'

export interface ISearchProductsDao {
  searchProducts(
    query: string,
    propertyName: SearchProperty,
    limit: number,
    page: number,
    country?: string,
  ): Promise<{
    total: number
    products: ProductProjection[]
  }>
}

@Injectable()
export class SearchProductsDao implements ISearchProductsDao {
  // TODO: Search in specific language (from frontend?) or every language?
  private searchedLanguage = 'en'

  constructor(
    private readonly _ctContext: CommercetoolsContext,
    @Inject(ProductTypeDao) private readonly _productTypeDao: IProductTypeDao,
  ) {}

  async searchProducts(
    query: string,
    propertyName: SearchProperty,
    limit: number,
    page: number,
    country = '',
  ): Promise<{
    total: number
    products: ProductProjection[]
  }> {
    /**
     * TODO This probably can be cached, not likely to change and adds extra requests...
     *   But hardcoding IDs is not a best idea
     */
    const [food, barista] = await Promise.all([
      this._productTypeDao.getFoodProductTypeDefinition(),
      this._productTypeDao.getBaristaProductTypeDefinition(),
    ])
    const filters = []
    if (propertyName === SearchProperty.Sku) {
      filters.push(`variants.sku: "${query.trim()}"`)
    }
    if (propertyName === SearchProperty.hgCode) {
      filters.push(`variants.attributes.hgCode: "${query.trim()}"`)
    }
    if (country) {
      filters.push(`variants.attributes.country.key: "${country}"`)
    }

    const result = await this._ctContext.productProjections
      .search()
      .get({
        queryArgs: {
          limit,
          staged: true,
          offset: (page - 1) * limit,
          markMatchingVariants: true,
          expand: ['productType'],
          'filter.query': `productType.id: "${food.id}","${barista.id}"`,
          fuzzy: propertyName === SearchProperty.Name,
          [`text.${this.searchedLanguage}`]: SearchProperty.Name ? query : undefined,
          filter: filters,
        },
      })
      .execute()

    return {
      products: result.body.results,
      total: result.body.total || 0,
    }
  }
}
