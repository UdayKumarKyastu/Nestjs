import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ProductProjection } from '@commercetools/platform-sdk'

import { CommercetoolsContext } from '../commercetools/commercetools-context'
import { Ean13CodeAttribute } from '../product-attributes/food-variant-attributes/ean-13-code-attribute'

@Injectable()
export class BarcodeService {
  constructor(@Inject(CommercetoolsContext) private readonly _ctContext: CommercetoolsContext) {}

  async getProductsWithBarcode(barcode: Ean13CodeAttribute): Promise<ProductProjection[]> {
    const [{ body: resp1 }, { body: resp2 }] = await Promise.all([
      this._ctContext.productProjections
        .get({
          queryArgs: {
            where: `masterVariant(attributes(name = "ean13Code" and value = "${barcode.value}"))`,
          },
        })
        .execute(),
      this._ctContext.productProjections
        .get({
          queryArgs: {
            where: `variants(attributes(name = "ean13Code" and value = "${barcode.value}"))`,
          },
        })
        .execute(),
    ])

    const fullResponse = [...resp1.results, ...resp2.results]

    return fullResponse
  }

  async verifyEan13Barcode(
    barcode: Ean13CodeAttribute,
  ): Promise<{ id: string; sku: string | undefined }> {
    const [{ body: resp1 }, { body: resp2 }] = await Promise.all([
      this._ctContext.productProjections
        .get({
          queryArgs: {
            where: `masterVariant(attributes(name = "ean13Code" and value = "${barcode.value}"))`,
          },
        })
        .execute(),
      this._ctContext.productProjections
        .get({
          queryArgs: {
            where: `variants(attributes(name = "ean13Code" and value = "${barcode.value}"))`,
          },
        })
        .execute(),
    ])

    const fullResponse = [...resp1.results, ...resp2.results]

    if (fullResponse.length > 0) {
      const [product] = fullResponse

      return {
        id: product.id,
        sku: product.key,
      }
    } else {
      throw new NotFoundException(`Product with barcode #${barcode.value} doesn't exist.`)
    }
  }
}
