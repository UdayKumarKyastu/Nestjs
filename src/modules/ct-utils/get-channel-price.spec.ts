import { Channel } from '@commercetools/platform-sdk'

import { Currency } from '../../shared/model/currency'

import { mapPricesToChannelPriceDto } from './get-channel-price'

const obj: any = {
  id: '8ee0a33e-0b6b-4d0a-9e9b-477f76897035',
  value: {
    type: 'centPrecision',
    currencyCode: Currency.GBP,
    centAmount: 189,
    fractionDigits: 2,
  },
}

const mockedChannels: Channel[] = [
  {
    id: 'd4ef0ac9-e9fe-4a9a-8865-4fdeafdc3043',
    version: 1,
    createdAt: '2021-07-28T12:43:45.548Z',
    lastModifiedAt: '2021-07-28T12:43:45.548Z',
    key: 'uk_london',
    roles: ['ProductDistribution'],
    name: { en: 'UK London' },
  },
  {
    id: 'd4ef0ac9-e9fe-4a9a-8865-4fdeafdc3043',
    version: 1,
    createdAt: '2021-07-28T12:43:45.548Z',
    lastModifiedAt: '2021-07-28T12:43:45.548Z',
    key: 'uk_core',
    roles: ['ProductDistribution'],
    name: { en: 'UK Core' },
  },
  {
    id: 'd4ef0ac9-e9fe-4a9a-8865-4fdeafdc3043',
    version: 1,
    createdAt: '2021-07-28T12:43:45.548Z',
    lastModifiedAt: '2021-07-28T12:43:45.548Z',
    key: 'uk_trial',
    roles: ['ProductDistribution'],
    name: { en: 'UK Trial' },
  },
]

describe('mapPricesToChannelPriceDto', () => {
  it('should have correct takeAwayPrice', () => {
    const result = mapPricesToChannelPriceDto(
      [{ ...obj, channel: { obj: { key: 'uk_london' } } }],
      mockedChannels,
      'UK',
    )

    expect(result[0].takeAwayPrice).toMatchInlineSnapshot(`
      Object {
        "centAmount": 0,
        "currencyCode": "GBP",
      }
    `)
  })

  it('return all channels with empty values if prices are not provided', () => {
    const result = mapPricesToChannelPriceDto([obj], mockedChannels, 'UK')

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "channelLabel": Object {
            "en-GB": "UK London",
            "en-HK": "",
            "en-US": "",
            "fr-FR": "",
            "zh-HK": "",
          },
          "channelName": "uk_london",
          "deliveryPrice": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "deliveryTax": 0,
          "eatInClubPret": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "eatInPrice": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "eatInTax": 0,
          "takeAwayClubPret": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "takeAwayPrice": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "takeAwayTax": 0,
        },
        Object {
          "channelLabel": Object {
            "en-GB": "UK Core",
            "en-HK": "",
            "en-US": "",
            "fr-FR": "",
            "zh-HK": "",
          },
          "channelName": "uk_core",
          "deliveryPrice": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "deliveryTax": 0,
          "eatInClubPret": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "eatInPrice": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "eatInTax": 0,
          "takeAwayClubPret": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "takeAwayPrice": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "takeAwayTax": 0,
        },
        Object {
          "channelLabel": Object {
            "en-GB": "UK Trial",
            "en-HK": "",
            "en-US": "",
            "fr-FR": "",
            "zh-HK": "",
          },
          "channelName": "uk_trial",
          "deliveryPrice": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "deliveryTax": 0,
          "eatInClubPret": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "eatInPrice": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "eatInTax": 0,
          "takeAwayClubPret": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "takeAwayPrice": Object {
            "centAmount": 0,
            "currencyCode": "GBP",
          },
          "takeAwayTax": 0,
        },
      ]
    `)
  })

  it.each(['uk_london', 'uk_core', 'uk_trial'])('maps %s to channelName', (key) => {
    const channelId = mockedChannels.find((channel) => channel.key === key)!.id
    const result = mapPricesToChannelPriceDto(
      [
        {
          ...obj,
          custom: { fields: { eatInPrice: { centAmount: 1000 } } },
          channel: { id: channelId, obj: { key } },
        },
      ],
      mockedChannels,
      'UK',
    )
    const item = result.find((item) => item.channelName === key)
    expect(item?.channelName).toEqual(key)
    expect(item?.eatInPrice.centAmount).toEqual(1000)
  })
})
