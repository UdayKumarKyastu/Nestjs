import { Money as MoneyCT } from '@commercetools/platform-sdk'
import { plainToClass } from 'class-transformer'

import { MoneyDto } from '../dto/money.dto'
import { Currency } from '../model/currency'

// todo validate
export class Money implements MoneyCT {
  centAmount!: number
  currencyCode!: Currency

  constructor(m: Omit<Money, 'toDto'>) {
    this.centAmount = m.centAmount
    this.currencyCode = m.currencyCode
  }

  toDto(): MoneyDto {
    return plainToClass(MoneyDto, {
      centAmount: this.centAmount,
      currencyCode: this.currencyCode,
    })
  }
}
