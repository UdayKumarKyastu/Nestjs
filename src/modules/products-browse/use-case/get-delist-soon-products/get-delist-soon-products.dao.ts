import { Inject, Injectable } from '@nestjs/common'
import { Product } from '@commercetools/platform-sdk'

import { VariantVersionCustomObject } from '../../../variant-version/model/version-custom-object'
import { CommercetoolsContext } from '../../../commercetools/commercetools-context'
import { CountryCode } from '../../../../shared/model/country-code'
import { IProductTypeDao, ProductTypeDao } from '../../../product-type/product-type.dao'

export interface IGetDelistSoonProductsDao {
  getDelistSoonVersions(): Promise<VariantVersionCustomObject[]>
  getProductsContainingDelistSoonVersions(hgCodes: string[]): Promise<Product[]>
  getDelistSoonProducts(country?: CountryCode): Promise<Product[]>
}

@Injectable()
export class GetDelistSoonProductsDao implements IGetDelistSoonProductsDao {
  constructor(
    @Inject(CommercetoolsContext) private readonly _ctContext: CommercetoolsContext,
    @Inject(ProductTypeDao) private readonly _productTypeDao: IProductTypeDao,
  ) {}

  private attachCountryCondition(originalCondition: string, country: CountryCode) {
    return `${originalCondition} AND masterData(current(masterVariant(attributes(name="country" and value(key="${country}")))))`
  }

  async getDelistSoonProducts(country?: CountryCode) {
    const sevenDaysAfterDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()
    const todayDate = new Date().toISOString()

    let whereCondition = `
      masterData(current(masterVariant(attributes(name = "liveTo" and value > "${todayDate}")))) AND
      masterData(current(masterVariant(attributes(name = "liveTo" and value < "${sevenDaysAfterDate}"))))
    `

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

  async getDelistSoonVersions(): Promise<VariantVersionCustomObject[]> {
    const sevenDaysBeforeDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()
    const todayDate = new Date().toISOString()

    const response = await this._ctContext.customObjects
      .get({
        queryArgs: {
          limit: 500,
          offset: 0,
          where: `(value(hg(liveFrom < "${sevenDaysBeforeDate}" AND liveFrom > "${todayDate}"))) AND (value(hg(hgRecipeStatus in ("Draft", "Review"))))`,
        },
      })
      .execute()

    return response.body.results as VariantVersionCustomObject[]
  }

  async getProductsContainingDelistSoonVersions(hgCodes: string[]) {
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
