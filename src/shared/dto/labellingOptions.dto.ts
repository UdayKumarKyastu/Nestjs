import { ApiProperty } from '@nestjs/swagger'

type LabellingObjectKeys = 'key' | 'label'

export class LabellingOptionsDto {
  @ApiProperty()
  instructionsForUse!: Record<LabellingObjectKeys, string>[]

  @ApiProperty()
  useBy!: Record<LabellingObjectKeys, string>[]

  @ApiProperty()
  sellBy!: Record<LabellingObjectKeys, string>[]

  @ApiProperty()
  productServes!: Record<LabellingObjectKeys, string>[]
}
