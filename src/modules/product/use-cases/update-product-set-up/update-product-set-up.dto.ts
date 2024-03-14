import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class UpdateProductSetUpDto {
  @IsBoolean()
  @ApiProperty()
  iceMachineRequired!: boolean

  @IsBoolean()
  @ApiProperty()
  blenderRequired!: boolean

  @IsBoolean()
  @ApiProperty()
  canHaveVariants!: boolean

  @IsBoolean()
  @ApiProperty()
  canAddSyrup!: boolean

  @IsBoolean()
  @ApiProperty()
  canAddExtraCoffeeShot!: boolean

  @IsBoolean()
  @ApiProperty()
  canAddWhippedCream!: boolean
}
