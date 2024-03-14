import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ImageDto {
  @IsString()
  @ApiProperty({
    example: 'https://path-to-image.com',
    description: 'Default size image',
  })
  default!: string

  @IsString()
  @ApiProperty({
    example: 'https://path-to-image.com',
    description: 'Thumbnail size image',
  })
  thumbnail!: string
}
