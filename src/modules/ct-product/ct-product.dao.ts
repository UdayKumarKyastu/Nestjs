import { Product, ProductProjection } from '@commercetools/platform-sdk'
import { Injectable, NotFoundException } from '@nestjs/common'

import { CommercetoolsContext } from '../commercetools/commercetools-context'

export interface ICanGetCtProduct {
  getOneProductBySku(sku: string): Promise<Product | null>
  getOneProductBySkuOrThrow(sku: string): Promise<Product>
}

export interface ICanGetCtProductProjection {
  getOneProductProjectionBySku(sku: string): Promise<ProductProjection | null>
}

@Injectable()
export class CtProductDao implements ICanGetCtProduct, ICanGetCtProductProjection {
  constructor(private readonly _ctContext: CommercetoolsContext) {}

  /**
   * TODO Is this really required? Maybe we should always get projection from product
   */
  async getOneProductProjectionBySku(
    sku: string,
    staged?: boolean,
  ): Promise<ProductProjection | null> {
    try {
      const result = await this._ctContext.productProjections
        .withKey({ key: sku })
        .get({
          queryArgs: {
            staged,
            markMatchingVariants: true,
            expand: [
              'productType',
              'categories[*].ancestors',
              'masterData.staged.categories[*].ancestors',
              'masterVariant.prices[*].channel',
            ],
            limit: 1,
          },
        })
        .execute()

      return result.body
    } catch (error) {
      return null
    }
  }

  async getOneProductProjectionByHgCode(
    hgCode: string,
    staged?: boolean,
  ): Promise<ProductProjection | null> {
    try {
      const result = await this._ctContext.productProjections
        .get({
          queryArgs: {
            staged,
            markMatchingVariants: true,
            expand: [
              'productType',
              'categories[*].ancestors',
              'masterData.staged.categories[*].ancestors',
              'masterVariant.prices[*].channel',
            ],
            where: `key = "${hgCode}"`,
            limit: 1,
          },
        })
        .execute()

      return result.body as any
    } catch (error) {
      return null
    }
  }

  async getOneProductBySku(sku: string): Promise<Product | null> {
    try {
      const result = await this._ctContext.products
        .withKey({ key: sku })
        .get({
          queryArgs: {
            markMatchingVariants: true,
            expand: [
              'productType',
              'categories[*].ancestors',
              'masterData.staged.categories[*].ancestors',
              'masterData.current.masterVariant.prices[*].channel.id',
              'masterData.current.variants[*].prices[*].channel.id',
              'masterData.staged.masterVariant.prices[*].channel.id',
              'masterData.staged.variants[*].prices[*].channel.id',
            ],
            limit: 1,
          },
        })
        .execute()

      return result.body
    } catch (error) {
      return null
    }
  }

  async getOneProductBySkuOrThrow(sku: string): Promise<Product> {
    return this.getOneProductBySku(sku).then((resp) => {
      if (!resp) {
        throw new NotFoundException(`The Product with sku '${sku}' was not found`)
      }

      return resp
    })
  }
}
