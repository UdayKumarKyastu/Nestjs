import { LocalizedString, ProductVariant } from '@commercetools/platform-sdk'
import { ProductUpdateAction, ProductSetPricesAction } from '@commercetools/platform-sdk'
import { pickBy, isBoolean, isString } from 'lodash'

import { VariantReviewStatus } from '../../product/logic/review-status/models/variant-review-status'
import { STATUS_TYPES } from '../../product/logic/review-status/models/status-types'
import { ProductGroup } from '../../../shared/model/product-group'
import { CtAttributesResolver } from '../../ct-utils/get-attribute-value'
import { DescriptionAttribute } from '../../product-attributes/common-variant-attributes/description-attribute'
import { VariantNameAttribute } from '../../product-attributes/barista-variant-attributes/variant-name-attribute'
import { UpdateVariantPricingDto } from '../../product/use-cases/update-variant-prices/update-variant-pricing.dto'
import { UpdateChannelPriceDto } from '../../../shared/dto/channel-price.dto'
import { MoneyDto } from '../../../shared/dto/money.dto'
import { primitiveMarketingFields } from '../../product/logic/review-status/review-status-generator/variant-review-status-generator'
import { CountryCode } from '../../../shared/model/country-code'
import { ReviewStatusCounter } from '../../product/logic/review-status/review-status-counter/review-status-counter'
import { getAttributeByDtoKey } from '../../product-attributes/get-attribute-by-dto-key'
import { FieldStatus } from '../../product/logic/review-status/models/field-status'

interface CustomPriceFields {
  eatInPrice: MoneyDto
  eatInTax: number
  takeAwayTax?: number
  deliveryPrice: MoneyDto
  deliveryTax?: number
  takeAwayClubPret: MoneyDto
  eatInClubPret: MoneyDto
}

export class VariantChangesReverter {
  liveVariant: ProductVariant
  stagedVariant: ProductVariant
  getStagedAttributeValue
  getLiveAttributeValue

  constructor(
    private readonly reviewStatuses: VariantReviewStatus,
    private readonly product: ProductGroup,
    private readonly variantSku: string,
  ) {
    this.liveVariant = this.product!.getVariantBySkuOrThrow(this.variantSku)
    this.stagedVariant = this.product!.getStagedVariant(this.variantSku)!
    this.getStagedAttributeValue = CtAttributesResolver.constructAttributeValueGetter(
      this.stagedVariant.attributes!,
    )
    this.getLiveAttributeValue = CtAttributesResolver.constructAttributeValueGetter(
      this.liveVariant.attributes!,
    )
  }

