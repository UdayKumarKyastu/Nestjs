import { ProductProjection } from '@commercetools/platform-sdk'
import { Test } from '@nestjs/testing'
import { HttpService, HttpModule } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces'
import { of } from 'rxjs'

import { CountryCode } from '../../../../shared/model/country-code'
import { ProductTypeKey } from '../../../product-type/product-type-key'
import { StarkisService } from '../../../starkis/starkis.service'
import { SearchProductsDao } from '../../../search-products/search-products.dao'
import { SecretManagerService } from '../../../../configuration/services/secret-manager.service'
import { CommercetoolsContext } from '../../../commercetools/commercetools-context'
import { ProductTypeDao } from '../../../product-type/product-type.dao'
import { recipeMock } from '../../mocks/recipe-mock'
import { SearchProperties } from '../get-goods/search-properties'

import { GetRecipesService } from './get-recipes.service'

export const productProjection: ProductProjection = {
  productType: {
    obj: {
      key: ProductTypeKey.BaristaBeverage,
    },
  },
  id: 'UK10001',
  key: recipeMock.external_pret_id,
  masterVariant: {
    sku: 'UK10001',
    attributes: [
      {
        name: 'country',
        value: { key: CountryCode.UK, value: 'UK' },
      },
      {
        name: 'hgCode',
        value: recipeMock.external_pret_id,
      },
    ],
    key: 'UK10001',
  },
  variants: [],
} as any as ProductProjection

describe('GetRecipesService', () => {
  let getRecipesService: GetRecipesService
  let httpService: HttpService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [StarkisService, ConfigService, GetRecipesService],
    })
      .useMocker((token) => {
        if (token === SearchProductsDao) {
          return {
            searchProducts: async () => Promise.resolve({ products: [productProjection] }),
          }
        }

        if (token === SecretManagerService) {
          return { getSecretValue: jest.fn().mockResolvedValue('mockSecret') }
        }

        if (token === CommercetoolsContext) {
          return {}
        }

        if (token === ProductTypeDao) {
          return {}
        }
      })
      .compile()

    getRecipesService = module.get<GetRecipesService>(GetRecipesService)
    httpService = module.get<HttpService>(HttpService)
  })

  it('properly fetches recipes and maps them to dto', async () => {
    jest.spyOn(httpService, 'get').mockImplementation((): any => {
      return of({ data: [recipeMock] }) as unknown as AxiosResponse<any>
    })
    const result = await getRecipesService.getRecipes('croissant', SearchProperties.name)

    expect(result).toEqual([
      {
        id: 'FP0001',
        starkisId: 796,
        name: 'Croissant & Jam',
        sku: 'UK10001',
        modifiedAt: '2000-01-01T00:00:00Z',
        country: 'UK',
      },
    ])
  })

  describe('getRecipeNumberFromSku', () => {
    it('properly extracts recipe number from product sku', () => {
      const recipeNumber = getRecipesService.getRecipeNumberFromSku('UK006470')

      expect(recipeNumber).toEqual('6470')
    })
  })
})
