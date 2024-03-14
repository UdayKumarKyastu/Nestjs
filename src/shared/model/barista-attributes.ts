import { plainToClass, plainToClassFromExist } from 'class-transformer'

import { BaristaAttributesDto } from '../dto/barista-attributes.dto'

export class BaristaAttributes {
  withDecafPods!: boolean
  withoutMilk!: boolean
  withSemiSkimmedMilk!: boolean
  withSkimmedMilk!: boolean
  withOatMilk!: boolean
  withRiceCoconutMilk!: boolean
  withSoyMilk!: boolean

  constructor(rawAttributes: Omit<BaristaAttributes, 'toDto'>) {
    return plainToClassFromExist(this, rawAttributes)
  }

  toDto(): BaristaAttributesDto {
    return plainToClass(BaristaAttributesDto, this)
  }
}
