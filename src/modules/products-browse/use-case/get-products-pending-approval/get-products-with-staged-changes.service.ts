import { Inject, Injectable } from '@nestjs/common'
import { Product } from '@commercetools/platform-sdk'

import { CommercetoolsContext } from '../../../commercetools/commercetools-context'
import { CountryCode } from '../../../../shared/model/country-code'
import { IProductTypeDao, ProductTypeDao } from '../../../product-type/product-type.dao'

export interface ICanGetProductsWithStagedChanges {
  getProducts(
    limit: number,
    offset: number,
    country?: CountryCode,
  ): Promise<readonly [products: Product[], total: number]>

  getProductsContainingCustomObjectsWithDraftChanges(hgCodes: string[]): Promise<Product[]>
}

@Injectable()
export class GetProductsWithStagedChangesService implements ICanGetProductsWithStagedChanges {
  constructor(
    private ct: CommercetoolsContext,
    @Inject(ProductTypeDao) private readonly _productTypeDao: IProductTypeDao,
  ) {}

  private attachCountryCondition(originalCondition: string, country: CountryCode) {
    return `${originalCondition} AND masterData(current(masterVariant(attributes(name="country" and value(key="${country}")))))`
  }

  async getProducts(limit: number, offset: number, country?: CountryCode) {
    const [food, barista] = await Promise.all([
      this._productTypeDao.getFoodProductTypeDefinition(),
      this._productTypeDao.getBaristaProductTypeDefinition(),
    ])

    let whereCondition = `masterData(published = true) AND masterData(hasStagedChanges = true) AND productType(id in ("${food.id}", "${barista.id}"))`

    if (country) {
      whereCondition = this.attachCountryCondition(whereCondition, country)
    }

    return this.ct.products
      .get({
        queryArgs: {
          limit,
          offset: offset,
          markMatchingVariants: true,
          expand: ['productType'],
          where: whereCondition,
        },
      })
      .execute()
      .then((resp) => [resp.body.results, resp.body.total!] as const)
  }

  async getProductsContainingCustomObjectsWithDraftChanges(hgCodes: string[]) {
    const whereCondition = `masterData(published = true) AND masterData(current(masterVariant(attributes(name = "hgCode" and value in (${hgCodes
      .map((code) => `"${code}"`)
      .join(',')})))))`

    return this.ct.products
      .get({
        queryArgs: {
          markMatchingVariants: true,
          expand: ['productType'],
          where: whereCondition,
        },
      })
      .execute()
      .then((resp) => resp.body.results)
  }
}
