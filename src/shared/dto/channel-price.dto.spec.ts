import { MultiLangStringMockFactory } from '../../modules/product/logic/models/multilang-string'
import { Currency } from '../model/currency'

import { ChannelPriceDto } from './channel-price.dto'

const createChannelPrice = (): ChannelPriceDto => ({
  eatInPrice: {
    currencyCode: Currency.GBP,
    centAmount: 200,
  },
  eatInClubPret: {
    currencyCode: Currency.GBP,
    centAmount: 200,
  },
  eatInTax: 0,
  takeAwayPrice: {
    currencyCode: Currency.GBP,
    centAmount: 250,
  },
  takeAwayClubPret: {
    currencyCode: Currency.GBP,
    centAmount: 250,
  },
  takeAwayTax: 0,
  deliveryPrice: {
    currencyCode: Currency.GBP,
    centAmount: 200,
  },
  deliveryTax: 0,
  channelLabel: MultiLangStringMockFactory.createMultiLangString('Channel price').toDto(),
  channelName: 'channel',
})

describe('ChannelPriceDto', function () {
  it('Accepts tax rates as a fraction between 0 and 1', () => {
    const price = createChannelPrice()

    return ChannelPriceDto.validate(price)
  })

  it('Rejects if tax rate is negative', async () => {
    expect.assertions(1)

    const price1 = createChannelPrice()
    const price2 = createChannelPrice()

    price1.eatInTax = -1

    await ChannelPriceDto.validate(price1).catch((e) => {
      expect(e).toEqual(expect.anything())
    })

    await ChannelPriceDto.validate(price2).catch((e) => {
      expect(e).toEqual(expect.anything())
    })
  })

  it('Rejects if tax rate is more than 1', async () => {
    const price = createChannelPrice()

    price.eatInTax = 1.1

    await ChannelPriceDto.validate(price).catch((e) => {
      expect(e).toEqual(expect.anything())
    })
  })
})