  private getVariantPricingDto(): UpdateVariantPricingDto {
    return {
      prices: (this.stagedVariant.prices || []).map((price) => {
        const livePrice = (this.liveVariant.prices || []).find(
          (livePrice) => livePrice.channel?.obj?.id === price.channel?.obj?.id,
        )!

        const newPrice: UpdateChannelPriceDto = {
          channelName: price.channel!.obj!.key,
          takeAwayPrice: price.value as MoneyDto,
          eatInPrice: price.custom?.fields.eatInPrice,
          eatInTax: price.custom?.fields.eatInTax,
          takeAwayTax: price.custom?.fields.takeAwayTax || 0,
          deliveryPrice: price.custom?.fields.deliveryPrice,
          deliveryTax: price.custom?.fields.deliveryTax || 0,
          takeAwayClubPret: price.custom?.fields.takeAwayClubPret,
          eatInClubPret: price.custom?.fields.eatInClubPret,
        }

        const eatInPriceStatus = this.reviewStatuses.prices.find(
          ({ value }) =>
            value.field === 'eatInPrice' && value.channelName === price.channel?.obj?.key,
        )?.status

        if (eatInPriceStatus === STATUS_TYPES.rejected) {
          newPrice.eatInPrice = livePrice.custom?.fields.eatInPrice
        }

        const takeAwayPriceStatus = this.reviewStatuses.prices.find(
          ({ value }) =>
            value.field === 'takeAwayPrice' && value.channelName === price.channel?.obj?.key,
        )?.status

        if (takeAwayPriceStatus === STATUS_TYPES.rejected) {
          newPrice.takeAwayPrice = livePrice.value as MoneyDto
        }

        const deliveryPriceStatus = this.reviewStatuses.prices.find(
          ({ value }) =>
            value.field === 'deliveryPrice' && value.channelName === price.channel?.obj?.key,
        )?.status

        if (deliveryPriceStatus === STATUS_TYPES.rejected) {
          newPrice.deliveryPrice = livePrice.custom?.fields.deliveryPrice
        }

        const eatInClubPretStatus = this.reviewStatuses.prices.find(
          ({ value }) =>
            value.field === 'eatInClubPret' && value.channelName === price.channel?.obj?.key,
        )?.status

        if (eatInClubPretStatus === STATUS_TYPES.rejected) {
          newPrice.eatInClubPret = livePrice.custom?.fields.eatInClubPret
        }

        const takeAwayClubPretPriceStatus = this.reviewStatuses.prices.find(
          ({ value }) =>
            value.field === 'takeAwayClubPret' && value.channelName === price.channel?.obj?.key,
        )?.status

        if (takeAwayClubPretPriceStatus === STATUS_TYPES.rejected) {
          newPrice.takeAwayClubPret = livePrice.custom?.fields.takeAwayClubPret
        }

        const eatInTaxStatus = this.reviewStatuses.prices.find(
          ({ value }) =>
            value.field === 'eatInTax' && value.channelName === price.channel?.obj?.key,
        )?.status

        if (eatInTaxStatus === STATUS_TYPES.rejected) {
          newPrice.eatInTax = livePrice.custom?.fields.eatInTax
        }

        const takeAwayTaxStatus = this.reviewStatuses.prices.find(
          ({ value }) =>
            value.field === 'takeAwayTax' && value.channelName === price.channel?.obj?.key,
        )?.status

        if (takeAwayTaxStatus === STATUS_TYPES.rejected) {
          newPrice.takeAwayTax = livePrice.custom?.fields.takeAwayTax
        }

        const deliveryTaxStatus = this.reviewStatuses.prices.find(
          ({ value }) =>
            value.field === 'deliveryTax' && value.channelName === price.channel?.obj?.key,
        )?.status

        if (deliveryTaxStatus === STATUS_TYPES.rejected) {
          newPrice.deliveryTax = livePrice.custom?.fields.deliveryTax
        }

        return newPrice
      }),
    }
  }

