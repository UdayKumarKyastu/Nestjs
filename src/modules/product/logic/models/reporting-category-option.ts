import { ApiProperty } from '@nestjs/swagger'

import { EnumOption } from './enum-option'

export class ReportingCategoryOption {
  @ApiProperty()
  key!: string

  @ApiProperty()
  label!: string

  @ApiProperty({ type: EnumOption, isArray: true })
  children!: EnumOption[]
}
