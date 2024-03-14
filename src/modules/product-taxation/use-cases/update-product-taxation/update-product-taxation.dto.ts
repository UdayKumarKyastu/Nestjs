import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateProductTaxationDto {
  @ApiProperty({
    example: 'uk-vat-20',
    description: ' TaxRate category ID',
  })
  @IsString()
  taxCategoryId!: string
}
