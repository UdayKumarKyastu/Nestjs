import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class ProductVariantChangesCountDto {
  @IsInt()
  @ApiProperty()
  marketing!: number

  @IsInt()
  @ApiProperty()
  reporting!: number

  @IsInt()
  @ApiProperty()
  attributes!: number

  @IsInt()
  @ApiProperty()
  pricing!: number

  @IsInt()
  @ApiProperty()
  labelling!: number

  @IsInt()
  @ApiProperty()
  total!: number
}
