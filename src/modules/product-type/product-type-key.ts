import { ProductProjection } from '@commercetools/platform-sdk'
import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'

export enum ProductTypeKey {
  Food = 'food',
  BaristaBeverage = 'barista_beverage',
}

export abstract class ProductTypeKeyParser {
  static parseKey(key: string | null | undefined) {
    if (key === 'food') {
      return ProductTypeKey.Food
    }

    if (key === 'barista_beverage') {
      return ProductTypeKey.BaristaBeverage
    }

    throw new Error(
      `Requested invalid product type. Expected "food" | "barista_beverage". Received ${key}`,
    )
  }

  static parseProductProjection(projection: ProductProjection) {
    return ProductTypeKeyParser.parseKey(projection.productType.obj?.key)
  }
}

export class ProductTypeKeyValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): ProductTypeKey {
    try {
      return ProductTypeKeyParser.parseKey(value)
    } catch (e) {
      throw new BadRequestException(
        `Product type should be one of: ${Object.values(ProductTypeKey)}`,
      )
    }
  }
}
