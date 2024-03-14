import { ApiProperty } from '@nestjs/swagger'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { CategoryTree } from '../../../../shared/dto/category-tree.dto'

export class GetProductCategoriesDto {
  @ValidateNested({
    each: true,
  })
  @Type(() => CategoryTree)
  @ApiProperty({
    type: CategoryTree,
    isArray: true,
  })
  categories!: CategoryTree[]
}
