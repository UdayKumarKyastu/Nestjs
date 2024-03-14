import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CustomerSearchResult {
  @ApiProperty()
  @IsString()
  name!: string

  @ApiProperty()
  @IsString()
  user_id!: string

  @ApiProperty()
  @IsString()
  email!: string

  @ApiProperty()
  @IsString()
  phone_number!: string

  @ApiProperty()
  @IsString()
  country!: string

  @ApiProperty()
  @IsString()
  status!: string

  @ApiProperty()
  @IsString()
  imageUrl!: string

  @ApiProperty()
  @IsString()
  pret_id!: string
}
