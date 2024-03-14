import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ProductProjection } from '@commercetools/platform-sdk'

import { CtProductDao } from '../../ct-product/ct-product.dao'
import { ProductDto } from '../../../shared/dto/product.dto'

import { ProductMapper } from './product.mapper'

/**
 * TODO: Make this service create entire response, instead in controller
 */
@Injectable()
export class ProductService {
  constructor(
    private readonly _productDao: CtProductDao,
    private readonly _productMapper: ProductMapper,
  ) {}

  async findOneBySku(sku: string): Promise<ProductProjection> {
    const product =
      (await this._productDao.getOneProductProjectionBySku(sku)) ||
      (await this._productDao.getOneProductProjectionBySku(sku, true))
    if (!product) {
      throw new NotFoundException(`The Product with sku '${sku}' was not found`)
    }

    return product
  }

  async mapProjectionToProductDto(projection: ProductProjection): Promise<ProductDto> {
    const mappedProduct = this._productMapper.mapSingleProductProjectionToProductDto(projection)

    if (!mappedProduct) {
      throw new BadRequestException(
        `The Product with sku '${projection.key}' is neither barista beverage nor food product`,
      )
    }

    return mappedProduct
  }
}
