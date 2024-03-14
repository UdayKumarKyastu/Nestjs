import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { MultiLangStringDto } from '../../../../shared/dto/multi-lang-string.dto'

export class UpdateProductMarketingDto {
  @ApiProperty({
    type: MultiLangStringDto,
    description: 'Product group/all variants name',
  })
  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @Type(() => MultiLangStringDto)
  name!: MultiLangStringDto

  @ApiProperty({
    type: MultiLangStringDto,
    description: 'Product group/all variants description',
  })
  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @Type(() => MultiLangStringDto)
  description!: MultiLangStringDto
}
