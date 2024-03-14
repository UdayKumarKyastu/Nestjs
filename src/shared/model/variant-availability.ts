import { ProductVariant } from '@commercetools/platform-sdk'

import { Time } from '../../shared/Time'
import { AvailabilityDto } from '../dto/availability.dto'
import { CommonProductVariantAttributes } from '../../modules/product-attributes/common-product-variant-attributes'
import { UpdateVariantMarketingDto } from '../../modules/product/use-cases/update-variant-marketing/update-variant-marketing.dto'
import { VisibleOnDeliveryWebsiteAttribute } from '../../modules/product-attributes/common-variant-attributes/visible-on-delivery-website-attribute'
import { VisibleAttribute } from '../../modules/product-attributes/common-variant-attributes/visible-attribute'
import { AvailableForPretDeliversAttribute } from '../../modules/product-attributes/common-variant-attributes/available-for-pret-delivers-attribute'
import { AvailableForOutpostsAttribute } from '../../modules/product-attributes/common-variant-attributes/available-for-outposts-attribute'
import { AvailableForCollectionAttribute } from '../../modules/product-attributes/common-variant-attributes/available-for-collection-attribute'
import { ChefSpecialAttribute } from '../../modules/product-attributes/common-variant-attributes/chef-special-attribute'
import { PretDeliversAvailableForLunchAttribute } from '../../modules/product-attributes/common-variant-attributes/pret-delivers-available-for-lunch-attribute'
import { PretDeliversAvailableAllDayAttribute } from '../../modules/product-attributes/common-variant-attributes/pret-delivers-available-all-day-attribute'
import { DisplayAsNewAttribute } from '../../modules/product-attributes/common-variant-attributes/display-as-new-attribute'
import { NewUntilAttribute } from '../../modules/product-attributes/common-variant-attributes/new-until-attribute'

import { LiveSchedule } from './live-schedule'
import { DisplayAsNewFactory, DisplayAsNotNew, DisplayedAsNew } from './display-as-new'

export interface SerializedVariantAvailabilityFields {
  isLive: boolean
  visibleOnDeliveryWebsite: boolean
  availableForPretDelivers: boolean
  availableForClickAndCollect: boolean
  availableForOutposts: boolean
  isChefsSpecial: boolean
  displayAsNew: {
    isDisplayed: boolean
    until: string | null
  }
  availableForLunch: boolean
  availableAllDay: boolean
}

/**
 * @deprecated
 */
export class VariantAvailability {
  isLive!: VisibleAttribute
  visibleOnDeliveryWebsite!: VisibleOnDeliveryWebsiteAttribute
  availableForPretDelivers!: AvailableForPretDeliversAttribute
  availableForClickAndCollect!: AvailableForCollectionAttribute
  availableForOutposts!: AvailableForOutpostsAttribute
  isChefsSpecial!: ChefSpecialAttribute
  displayAsNew!: DisplayedAsNew | DisplayAsNotNew
  availableForLunch!: PretDeliversAvailableForLunchAttribute
  availableAllDay!: PretDeliversAvailableAllDayAttribute

  constructor(rawPayload: SerializedVariantAvailabilityFields) {
    const {
      availableAllDay,
      availableForLunch,
      availableForOutposts,
      availableForClickAndCollect,
      availableForPretDelivers,
      visibleOnDeliveryWebsite,
      isLive,
      isChefsSpecial,
      displayAsNew,
    } = rawPayload

    this.isLive = new VisibleAttribute(isLive)
    this.visibleOnDeliveryWebsite = new VisibleOnDeliveryWebsiteAttribute(visibleOnDeliveryWebsite)
    this.availableAllDay = new PretDeliversAvailableAllDayAttribute(availableAllDay)
    this.isChefsSpecial = new ChefSpecialAttribute(isChefsSpecial)
    this.availableForLunch = new PretDeliversAvailableForLunchAttribute(availableForLunch)
    this.availableForOutposts = new AvailableForOutpostsAttribute(availableForOutposts)
    this.availableForClickAndCollect = new AvailableForCollectionAttribute(
      availableForClickAndCollect,
    )
    this.availableForPretDelivers = new AvailableForPretDeliversAttribute(availableForPretDelivers)
    this.displayAsNew = DisplayAsNewFactory.create(
      new DisplayAsNewAttribute(displayAsNew.isDisplayed),
      displayAsNew.until ? new NewUntilAttribute(displayAsNew.until) : null,
    )
  }

