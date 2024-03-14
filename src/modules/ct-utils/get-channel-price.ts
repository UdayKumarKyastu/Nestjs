import { Channel, Price } from '@commercetools/platform-sdk'

import { ChannelPrice } from '../..//shared/model/channel-price'
import { ChannelPriceDto } from '../../shared/dto/channel-price.dto'
import { Currency } from '../../shared/model/currency'
import { MultilangString } from '../product/logic/models/multilang-string'
import { CountryCode } from '../../shared/model/country-code'

const DefaultCurrencies: { [key in keyof typeof CountryCode]: Currency } = {
  [CountryCode.UK]: Currency.GBP,
  [CountryCode.US]: Currency.USD,
  [CountryCode.FR]: Currency.EUR,
  [CountryCode.HK]: Currency.HKD,
}

export function mapPricesToChannelPriceDto(
  prices: Price[] = [],
  pricingChannels: Channel[],
  countryCode: keyof typeof CountryCode,
): ChannelPriceDto[] {
  const defaultCurrency = DefaultCurrencies[countryCode]
  const items: ChannelPriceDto[] = pricingChannels.map((channel) => {
    const price = prices.find((price) => price.channel?.id === channel.id) || ({} as Price)
    const customFields = price?.custom?.fields ?? {}

    return {
      channelName: channel.key,
      channelLabel: new MultilangString({ 'en-GB': channel.name!.en }).toDto(),
      eatInPrice: {
        currencyCode: (customFields.eatInPrice?.currencyCode as Currency) ?? defaultCurrency,
        centAmount: customFields.eatInPrice?.centAmount ?? 0,
      },
      eatInTax: customFields.eatInTax ?? 0,
      eatInClubPret: {
        currencyCode: (customFields.eatInClubPret?.currencyCode as Currency) ?? defaultCurrency,
        centAmount: customFields.eatInClubPret?.centAmount ?? 0,
      },
      takeAwayPrice: {
        currencyCode: (price?.value?.currencyCode as Currency) ?? defaultCurrency,
        centAmount: price?.value?.centAmount ?? 0,
      },
      takeAwayTax: customFields.takeAwayTax ?? 0,
      takeAwayClubPret: {
        currencyCode: (customFields.takeAwayClubPret?.currencyCode as Currency) ?? defaultCurrency,
        centAmount: customFields.takeAwayClubPret?.centAmount ?? 0,
      },
      deliveryPrice: {
        currencyCode: (customFields.deliveryPrice?.currencyCode as Currency) ?? defaultCurrency,
        centAmount: customFields.deliveryPrice?.centAmount ?? 0,
      },
      deliveryTax: customFields.deliveryTax ?? 0,
    }
  })

  return items
}

export function mapChannelsToCtPrices(pricingChannels: ChannelPrice[]): Price[] {
  const ctPrices: Price[] = pricingChannels.map((channel) => ({
    value: {
      type: 'centPrecision',
      currencyCode: channel.takeAwayPrice.currencyCode,
      centAmount: channel.takeAwayPrice.centAmount,
      fractionDigits: 2,
    },
    id: '',
    channel: {
      typeId: 'channel',
      id: channel.channelName,
    },
    custom: {
      type: {
        typeId: 'type',
        id: '',
      },
      fields: {
        deliveryPrice: {
          centAmount: channel.deliveryPrice?.centAmount ?? 0,
        },
        eatInPrice: {
          centAmount: channel.eatInPrice?.centAmount ?? 0,
        },
        eatInClubPret: {
          centAmount: channel.eatInClubPret?.centAmount ?? 0,
        },
        takeAwayClubPret: {
          centAmount: channel.takeAwayClubPret?.centAmount ?? 0,
        },
        deliveryTax: channel.deliveryTax?.tax ?? 0,
        eatInTax: channel.eatInTax.tax,
      },
    },
  }))

  return ctPrices
}
