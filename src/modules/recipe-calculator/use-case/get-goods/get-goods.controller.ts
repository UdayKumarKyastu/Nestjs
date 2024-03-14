import { Controller, Get, Query } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

import { GoodsDto, GoodSearchResultDto } from './get-goods.dto'
import { GetGoodsService } from './get-goods.service'
import { SearchProperties } from './search-properties'

@Controller('/v1/recipe-calculator')
export class GetGoodsController {
  constructor(private readonly _getGoodsService: GetGoodsService) {}

  @ApiResponse({
    type: GoodSearchResultDto,
    isArray: true,
  })
  @Get('/goods')
  public async getGoods(
    @Query('query') query: string,
    @Query('propertyName') propertyName: SearchProperties,
  ): Promise<(GoodSearchResultDto | null)[]> {
    return this._getGoodsService.getGoods(query, propertyName)
  }

  @ApiResponse({
    type: GoodsDto,
    isArray: true,
  })
  @Get('/goods-details')
  public async getGoodsDetails(@Query('id') id: string): Promise<(GoodsDto | null)[]> {
    const goodsIds = id.split(',')

    return this._getGoodsService.getDetailedGoods(goodsIds)
  }
}
