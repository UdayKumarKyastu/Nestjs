import { MultiLangStringMockFactory } from '../../modules/product/logic/models/multilang-string'
import { ChannelPriceDto } from '../dto/channel-price.dto'

import { ChannelPrice } from './channel-price'
import { TaxRate } from './tax-rate'
import { Money } from './money'
import { Currency } from './currency'

describe('ChannelPrice', function () {
  it('Transforms to ChannelPriceDto', () => {
    const cp = new ChannelPrice({
      channelName: 'airport',
      eatInTax: new TaxRate(0.5),
      eatInPrice: new Money({
        currencyCode: Currency.GBP,
        centAmount: 100,
      }),
      takeAwayPrice: new Money({
        currencyCode: Currency.GBP,
        centAmount: 150,
      }),
      eatInClubPret: new Money({
        currencyCode: Currency.GBP,
        centAmount: 100,
      }),
      takeAwayClubPret: new Money({
        currencyCode: Currency.GBP,
        centAmount: 150,
      }),
      takeAwayTax: new TaxRate(0.5),
      deliveryTax: new TaxRate(0.5),
      deliveryPrice: new Money({
        currencyCode: Currency.GBP,
        centAmount: 100,
      }),
    })

    const dto = cp.toDto(MultiLangStringMockFactory.createMultiLangString('Airport Price'))

    expect(ChannelPriceDto.validate(dto)).resolves.not.toThrow()
    expect(dto.eatInTax).toBe(0.5)
    expect(dto.channelLabel['en-GB']).toBe('Airport Price-en-GB')
  })
})
