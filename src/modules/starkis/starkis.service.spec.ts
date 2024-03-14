import { HttpModule, HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces'
import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'

import { SecretManagerService } from '../../configuration/services/secret-manager.service'
import { recipeMock } from '../recipe-calculator/mocks/recipe-mock'

import { StarkisService } from './starkis.service'

const mockGood = {
  goods_no: 6065,
  goods_category_no: 76,
  supplier_goods_category_no: 26,
  stock_reporting_category_no: null,
  ordered_by_shop_role_id: 'AMK/KL',
  stock_unit_id: '750g',
  label_unit_id: 'g',
  goods_name: 'Ham',
  is_transferable: true,
  shelf_life_once_opened: 0,
  live_from_date: '2020-06-03T00:00:00Z',
  live_to_date: null,
  enable_order_reminder: false,
  stock_count_type: 'E',
  enable_order_quantity_check: true,
  not_delivered_days_of_week: '       ',
  not_delivered_from_date: '2000-01-01T00:00:00Z',
  not_delivered_to_date: '2020-07-06T00:00:00Z',
  stock_take_frequency: 'W',
  shelf_life_into_shops: 8,
  treat_as_if_in_recipe: false,
  requested_synchronisation_date: '2020-10-02T00:00:00Z',
  is_synchronised: true,
  synchronisation_requested_by: 'PRET\\michaelak',
  actual_synchronisation_date: '2021-12-28T04:30:13Z',
  actual_synchronisation_by: 'PRET\\svc-sql-uka10-agent',
  last_updated_by: 'svc_food_integration_user',
  last_updated_date: '2020-06-23T11:50:46Z',
  reorder_calculation_no: 30,
  delist_waste_type_no: 1,
  reporting_name: 'RM00001072',
}

const goodPackSizes = [
  {
    goods_no: 6065,
    supplier_no: 17,
    unit_id: '750g',
    pack_size: 8.0,
    supplier_product_code: '973016C',
    supplier_sort_order: 0,
    allow_special_return: true,
    is_in_use: true,
    is_main_pack_size: true,
    is_split_case: false,
    old_starkis_unit_name: null,
    not_delivered_days_of_week: '       ',
    not_delivered_from_date: '1999-01-01T00:00:00Z',
    not_delivered_to_date: '2021-10-03T00:00:00Z',
    requested_synchronisation_date: '2021-12-28T00:00:00Z',
    is_synchronised: true,
    synchronisation_requested_by: 'pret\\admin-peterg',
    actual_synchronisation_date: '2021-12-28T04:30:13Z',
    actual_synchronisation_by: 'PRET\\svc-sql-uka10-agent',
    last_updated_by: 'PRET\\kareny',
    last_updated_date: '2021-11-17T18:31:16Z',
  },
]

const goodPackPrices = [
  {
    goods_no: 6065,
    supplier_no: 17,
    unit_id: '750g',
    pack_size: 8.0,
    effective_date: '2021-12-30T00:00:00Z',
    until_date: null,
    pack_price: 47.37,
    distribution_cost: 2.0,
  },
]

const mockUnitsOfMeasure = [
  {
    unit_id: '750g',
    is_base_unit: false,
    unit_type_id: 'Weight',
    factor: 750.0,
    is_current: true,
  },
  {
    unit_id: 'g',
    is_base_unit: true,
    unit_type_id: 'Weight',
    factor: 1.0,
    is_current: true,
  },
]

describe('StarkisService', () => {
  let service: StarkisService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [StarkisService, ConfigService],
    })
      .useMocker((token) => {
        if (token === SecretManagerService) {
          return { getSecretValue: jest.fn().mockResolvedValue('mockSecret') }
        }
      })
      .compile()

    httpService = module.get<HttpService>(HttpService)
    service = module.get<StarkisService>(StarkisService)
  })

  describe('fetchDetailedGood', () => {
    it('should correctly calculate the cost for a good, with a default quantity of 1', async () => {
      jest.spyOn(httpService, 'get').mockImplementation((url: string): any => {
        let res

        if (url.includes('/goods/')) {
          res = mockGood
        }

        if (url.includes('/goodsPackSize/')) {
          res = goodPackSizes
        }

        if (url.includes('/goodsPackPrice/')) {
          res = goodPackPrices
        }

        if (url.includes('/unitOfMeasure')) {
          res = mockUnitsOfMeasure
        }

        return of({ data: res }) as unknown as AxiosResponse<any>
      })
      const res = await service.fetchDetailedGood(6065)
      expect(res).toEqual({
        cost: {
          centAmount: '0.7895',
          currencyCode: 'GBP',
        },
        id: 6065,
        modifiedAt: '2020-06-23T11:50:46Z',
        name: 'Ham',
        quantity: 1,
        unitOfMeasurement: 'g',
      })
    })

    it('should return null if there is no related pack size for the good', async () => {
      jest.spyOn(httpService, 'get').mockImplementation((url: string): any => {
        let res

        if (url.includes('/goods/')) {
          res = mockGood
        }

        if (url.includes('/goodsPackSize/')) {
          res = []
        }

        if (url.includes('/goodsPackPrice/')) {
          res = goodPackPrices
        }

        if (url.includes('/unitOfMeasure')) {
          res = mockUnitsOfMeasure
        }

        return of({ data: res }) as unknown as AxiosResponse<any>
      })

      const res = await service.fetchDetailedGood(6065)
      expect(res).toEqual(null)
    })
  })

  describe('fetchAllGoods', () => {
    it('should return the goods response from starkis', async () => {
      jest.spyOn(httpService, 'get').mockImplementation((): any => {
        return of({ data: [mockGood, mockGood] }) as unknown as AxiosResponse<any>
      })
      const res = await service.fetchAllGoods()
      expect(res).toEqual({ data: [mockGood, mockGood] })
    })
  })

  describe('fetchRecipesGoods', () => {
    it('should return the recipes response from starkis', async () => {
      jest.spyOn(httpService, 'get').mockImplementation((): any => {
        return of({ data: [recipeMock, recipeMock] }) as unknown as AxiosResponse<any>
      })
      const res = await service.fetchAllRecipes()
      expect(res).toEqual({ data: [recipeMock, recipeMock] })
    })
  })
})
