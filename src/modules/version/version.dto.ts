import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class VersionDto {
  @ApiProperty({ description: 'Name of this application', type: 'string', required: true })
  @IsNotEmpty()
  @IsString()
  applicationName!: string

  @ApiProperty({ description: 'Version of this application', type: 'string', required: true })
  @IsNotEmpty()
  @IsString()
  version!: string
}
