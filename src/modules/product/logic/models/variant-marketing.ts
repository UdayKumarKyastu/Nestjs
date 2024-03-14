import { UpdateVariantMarketingDto } from '../../use-cases/update-variant-marketing/update-variant-marketing.dto'
import { DisplayAsNotNew } from '../../../../shared/model/display-as-new'

import { MultilangString, MultiLangStringMockFactory } from './multilang-string'

/**
 * @deprecated Use VariantAvailability
 */
export class VariantMarketing {
  isLive!: boolean
  visibleOnDeliveryWebsite!: boolean
  availableForPretDelivers!: boolean
  availableForClickAndCollect!: boolean
  availableForOutposts!: boolean
  isChefsSpecial!: boolean
  displayAsNew!: UpdateVariantMarketingDto['displayAsNew']
  availableAllDay!: boolean
  name!: MultilangString
  description!: MultilangString
  availableForLunch!: boolean
  // todo dont use dto in model
  howToDisplayKeys!: string[]
}

/**
 * @deprecated Use VariantAvailability
 */
export class VariantMarketingFactory {
  createFromUpdateDto(dto: UpdateVariantMarketingDto): VariantMarketing {
    return {
      availableForLunch: dto.availableForLunch,
      availableAllDay: dto.availableAllDay,
      name: MultilangString.fromDto(dto.name),
      description: MultilangString.fromDto(dto.description),
      availableForClickAndCollect: dto.availableForClickAndCollect,
      availableForOutposts: dto.availableForOutposts,
      availableForPretDelivers: dto.availableForPretDelivers,
      displayAsNew: dto.displayAsNew,
      howToDisplayKeys: dto.howToDisplay,
      isChefsSpecial: dto.isChefsSpecial,
      isLive: dto.isLive,
      visibleOnDeliveryWebsite: dto.visibleOnDeliveryWebsite,
    }
  }

  createMock(): VariantMarketing {
    return {
      availableForLunch: true,
      availableAllDay: true,
      name: MultiLangStringMockFactory.createMultiLangString('name'),
      description: MultiLangStringMockFactory.createMultiLangString('description'),
      availableForClickAndCollect: true,
      availableForOutposts: true,
      availableForPretDelivers: true,
      displayAsNew: new DisplayAsNotNew(),
      howToDisplayKeys: [],
      isChefsSpecial: true,
      isLive: true,
      visibleOnDeliveryWebsite: true,
    }
  }
}
