import { Inject, Injectable } from '@nestjs/common'
import { Channel } from '@commercetools/platform-sdk'

import { CommercetoolsContext } from '../commercetools/commercetools-context'

export interface IPricingDao {
  getPricingChannelsByKeys(countryCode: string[]): Promise<Channel[]>
}

@Injectable()
export class PricingDao implements IPricingDao {
  constructor(@Inject(CommercetoolsContext) private readonly _ctContext: CommercetoolsContext) {}

  getPricingChannelsByKeys(keys: string[]): Promise<Channel[]> {
    return this._ctContext.channels
      .withId({ ID: '' })
      .get({
        queryArgs: {
          limit: 500,
          where: `key in (${keys.map((key) => `"${key}"`).join(',')})`,
        },
      })
      .execute()
      .then((c) => (c.body as any).results as Channel[])
      .then((channels) => channels)
  }
}
