import { Inject, Injectable } from '@nestjs/common'

import { ISearchProductsDao, SearchProductsDao } from '../../search-products.dao'
import { ProductImageService } from '../../../content-management/services/product-image.service'
import { SearchProperty } from '../../search-property'

import {
  ISearchProductMapperV4Service,
  SearchProductMapperV5Service,
} from './search-product-mapper-v5.service'
import { SearchProductsListDto } from './search-list-product.dto'

export interface IGetSearchProductV4Service {
  searchProducts(
    query: string,
    propertyName: SearchProperty,
    limit: number,
    page: number,
    country: string,
  ): Promise<SearchProductsListDto>
}

@Injectable()
export class GetSearchProductV5Service implements IGetSearchProductV4Service {
  constructor(
    @Inject(SearchProductsDao) private readonly _searchProductsDao: ISearchProductsDao,
    @Inject(SearchProductMapperV5Service)
    private readonly _searchProductMapperV4Service: ISearchProductMapperV4Service,
    private readonly _productImageService: ProductImageService,
  ) {}

  async searchProducts(
    query: string,
    propertyName: SearchProperty,
    limit: number,
    page: number,
    country: string,
  ): Promise<SearchProductsListDto> {
    const { products, total } = await this._searchProductsDao.searchProducts(
      query,
      propertyName,
      limit,
      page,
      country,
    )

    const extractedAllSkus = products.flatMap((projection) =>
      [projection.masterVariant, ...projection.variants].map((v) => v.sku!),
    )

    const images = await this._productImageService.getImagesForGivenSkus(extractedAllSkus)

    return {
      products: await this._searchProductMapperV4Service.mapProductsToDto(products, images),
      total,
    }
  }
}
