import { Currency } from '../model/currency'

import { MoneyDto } from './money.dto'

describe('MoneyDTO', function () {
  it('Validates against negative cent amount', async () => {
    expect.assertions(2)

    const correct = new MoneyDto()
    correct.centAmount = 100
    correct.currencyCode = Currency.GBP

    const incorrect = new MoneyDto()
    incorrect.centAmount = -1
    incorrect.currencyCode = Currency.GBP

    await expect(MoneyDto.validate(correct)).resolves.toBe(undefined)

    return MoneyDto.validate(incorrect).catch((e) => {
      expect(e).toBeDefined()
    })
  })

  it('Allows price to be 0', () => {
    const money = new MoneyDto()
    money.centAmount = 0
    money.currencyCode = Currency.GBP

    return expect(MoneyDto.validate(money)).resolves.toBe(undefined)
  })
})
