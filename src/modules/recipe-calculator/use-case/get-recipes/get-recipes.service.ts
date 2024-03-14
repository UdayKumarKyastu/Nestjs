import { Injectable, Inject } from '@nestjs/common'
import { ProductVariant } from '@commercetools/platform-sdk'
import Fuse from 'fuse.js'
import { Decimal } from 'decimal.js'

import { StarkisService } from '../../../starkis/starkis.service'
import { SearchProductsDao, ISearchProductsDao } from '../../../search-products/search-products.dao'
import { HgCodeAttribute } from '../../../product-attributes/common-variant-attributes/hg-code-attribute'
import { CountryAttribute } from '../../../product-attributes/common-variant-attributes/country-attribute'
import { SearchProperty } from '../../../search-products/search-property'
import { GoodsDto } from '../get-goods/get-goods.dto'
import { SearchProperties } from '../get-goods/search-properties'

import { RecipeDto } from './get-recipes.dto'

@Injectable()
export class GetRecipesService {
  constructor(
    private readonly _starkisService: StarkisService,
    @Inject(SearchProductsDao) private readonly _searchProductsDao: ISearchProductsDao,
  ) {}

  private _propertyNameToPathMatcher(propertyName?: SearchProperties) {
    switch (propertyName) {
      case SearchProperties.sku:
        return 'product_no'
      case SearchProperties.hgCode:
        return 'external_pret_id'
      case SearchProperties.name:
        return 'product_name'
      default:
        return null
    }
  }

  getRecipeNumberFromSku(sku: string) {
    const indexOfFirstNotZeroDigit = sku.search(/[1-9]/)

    return sku.substring(indexOfFirstNotZeroDigit)
  }

  async getRelatedVariant(hgCode: string): Promise<ProductVariant | null> {
    const { products } = await this._searchProductsDao.searchProducts(
      hgCode,
      SearchProperty.hgCode,
      1,
      1,
    )

    const relatedVariant = [products[0]?.masterVariant, ...(products[0]?.variants || [])].find(
      (variant) => {
        const hgCodeAttribute = variant?.attributes?.find(
          (attr) => attr.name === HgCodeAttribute.COMMERCE_TOOLS_ATTR_NAME,
        )

        return hgCodeAttribute?.value === hgCode
      },
    )!

    return relatedVariant
  }

  async getRecipes(query: string, propertyName: SearchProperties): Promise<RecipeDto[]> {
    const pathToSearchBy = this._propertyNameToPathMatcher(propertyName)
    if (!pathToSearchBy) throw new Error(`Search property ${propertyName} is not supported`)

    const allRecipes = (await this._starkisService.fetchAllRecipes()).data

    const fuse = new Fuse(allRecipes, {
      keys: [pathToSearchBy],
      threshold: propertyName === SearchProperties.name ? 0.35 : 0,
    })

    const matchingRecipes = fuse.search(
      propertyName === SearchProperties.sku ? this.getRecipeNumberFromSku(query) : query,
    )

    const recipesDto = await Promise.all(
      matchingRecipes.map(async (recipe) => {
        const relatedVariant = recipe.item.external_pret_id
          ? await this.getRelatedVariant(recipe.item.external_pret_id)
          : null

        return {
          id: recipe.item.external_pret_id,
          starkisId: recipe.item.product_no,
          name: recipe.item.product_name,
          sku: relatedVariant?.sku || null,
          modifiedAt: recipe.item.last_updated_date,
          country:
            relatedVariant?.attributes?.find(
              (attr) => attr.name === CountryAttribute.COMMERCE_TOOLS_ATTR_NAME,
            )?.value?.key || null,
        }
      }),
    )

    return recipesDto.filter(Boolean) as RecipeDto[]
  }

  async getRecipeGoods(recipeId: string): Promise<GoodsDto[]> {
    const recipeGoods = await this._starkisService.fetchRecipeGoods(Number(recipeId))

    const goods = await Promise.all(
      recipeGoods.data.map(async (good) => {
        const goodDataPerUnit = await this._starkisService.fetchDetailedGood(good.component_no)

        return {
          ...goodDataPerUnit,
          quantity: good.quantity,
          unitOfMeasurement: good.unit_id,
          cost: {
            ...goodDataPerUnit?.cost,
            centAmount: new Decimal(goodDataPerUnit?.cost?.centAmount || 0).toDP(8).toString(),
          },
        }
      }),
    )

    return goods.filter(Boolean) as GoodsDto[]
  }
}