  static fromCommonAttributes(attributes: CommonProductVariantAttributes) {
    return new VariantAvailability({
      isLive: attributes.visible.value,
      visibleOnDeliveryWebsite: attributes.visibleOnDeliveryWebsite.value,
      availableForPretDelivers: attributes.availableForPretDelivers.value,
      availableForClickAndCollect: attributes.availableForCollection.value,
      availableForOutposts: attributes.availableForOutposts.value,
      isChefsSpecial: attributes.chefSpecial.value,
      displayAsNew: DisplayAsNewFactory.create(attributes.displayAsNew, attributes.newUntil),
      availableForLunch: attributes.availableForLunch.value,
      availableAllDay: attributes.availableAllDay.value,
    })
  }

  static fromCtVariant(variant: Pick<ProductVariant, 'attributes'>) {
    const commonAttrs = new CommonProductVariantAttributes(variant.attributes!)

    return this.fromCommonAttributes(commonAttrs)
  }

  static fromVariantAvailability(rawData: SerializedVariantAvailabilityFields) {
    return new VariantAvailability({
      displayAsNew: rawData.displayAsNew,
      availableForLunch: rawData.availableForLunch,
      availableAllDay: rawData.availableAllDay,
      availableForPretDelivers: rawData.availableForPretDelivers,
      availableForClickAndCollect: rawData.availableForClickAndCollect,
      availableForOutposts: rawData.availableForOutposts,
      isChefsSpecial: rawData.isChefsSpecial,
      isLive: rawData.isLive,
      visibleOnDeliveryWebsite: rawData.visibleOnDeliveryWebsite,
    })
  }

  static fromUpdateVariantMarketingDto(dto: UpdateVariantMarketingDto): VariantAvailability {
    const instance = new VariantAvailability({
      isLive: dto.isLive,
      visibleOnDeliveryWebsite: dto.visibleOnDeliveryWebsite,
      availableForPretDelivers: dto.availableForPretDelivers,
      availableForClickAndCollect: dto.availableForClickAndCollect,
      availableForOutposts: dto.availableForOutposts,
      isChefsSpecial: dto.isChefsSpecial,
      displayAsNew: dto.displayAsNew.isDisplayed
        ? new DisplayedAsNew(Time.buildStringDate(dto.displayAsNew.until)!)
        : new DisplayAsNotNew(),
      availableForLunch: dto.availableForLunch,
      availableAllDay: dto.availableAllDay,
    })

    return instance
  }

  static fromAvailabilityDto(dto: AvailabilityDto): VariantAvailability {
    return new VariantAvailability({
      isLive: dto.isLive,
      visibleOnDeliveryWebsite: dto.visibleOnDeliveryWebsite,
      availableForPretDelivers: dto.availableForPretDelivers,
      availableForClickAndCollect: dto.availableForClickAndCollect,
      availableForOutposts: dto.availableForOutposts,
      isChefsSpecial: dto.isChefsSpecial,
      displayAsNew: {
        isDisplayed: dto.displayAsNew.isDisplayed,
        until: dto.displayAsNew.until,
      },
      availableForLunch: dto.availableForLunch,
      availableAllDay: dto.availableAllDay,
    })
  }

  toDto(liveSchedule: LiveSchedule): AvailabilityDto {
    return {
      isLive: this.isLive.value,
      visibleOnDeliveryWebsite: this.visibleOnDeliveryWebsite.value,
      availableForPretDelivers: this.availableForPretDelivers.value,
      availableForClickAndCollect: this.availableForClickAndCollect.value,
      availableForOutposts: this.availableForOutposts.value,
      isChefsSpecial: this.isChefsSpecial.value,
      displayAsNew: this.displayAsNew,
      liveSchedule: liveSchedule,
      availableForLunch: this.availableForLunch.value,
      availableAllDay: this.availableAllDay.value,
    }
  }

  serialize(): SerializedVariantAvailabilityFields {
    return {
      isLive: this.isLive.value,
      visibleOnDeliveryWebsite: this.visibleOnDeliveryWebsite.value,
      availableAllDay: this.availableAllDay.value,
      availableForClickAndCollect: this.availableForClickAndCollect.value,
      availableForOutposts: this.availableForOutposts.value,
      availableForLunch: this.availableForLunch.value,
      availableForPretDelivers: this.availableForPretDelivers.value,
      displayAsNew: this.displayAsNew,
      isChefsSpecial: this.isChefsSpecial.value,
    }
  }
}
