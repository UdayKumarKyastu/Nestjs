import { Inject, Injectable } from '@nestjs/common'
import { Channel } from '@commercetools/platform-sdk'

import { CountryCode } from '../../shared/model/country-code'

import { IPricingDao, PricingDao } from './pricing.dao'

export interface ICanFetchPricingChannelsByCountryCode {
  getPricingChannelsByCountryCode(countryCode: CountryCode): Promise<Channel[]>
}

export const getPricingChannelsKeysByCountryCode = (countryCode: CountryCode) => {
  switch (countryCode) {
    case CountryCode.UK:
      return [
        'uk_core',
        'uk_london',
        'uk_premium',
        'uk_airports',
        'uk_delivery',
        'uk_london_premium',
        // 'uk_trial',
        // 'uk_ps_welcome_back',
        // 'uk_ps_road_chef',
        'uk_marketplace_delivery',
        'uk_veggie_pret_london',
        'uk_veggie_pret_cities',
        // 'uk_ps_lakeside',
        'uk_red_1',
        'uk_red_2',
        'uk_red_3',
        'uk_blue_1',
        'uk_blue_2',
        'uk_blue_3',
        'uk_green_1',
        'uk_green_2',
        'uk_green_3',
        'uk_gold_1',
        'uk_gold_2',
        'uk_gold_3',
        'uk_grey_1',
        'uk_grey_2',
        'uk_grey_3',
        'uk_purple_1',
        'uk_purple_2',
        'uk_purple_3',
        'uk_pink_1',
        'uk_pink_2',
        'uk_pink_3',
        'uk_orange_1',
        'uk_orange_2',
        'uk_orange_3',
        'uk_yellow_1',
        'uk_yellow_2',
        'uk_yellow_3',
      ]
    case CountryCode.US:
      return ['us_nyc', 'us_wdc', 'us_phi']
    case CountryCode.HK:
      return ['hk_core', 'hk_delivery']
    case CountryCode.FR:
      return ['fr_paris', 'fr_la_valle']
    default:
      return []
  }
}

@Injectable()
export class PricingService implements ICanFetchPricingChannelsByCountryCode {
  constructor(@Inject(PricingDao) private readonly _pricingDao: IPricingDao) {}

  async getPricingChannelsByCountryCode(countryCode: CountryCode) {
    const channelsKeys = getPricingChannelsKeysByCountryCode(countryCode)
    const pricingChannels = await this._pricingDao.getPricingChannelsByKeys(channelsKeys)

    return channelsKeys.map((key) => pricingChannels.find((channel) => channel.key === key)!)
  }
}
