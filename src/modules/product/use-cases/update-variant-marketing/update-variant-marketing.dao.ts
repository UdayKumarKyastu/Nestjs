import { BadRequestException, Injectable } from '@nestjs/common'
import { ProductUpdateAction } from '@commercetools/platform-sdk'
import { ClientResponse } from '@commercetools/platform-sdk/dist/generated/shared/utils/common-types'

import { CommercetoolsContext } from '../../../commercetools/commercetools-context'

@Injectable()
export class UpdateVariantMarketingDao {
  constructor(private readonly _ctContext: CommercetoolsContext) {}

  async updateVariantMarketing(
    masterVariantSku: string,
    currentProductVersion: number,
    actions: ProductUpdateAction[],
  ): Promise<void> {
    try {
      await this._ctContext.products
        .withKey({ key: masterVariantSku })
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
