import { Controller, Get, Query, Param } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

import { SearchProperty } from '../../../search-products/search-property'
import { GoodsDto } from '../get-goods/get-goods.dto'

import { RecipeDto } from './get-recipes.dto'
import { GetRecipesService } from './get-recipes.service'

@Controller('/v1/recipe-calculator')
export class GetRecipeController {
  constructor(private readonly _getRecipesService: GetRecipesService) {}

  @ApiResponse({
    type: RecipeDto,
    isArray: true,
  })
  @Get('/recipes')
  //get recipes
  public async getRecipe(
    @Query('query') query: string,
    @Query('propertyName') propertyName: SearchProperty,
  ): Promise<RecipeDto[] | null> {
    return this._getRecipesService.getRecipes(query, propertyName as any)
  }

  @ApiResponse({
    type: GoodsDto,
    isArray: true,
  })
  @Get('/recipes/:recipeId/goods')
  public async getRecipeGoods(@Param('recipeId') recipeId: string): Promise<GoodsDto[]> {
    return this._getRecipesService.getRecipeGoods(recipeId)
  }
}
