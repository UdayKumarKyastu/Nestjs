import { ApiProperty } from '@nestjs/swagger'

import { MultiLangStringDto } from './multi-lang-string.dto'

export class CategoryListItemDto {
  @ApiProperty()
  key!: string

  @ApiProperty({
    type: MultiLangStringDto,
  })
  name!: MultiLangStringDto

  @ApiProperty({
    format: 'uuid',
  })
  id!: string
}
