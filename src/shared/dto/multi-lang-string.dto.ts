import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class MultiLangStringDto {
  @IsString()
  @ApiProperty({
    type: 'string',
  })
  'zh-HK'!: string

  @IsString()
  @ApiProperty({
    type: 'string',
  })
  'en-US'!: string

  @IsString()
  @ApiProperty({
    type: 'string',
  })
  'fr-FR'!: string

  @IsString()
  @ApiProperty({
    type: 'string',
  })
  'en-GB'!: string

  @IsString()
  @ApiProperty({
    type: 'string',
  })
  'en-HK'!: string
}
