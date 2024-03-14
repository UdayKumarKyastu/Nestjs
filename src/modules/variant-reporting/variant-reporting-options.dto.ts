import { ApiProperty } from '@nestjs/swagger'

import { EnumOption } from '../product/logic/models/enum-option'
import { ReportingCategoryOption } from '../product/logic/models/reporting-category-option'

export class VariantReportingOptionsDto {
  @ApiProperty({
    type: EnumOption,
    isArray: true,
  })
  pluCategoryOptions!: ReportingCategoryOption[]

  @ApiProperty({
    type: EnumOption,
    isArray: true,
  })
  starKisCategoryOptions!: ReportingCategoryOption[]
}
