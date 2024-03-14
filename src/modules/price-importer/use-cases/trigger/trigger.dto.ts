import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

import { IsNullable } from '../../../../configuration/validation/is-nullable'

interface TriggerError {
  code: string
  message: string
  sku?: string
}

export class TriggerDto {
  @IsString()
  @ApiProperty({
    example: 'PROCESSING',
    description: 'Status code of the import',
  })
  status!: string

  @IsArray()
  @ApiProperty({
    example: [{ code: '[TEST]', message: 'Test message', sku: 'UK000123' }],
    description: 'A list of errors associated with the import',
  })
  errors!: TriggerError[]

  @IsString()
  @ApiProperty({
    example: '2022-04-20T15:26:23.097Z',
    description: 'ISO Date String representing when the import was triggered',
  })
  triggeredAt!: string

  @IsString()
  @IsNullable()
  @ApiProperty({
    example: '2022-04-20T15:26:23.097Z',
    description: 'ISO Date String representing when the import was completed',
  })
  completedAt!: string | null
}
