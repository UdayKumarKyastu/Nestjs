import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class BaristaSetupDto {
  @IsBoolean()
  @ApiProperty()
  canHaveVariants!: boolean

  @IsBoolean()
  @ApiProperty()
  iceMachineRequired!: boolean

  @IsBoolean()
  @ApiProperty()
  blenderRequired!: boolean

  @IsBoolean()
  @ApiProperty({
    description: 'Not editable',
  })
  canBeDecaf!: boolean

  @IsBoolean()
  @ApiProperty()
  canAddSyrup!: boolean

  @IsBoolean()
  @ApiProperty()
  canAddExtraCoffeeShot!: boolean

  @IsBoolean()
  @ApiProperty()
  canAddWhippedCream!: boolean

  @IsBoolean()
  @ApiProperty({
    description: 'Not editable',
  })
  canBeWithoutMilk!: boolean

  @IsBoolean()
  @ApiProperty({
    description: 'Not editable',
  })
  canBeWithSemiSkimmedMilk!: boolean

  @IsBoolean()
  @ApiProperty({
    description: 'Not editable',
  })
  canBeWithSkimmedMilk!: boolean

  @IsBoolean()
  @ApiProperty({
    description: 'Not editable',
  })
  canBeWithOatMilk!: boolean

  @IsBoolean()
  @ApiProperty({
    description: 'Not editable',
  })
  canBeWithRiceCoconutMilk!: boolean

  @IsBoolean()
  @ApiProperty({
    description: 'Not editable',
  })
  canBeWithSoyMilk!: boolean
}
