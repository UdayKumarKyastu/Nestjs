import { Injectable } from '@nestjs/common'

import { TaxCategoriesService } from '../../tax-categories.service'
import { CountryCode } from '../../../../shared/model/country-code'
import { TaxCategoryDto } from '../../../../shared/dto/tax-category.dto'

@Injectable()
export class GetAllTaxCategoriesService {
  constructor(private readonly taxCategoriesService: TaxCategoriesService) {}

  getAllTaxCategories(country?: CountryCode): Promise<TaxCategoryDto[]> {
    return this.taxCategoriesService.findAll({
      /**
       * There is inconsistency in CommerceTools how UK/GB is stored
       */
      filterByCountry: country ? (country === 'UK' ? ['UK', 'GB'] : [country]) : undefined,
    })
  }
}
