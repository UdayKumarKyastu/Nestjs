import { Injectable } from '@nestjs/common'

import { VariantReportingOptionsDto } from './variant-reporting-options.dto'
import { ReportingCategories } from './reporting-categories'

export interface IReportingOptionsResolverService {
  constructDto(): Promise<VariantReportingOptionsDto>
}

/**
 * This service returns hardcoded categories, because commercetools keep them in flat list,
 * but we need them to be nested under primary categories. So to avoid doing it on frontend,
 * we just return a tree instead of a list.
 */
@Injectable()
export class ReportingOptionsResolverService implements IReportingOptionsResolverService {
  async constructDto(): Promise<VariantReportingOptionsDto> {
    return {
      pluCategoryOptions: ReportingCategories.PluCategoriesOptionsTree,
      starKisCategoryOptions: ReportingCategories.StarKisCategoryOptionsTree,
    }
  }
}
