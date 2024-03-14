import { Injectable } from '@nestjs/common'
import Fuse from 'fuse.js'

import { StarkisService } from '../../../starkis/starkis.service'

import { GoodsDto, GoodSearchResultDto } from './get-goods.dto'
import { SearchProperties } from './search-properties'

@Injectable()
export class GetGoodsService {
  constructor(private readonly _starkisService: StarkisService) {}

  private _propertyNameToPathMatcher(propertyName?: SearchProperties) {
    switch (propertyName) {
      case SearchProperties.hgCode:
        return 'reporting_name'
      case SearchProperties.name:
        return 'goods_name'
      default:
        return null
    }
  }

  async getGoods(query: string, propertyName: SearchProperties): Promise<GoodSearchResultDto[]> {
    if (!propertyName || !query) throw new Error('Missing query or property name from search')

    const pathToSearchBy = this._propertyNameToPathMatcher(propertyName)

    if (!pathToSearchBy) throw new Error(`Search property ${propertyName} is not supported`)

    const res = (await this._starkisService.fetchAllGoods()).data

    const fuse = new Fuse(res, {
      keys: [pathToSearchBy],
      threshold: propertyName === SearchProperties.hgCode ? 0 : 0.5,
    })

    const matchingGoods = fuse.search(query)

    return matchingGoods.map(
      ({ item: { goods_no, external_pret_id, goods_name, last_updated_date } }) => {
        return {
          hgGoodId: external_pret_id,
          id: goods_no.toString(),
          name: goods_name,
          modifiedAt: last_updated_date,
        }
      },
    )
  }

  async getDetailedGoods(goodsIds: string[]): Promise<GoodsDto[]> {
    const goodsWithDetails = await Promise.all(
      goodsIds.map((good) => this._starkisService.fetchDetailedGood(Number(good))),
    )

    return goodsWithDetails.filter(Boolean) as GoodsDto[]
  }
}
