import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SecretManagerService } from '../../configuration/services/secret-manager.service'
import { StarkisModule } from '../../modules/starkis/starkis.module'
import { StarkisService } from '../../modules/starkis/starkis.service'
import { SearchProductsModule } from '../search-products/search-products.module'
import { CtProductDao } from '../ct-product/ct-product.dao'
import { CommerceToolsModule } from '../commercetools/commercetools.module'

import { GetGoodsController } from './use-case/get-goods/get-goods.controller'
import { GetGoodsService } from './use-case/get-goods/get-goods.service'
import { GetRecipeController } from './use-case/get-recipes/get-recipes.controller'
import { GetRecipesService } from './use-case/get-recipes/get-recipes.service'

@Module({
  imports: [HttpModule, StarkisModule, SearchProductsModule, CommerceToolsModule],
  providers: [
    GetGoodsService,
    StarkisService,
    ConfigService,
    SecretManagerService,
    GetRecipesService,
    CtProductDao,
  ],
  controllers: [GetGoodsController, GetRecipeController],
})
export class RecipeCalculatorModule {}
