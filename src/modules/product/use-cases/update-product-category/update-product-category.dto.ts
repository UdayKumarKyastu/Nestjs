import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class UpdateProductCategoryDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
    format: 'uuid',
  })
  @IsUUID(4, {
    each: true,
  })
  categoriesIDs!: string[]
}
