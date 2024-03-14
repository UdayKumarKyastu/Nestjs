import { Inject, Injectable } from '@nestjs/common'

import { TaxCategoryDto } from '../../shared/dto/tax-category.dto'

import { IProductTaxationDao, ProductTaxationDao } from './product-taxation.dao.service'

type FilterOptions = { filterByCountry?: string[] }

export interface ITaxCategoriesService {
  findAll(options?: FilterOptions): Promise<TaxCategoryDto[]>
}

@Injectable()
export class TaxCategoriesService implements ITaxCategoriesService {
  constructor(@Inject(ProductTaxationDao) private _taxCategoriesDao: IProductTaxationDao) {}

  async findAll(options: FilterOptions = {}) {
    return this._taxCategoriesDao.findAll().then((ctResults) =>
      ctResults
        .filter((ctResult) => {
          if (options.filterByCountry) {
            return options.filterByCountry.includes(ctResult.rates[0]?.country)
          }

          return true
        })
        .map(
          (ctResult): TaxCategoryDto => ({
            id: ctResult.id,
            name: ctResult.name,
            amount: ctResult.rates[0]?.amount,
          }),
        ),
    )
  }
}
