import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { IsNullable } from '../../configuration/validation/is-nullable'

import { MultiLangStringDto } from './multi-lang-string.dto'

export class CategoryTree {
  @IsUUID()
  @ApiProperty({
    format: 'uuid',
  })
  categoryID!: string

  @ValidateNested({
    each: true,
  })
  @Type(() => MultiLangStringDto)
  @ApiProperty()
  categoryName!: MultiLangStringDto

  @IsString()
  @ApiProperty({
    example: 'UK12345',
  })
  key!: string

  @Type(() => CategoryTree)
  @ValidateNested({
    each: true,
  })
  @ApiProperty({
    type: CategoryTree,
    isArray: true,
    description: 'Nested, recursive array of children categories',
  })
  categories!: CategoryTree[]

  @IsString()
  @IsNullable()
  @ApiProperty({
    nullable: true,
  })
  parentID!: string | null
}
