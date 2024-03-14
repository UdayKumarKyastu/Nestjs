import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import Decimal from 'decimal.js'
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces'

import { EnvironmentVariables } from '../../configuration/models/environment-variables'
import { SecretManagerService } from '../../configuration/services/secret-manager.service'
import { GoodsDto } from '../recipe-calculator/use-case/get-goods/get-goods.dto'

import { Good, GoodPackPrice, GoodPackSize, Recipe, UnitOfMeasure } from './starkis-response-types'

const DEFAULT_CURRENCY_CODE = 'GBP'

@Injectable()
export class StarkisService {
  constructor(
    private _httpService: HttpService,
    private _configService: ConfigService<EnvironmentVariables>,
    private _secretsProvider: SecretManagerService,
  ) {}

  private async getClientConfig(): Promise<{
    baseUrl: string
    headers: {
      client_id: string
      client_secret: string
    }
  }> {
    const [client_id, client_secret] = await Promise.all([
      this._secretsProvider.getSecretValue('PORTAL_API_STARKIS_CLIENT_ID'),
      this._secretsProvider.getSecretValue('PORTAL_API_STARKIS_CLIENT_SECRET'),
    ])

    return {
      baseUrl: `${this._configService.get('STARKIS_API_URL')}/api/v1/starkis`,
      headers: {
        client_id,
        client_secret,
      },
    }
  }

  async fetchAllGoods(): Promise<AxiosResponse<Good[]>> {
    const { headers, baseUrl } = await this.getClientConfig()

    return lastValueFrom(
      this._httpService.get(`${baseUrl}/goods?country_code=uk`, {
        headers,
      }),
    )
  }

  async fetchAllRecipes(): Promise<AxiosResponse<Recipe[]>> {
    const { headers, baseUrl } = await this.getClientConfig()

    return lastValueFrom(
      this._httpService.get(`${baseUrl}/products?country_code=uk`, {
        headers,
      }),
    )
  }

  async fetchRecipeGoods(productId: number): Promise<AxiosResponse<any[]>> {
    const { headers, baseUrl } = await this.getClientConfig()

    return lastValueFrom(
      this._httpService.get(`${baseUrl}/productRecipesDetails/${productId}?country_code=uk`, {
        headers,
      }),
    )
  }

  async fetchDetailedGood(goodId: number): Promise<GoodsDto | null> {
    const { headers, baseUrl } = await this.getClientConfig()
    const [allUnitsOfMeasurement, good, goodPackSizes, goodPackPrices]: [
      { data: UnitOfMeasure[] },
      { data: Good },
      { data: GoodPackSize[] },
      { data: GoodPackPrice[] },
    ] = await Promise.all([
      lastValueFrom(
        this._httpService.get(`${baseUrl}/unitOfMeasure?country_code=uk`, {
          headers,
        }),
      ),
      lastValueFrom(
        this._httpService.get(`${baseUrl}/goods/${goodId}?country_code=uk`, {
          headers,
        }),
      ),
      lastValueFrom(
        this._httpService.get(`${baseUrl}/goodsPackSize/${goodId}?country_code=uk`, {
          headers,
        }),
      ),
      lastValueFrom(
        this._httpService.get(`${baseUrl}/goodsPackPrice/${goodId}?country_code=uk`, { headers }),
      ),
    ])

    const mainGoodPackSize =
      goodPackSizes.data.find(
        ({ is_in_use, is_main_pack_size }) => is_in_use && is_main_pack_size,
      ) || goodPackSizes.data.find(({ goods_no }) => goods_no === goodId)

    if (!mainGoodPackSize) return null

    const packUnitOfMeasure = allUnitsOfMeasurement.data.find(
      (unit) =>
        unit.unit_id?.toUpperCase() === mainGoodPackSize.unit_id?.toUpperCase() && unit.is_current,
    )

    const packBaseUnitOfMeasure = allUnitsOfMeasurement.data.find(
      (unit) =>
        unit.unit_type_id === packUnitOfMeasure?.unit_type_id &&
        unit.is_current &&
        unit.is_base_unit,
    )

    const packBaseUnitQuantity = new Decimal(mainGoodPackSize.pack_size).times(
      new Decimal(packUnitOfMeasure?.factor || 1),
    )

    const mainGoodPackPrice = goodPackPrices.data.find(
      (packPrice) =>
        packPrice.supplier_no === mainGoodPackSize.supplier_no &&
        packPrice.unit_id?.toUpperCase() === mainGoodPackSize.unit_id?.toUpperCase() &&
        packPrice.pack_size === mainGoodPackSize.pack_size &&
        !packPrice.until_date,
    )

    const costOfPack = mainGoodPackPrice?.pack_price || 0
    const costOfUnit = new Decimal(costOfPack).dividedBy(new Decimal(packBaseUnitQuantity))

    return {
      id: goodId,
      name: good.data.goods_name,
      quantity: 1,
      unitOfMeasurement: packBaseUnitOfMeasure?.unit_id || '',
      cost: {
        centAmount: new Decimal(costOfUnit).times(100).toString(),
        currencyCode: DEFAULT_CURRENCY_CODE,
      },
      modifiedAt: good.data.last_updated_date,
    }
  }
}