  private getVariantPricingActions() {
    const countryCode = this.product
      .getMasterVariant()
      .attributes?.find((attr) => attr.name === 'country')?.value

    const variantPricingDto = this.getVariantPricingDto()

    const action: ProductSetPricesAction = {
      action: 'setPrices',
      sku: this.variantSku,
      prices: variantPricingDto.prices.map((price) => {
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

    return action
  }

  private getVariantNameActions() {
    const variantNameActions: ProductUpdateAction[] = []
    const updatedProductName = this.product.getProductGroupName('staged').toPersistence()

    Object.entries(this.reviewStatuses?.marketing.name || {}).forEach(([key, value]) => {
      if (value.status === STATUS_TYPES.rejected) {
        updatedProductName[key] = this.product.getProductGroupName('current').toPersistence()[key]
      }
    })

    const productGroupActions: ProductUpdateAction[] = [
      {
        action: 'changeName',
        name: updatedProductName,
      },
    ]

    const isMasterVariant = this.product.getMasterVariant().sku === this.variantSku

    if (this.product.isBaristaType()) {
      const updatedName = this.getStagedAttributeValue(VariantNameAttribute) as LocalizedString

      Object.entries(this.reviewStatuses?.marketing.name || {}).forEach(([key, value]) => {
        if (value.status === STATUS_TYPES.rejected) {
          updatedName[key] = (this.getLiveAttributeValue(VariantNameAttribute) as LocalizedString)[
            key
          ]
        }
      })

      const baristaVariantActions: ProductUpdateAction[] = [
        {
          action: 'setAttribute',
          name: 'variantName',
          sku: this.variantSku,
          value: updatedName,
        },
      ]
      variantNameActions.push(...baristaVariantActions)

      if (isMasterVariant) {
        variantNameActions.push(...productGroupActions)
      }
    } else {
      variantNameActions.push(...productGroupActions)
    }

    return variantNameActions
  }

  private getVariantDescriptionActions(): ProductUpdateAction[] {
    const updatedDescription = (this.getStagedAttributeValue(DescriptionAttribute) ||
      {}) as LocalizedString

    Object.entries(this.reviewStatuses?.marketing.description || {}).forEach(([key, value]) => {
      if (value.status === STATUS_TYPES.rejected) {
        updatedDescription[key] = (
          this.getLiveAttributeValue(DescriptionAttribute) as LocalizedString
        )[key]
      }
    })

    return [
      {
        action: 'setAttribute',
        name: 'description',
        sku: this.variantSku,
        value: updatedDescription,
      },
    ]
  }

  getActionsToRevert() {
    const actions: ProductUpdateAction[] = []

    const availabilityStatuses = pickBy(this.reviewStatuses?.marketing, (value, key) =>
      primitiveMarketingFields.includes(key),
    )
    const flatStatuses: { [key: string]: FieldStatus } = {
      ...(availabilityStatuses || {}),
      ...(this.reviewStatuses?.labelling || {}),
      ...(this.reviewStatuses?.reporting || {}),
      ...(this.reviewStatuses?.attributes || {}),
    }

    if (this.reviewStatuses.marketing?.howToDisplay) {
      flatStatuses.howToDisplay = this.reviewStatuses.marketing?.howToDisplay
    }

    Object.entries(flatStatuses).map(([key, value]) => {
      if (value.status === STATUS_TYPES.rejected) {
        const attributeName = getAttributeByDtoKey(key)
        const stagedAttributeValue = this.getStagedAttributeValue(attributeName)

        let attributeValue = this.getLiveAttributeValue(attributeName)

        if (attributeValue === null) {
          if (isString(stagedAttributeValue)) {
            attributeValue = ''
          }

          if (isBoolean(stagedAttributeValue)) {
            if (
              attributeName === 'includeNutritionalInformationOnLabel' ||
              attributeName === 'includeAverageWeightOnLabel'
            ) {
              attributeValue = true
            } else {
              attributeValue = false
            }
          }
        }

        actions.push({
          action: 'setAttribute',
          sku: this.variantSku,
          name: attributeName,
          value: attributeValue,
        })
      }
    })

    if (this.reviewStatuses?.marketing?.isDisplayed?.status === STATUS_TYPES.rejected) {
      actions.push({
        action: 'setAttribute',
        name: 'displayAsNew',
        sku: this.variantSku,
        value: this.getLiveAttributeValue('displayAsNew'),
      })
    }

    const isNameRejected = Object.values(this.reviewStatuses.marketing.name || {}).some(
      ({ status }) => status === STATUS_TYPES.rejected,
    )

    if (isNameRejected) {
      actions.push(...this.getVariantNameActions())
    }

    const isDescriptionRejected = Object.values(
      this.reviewStatuses.marketing.description || {},
    ).some(({ status }) => status === STATUS_TYPES.rejected)

    if (isDescriptionRejected) {
      actions.push(...this.getVariantDescriptionActions())
    }

    if (ReviewStatusCounter.countPricingStatuses(this.reviewStatuses).rejected > 0) {
      actions.push(this.getVariantPricingActions())
    }

    return actions
  }
}
