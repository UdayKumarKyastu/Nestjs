import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

interface PriceImporterError {
  code: string
  message: string
  sku?: string
}

export class GetStatusDto {
  @IsString()
  @ApiProperty({
    example: 'COMPLETED',
    description: 'Status code of the import',
  })
  status!: string

  @IsArray()
  @ApiProperty({
    example: [
      {
        code: 'SOME_ERROR_CATEGORY',
        message: 'There was a problem with product 123',
        sku: 'UK000123',
      },
    ],
    description: 'A list of errors associated with the import',
  })
  errors!: PriceImporterError[]
}
