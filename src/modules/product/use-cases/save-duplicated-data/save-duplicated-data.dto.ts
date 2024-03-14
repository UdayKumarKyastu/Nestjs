import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class SaveDuplicatedDataDto {
  @ApiProperty()
  @IsBoolean()
  isDuplicatedData?: boolean
}
