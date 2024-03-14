import { Inject, Injectable } from '@nestjs/common'
import { Product } from '@commercetools/platform-sdk'

import { VariantVersionCustomObject } from '../../../variant-version/model/version-custom-object'
import { CommercetoolsContext } from '../../../commercetools/commercetools-context'
import { CountryCode } from '../../../../shared/model/country-code'
import { IProductTypeDao, ProductTypeDao } from '../../../product-type/product-type.dao'

export interface IGetNewProductsDao {
  getNewVersions(): Promise<VariantVersionCustomObject[]>
  getProductsContainingNewVersions(hgCodes: string[]): Promise<Product[]>
  getNewProducts(country?: CountryCode): Promise<Product[]>
}

@Injectable()
export class GetNewProductsDao implements IGetNewProductsDao {
  constructor(
    @Inject(CommercetoolsContext) private readonly _ctContext: CommercetoolsContext,
    @Inject(ProductTypeDao) private readonly _productTypeDao: IProductTypeDao,
  ) {}

  private attachCountryCondition(originalCondition: string, country: CountryCode) {
    return `${originalCondition} AND masterData(current(masterVariant(attributes(name="country" and value(key="${country}")))))`
  }

  async getNewProducts(country?: CountryCode): Promise<Product[]> {
    const sevenDaysBeforeDate = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
    const [food, barista] = await Promise.all([
      this._productTypeDao.getFoodProductTypeDefinition(),
      this._productTypeDao.getBaristaProductTypeDefinition(),
    ])

    let whereCondition = `createdAt > "${sevenDaysBeforeDate}" AND productType(id in ("${food.id}", "${barista.id}"))`

    if (country) {
      whereCondition = this.attachCountryCondition(whereCondition, country)
    }

    return this._ctContext.products
      .get({
        queryArgs: {
          limit: 500,
          offset: 0,
          markMatchingVariants: true,
          expand: ['productType'],
          where: whereCondition,
        },
      })
      .execute()
      .then((resp) => resp.body.results)
  }

  async getNewVersions(): Promise<VariantVersionCustomObject[]> {
    const sevenDaysBeforeDate = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()

    const response = await this._ctContext.customObjects
      .get({
        queryArgs: {
          limit: 500,
          offset: 0,
          where: `createdAt > "${sevenDaysBeforeDate}"`,
        },
      })
      .execute()

    return response.body.results as VariantVersionCustomObject[]
  }

  async getProductsContainingNewVersions(hgCodes: string[]) {
    const whereCondition = `masterData(current(masterVariant(attributes(name = "hgCode" and value in (${hgCodes
      .map((code) => `"${code}"`)
      .join(',')})))))`

    const response = await this._ctContext.products
      .get({
        queryArgs: {
          markMatchingVariants: true,
          expand: ['productType'],
          where: whereCondition,
        },
      })
      .execute()

    return response.body.results
  }
}
