import { ApiProperty } from '@nestjs/swagger'

export class TaxCategoryDto {
  @ApiProperty({
    example: 'vat-uk-20',
  })
  id!: string

  @ApiProperty({
    example: '20% VAT',
  })
  name!: string

  @ApiProperty({
    example: '0.05',
  })
  amount!: number
}
