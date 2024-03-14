import { ChannelPriceDto, UpdateChannelPriceDto } from '../dto/channel-price.dto'
import { MultilangString } from '../../modules/product/logic/models/multilang-string'

import { Money } from './money'
import { TaxRate } from './tax-rate'

// todo validate
export class ChannelPrice {
  channelName: string
  takeAwayPrice: Money
  eatInPrice: Money
  eatInTax: TaxRate
  takeAwayTax?: TaxRate
  deliveryPrice: Money
  deliveryTax?: TaxRate
  takeAwayClubPret: Money
  eatInClubPret: Money

  constructor(cp: Omit<ChannelPrice, 'toDto'>) {
    this.channelName = cp.channelName
    this.eatInPrice = new Money(cp.eatInPrice)
    this.takeAwayPrice = new Money(cp.takeAwayPrice)
    this.deliveryPrice = new Money(cp.deliveryPrice || { centAmount: 0, currencyCode: 'GBP' })
    this.eatInTax = new TaxRate(cp.eatInTax)
    this.takeAwayTax = new TaxRate(cp.takeAwayTax || 0)
    this.deliveryTax = new TaxRate(cp.deliveryTax || 0)
    this.eatInClubPret = new Money(cp.eatInClubPret || { centAmount: 0, currencyCode: 'GBP' })
    this.takeAwayClubPret = new Money(cp.takeAwayClubPret || { centAmount: 0, currencyCode: 'GBP' })
  }

  toDto(label: MultilangString): ChannelPriceDto {
    return {
      channelLabel: label.toDto(),
      channelName: this.channelName,
      eatInPrice: this.eatInPrice,
      takeAwayPrice: this.takeAwayPrice,
      deliveryPrice: this.deliveryPrice,
      eatInTax: this.eatInTax.getValue(),
      takeAwayTax: this.takeAwayTax?.getValue(),
      deliveryTax: this.deliveryTax?.getValue(),
      eatInClubPret: this.eatInClubPret,
      takeAwayClubPret: this.takeAwayClubPret,
    }
  }

  static fromDto(dto: UpdateChannelPriceDto): ChannelPrice {
    return new ChannelPrice({
      channelName: dto.channelName,
      eatInPrice: new Money(dto.eatInPrice),
      eatInTax: new TaxRate(dto.eatInTax),
      takeAwayPrice: new Money(dto.takeAwayPrice),
      takeAwayTax: new TaxRate(dto.takeAwayTax || 0),
      deliveryPrice: new Money(dto.deliveryPrice),
      deliveryTax: new TaxRate(dto.deliveryTax || 0),
      eatInClubPret: new Money(dto.eatInClubPret),
      takeAwayClubPret: new Money(dto.takeAwayClubPret),
    })
  }
}
