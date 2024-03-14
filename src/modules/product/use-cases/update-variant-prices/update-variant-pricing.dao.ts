import { Injectable } from '@nestjs/common'
import { ProductSetPricesAction } from '@commercetools/platform-sdk'

import { CommercetoolsContext } from '../../../commercetools/commercetools-context'
import { CountryCode } from '../../../../shared/model/country-code'
import { MoneyDto } from '../../../..//shared/dto/money.dto'

import { UpdateVariantPricingDto } from './update-variant-pricing.dto'

interface CustomPriceFields {
  eatInPrice: MoneyDto
  deliveryPrice: MoneyDto
  takeAwayClubPret: MoneyDto
  eatInClubPret: MoneyDto
  eatInTax: number
  takeAwayTax?: number
  deliveryTax?: number
}

@Injectable()
export class UpdateVariantPricingDao {
  constructor(private readonly _ctContext: CommercetoolsContext) {}

  async updateVariantPricing(
    masterSku: string,
    variantSku: string,
    version: number,
    dto: UpdateVariantPricingDto,
    countryCode: CountryCode,
  ) {
    const action: ProductSetPricesAction = {
      action: 'setPrices',
      sku: variantSku,
      prices: dto.prices.map((price) => {
        const customFields: CustomPriceFields = {
          eatInPrice: price.eatInPrice,
          eatInTax: price.eatInTax,
          deliveryPrice: price.deliveryPrice,
          deliveryTax: price.deliveryTax,
          takeAwayClubPret: price.takeAwayClubPret,
          eatInClubPret: price.eatInClubPret,
        }

        if (countryCode !== CountryCode.UK) {
          customFields.takeAwayTax = price.takeAwayTax
        }

        return {
          value: price.takeAwayPrice,
          channel: {
            key: price.channelName,
            typeId: 'channel',
          },
          custom: {
            type: {
              key: 'additionalPriceTax',
              typeId: 'type',
            },
            fields: {
              ...customFields,
            },
          },
        }
      }),
    }

    return this._ctContext.products
      .withKey({
        key: masterSku,
      })
      .post({
        body: {
          version,
          actions: [action],
        },
      })
      .execute()
  }
}
