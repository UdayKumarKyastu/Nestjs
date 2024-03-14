import { Money } from '@commercetools/platform-sdk'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, Min, validateOrReject } from 'class-validator'
import { plainToClass } from 'class-transformer'

import { Currency } from '../model/currency'

export class MoneyDto implements Money {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  centAmount!: number

  @IsString()
  @ApiProperty()
  currencyCode!: Currency

  static validate(moneyDto: MoneyDto) {
    return validateOrReject(plainToClass(MoneyDto, moneyDto))
  }
}
