import { BadRequestException, Injectable } from '@nestjs/common'
import { ProductUpdateAction } from '@commercetools/platform-sdk'
import { ClientResponse } from '@commercetools/platform-sdk/dist/generated/shared/utils/common-types'

import { CommercetoolsContext } from '../../../commercetools/commercetools-context'
import { VariantLabelling } from '../../../../shared/model/variant-labelling'
import { IncludeNutritionalInformationOnLabelAttribute } from '../../../product-attributes/food-variant-attributes/include-nutritional-information-on-label-attribute'
import { CanBeCookedInTurboChefAttribute } from '../../../product-attributes/common-variant-attributes/can-be-cooked-in-turbo-chef-attribute'
import { UseByTurboChefAttribute } from '../../../product-attributes/common-variant-attributes/use-by-turbo-chef-attribute'
import { SellByTurboChefAttribute } from '../../../product-attributes/common-variant-attributes/sell-by-turbo-chef-attribute'
import { ProductServesAttribute } from '../../../product-attributes/common-variant-attributes/product-serves-attribute'

import { UpdateVariantLabellingDto } from './update-variant-labelling.dto'

@Injectable()
export class UpdateVariantLabellingDao {
  constructor(private readonly _ctContext: CommercetoolsContext) {}

  private resolveActions(
    variantSku: string,
    variantLabellingDto: UpdateVariantLabellingDto,
    currentLabelling: VariantLabelling,
  ): ProductUpdateAction[] {
    const actions: ProductUpdateAction[] = []

    if (!(!currentLabelling.storageConditions && !variantLabellingDto.storageConditions)) {
      actions.push({
        action: 'setAttribute',
        name: 'storageConditions',
        sku: variantSku,
        value: variantLabellingDto.storageConditions,
      })
    }

    if (
      currentLabelling.includeAverageWeightOnLabel ||
      variantLabellingDto.includeAverageWeightOnLabel
    ) {
      actions.push({
        action: 'setAttribute',
        name: 'includeAverageWeightOnLabel',
        sku: variantSku,
        value: variantLabellingDto.includeAverageWeightOnLabel,
      })
    }

    if (
      !(
        !currentLabelling.countryOfOriginDescription &&
        !variantLabellingDto.countryOfOriginDescription
      )
    ) {
      actions.push({
        action: 'setAttribute',
        name: 'countryOfOriginDescription',
        sku: variantSku,
        value: variantLabellingDto.countryOfOriginDescription,
      })
    }

    if (!(!currentLabelling.ean13Code && !variantLabellingDto.ean13Code)) {
      actions.push({
        action: 'setAttribute',
        name: 'ean13Code',
        sku: variantSku,
        value: variantLabellingDto.ean13Code,
      })
    }

    if (!(!currentLabelling.useBy && !variantLabellingDto.useBy)) {
      actions.push({
        action: 'setAttribute',
        name: 'useBy',
        sku: variantSku,
        value: variantLabellingDto.useBy,
      })
    }

    if (!(!currentLabelling.sellBy && !variantLabellingDto.sellBy)) {
      actions.push({
        action: 'setAttribute',
        name: 'sellBy',
        sku: variantSku,
        value: variantLabellingDto.sellBy,
      })
    }

    if (!(!currentLabelling.productServes && !variantLabellingDto.productServes)) {
      actions.push({
        action: 'setAttribute',
        name: ProductServesAttribute.COMMERCE_TOOLS_ATTR_NAME,
        sku: variantSku,
        value: variantLabellingDto.productServes,
      })
    }

    if (!(!currentLabelling.legalTitle && !variantLabellingDto.legalTitle)) {
      actions.push({
        action: 'setAttribute',
        name: 'legalTitle',
        sku: variantSku,
        value: variantLabellingDto.legalTitle,
      })
    }

    if (
      currentLabelling.includeNutritionalInformationOnLabel ||
      variantLabellingDto.includeNutritionalInformationOnLabel
    ) {
      actions.push({
        action: 'setAttribute',
        name: IncludeNutritionalInformationOnLabelAttribute.COMMERCE_TOOLS_ATTR_NAME,
        sku: variantSku,
        value: variantLabellingDto.includeNutritionalInformationOnLabel,
      })
    }

    if (currentLabelling.canBeCookedInTurboChef || variantLabellingDto.canBeCookedInTurboChef) {
      actions.push({
        action: 'setAttribute',
        name: CanBeCookedInTurboChefAttribute.COMMERCE_TOOLS_ATTR_NAME,
        sku: variantSku,
        value: variantLabellingDto.canBeCookedInTurboChef,
      })
    }

    if (currentLabelling.sellByTurboChef || variantLabellingDto.sellByTurboChef) {
      actions.push({
        action: 'setAttribute',
        name: SellByTurboChefAttribute.COMMERCE_TOOLS_ATTR_NAME,
        sku: variantSku,
        value: variantLabellingDto.sellByTurboChef,
      })
    }

    if (currentLabelling.useByTurboChef || variantLabellingDto.useByTurboChef) {
      actions.push({
        action: 'setAttribute',
        name: UseByTurboChefAttribute.COMMERCE_TOOLS_ATTR_NAME,
        sku: variantSku,
        value: variantLabellingDto.useByTurboChef,
      })
    }

    return actions
  }

  async updateVariantLabelling(
    masterSku: string,
    variantSku: string,
    currentProductVersion: number,
    dto: UpdateVariantLabellingDto,
    currentLabelling: VariantLabelling,
  ): Promise<void> {
    const actions = this.resolveActions(variantSku, dto, currentLabelling)

    try {
      await this._ctContext.products
        .withKey({ key: masterSku })
        .post({
          body: {
            version: currentProductVersion,
            actions,
          },
        })
        .execute()
    } catch (error) {
      throw new BadRequestException((error as ClientResponse<{ message: string }>)?.body?.message)
    }
  }
}
