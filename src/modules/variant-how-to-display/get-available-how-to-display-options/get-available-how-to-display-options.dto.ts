import { ApiProperty } from '@nestjs/swagger'

import { EnumOption } from '../../product/logic/models/enum-option'

export class GetAvailableHowToDisplayOptionsDto {
  @ApiProperty({
    type: EnumOption,
    isArray: true,
  })
  options!: EnumOption[]
}
