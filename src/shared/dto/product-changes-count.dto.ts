import { ApiProperty } from '@nestjs/swagger'

export class ProductChangesCountDto {
  @ApiProperty()
  marketing!: number

  @ApiProperty()
  categories!: number

  @ApiProperty()
  setUp!: number

  @ApiProperty()
  total!: number
}
