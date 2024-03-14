import { Inject, Injectable, Logger } from '@nestjs/common'
import { Asset, ContentfulClientApi } from 'contentful'

import { ContentfulClientConnectionToken } from '../contentful/contentful-client-connection.token'

export interface ProductSkuWithImage {
  sku: string
  imageUrl: string | null
}

export interface ICanFetchProductImages {
  getImageForSingleSku(sku: string): Promise<ProductSkuWithImage>
  getImagesForGivenSkus(skus: string[]): Promise<ProductSkuWithImage[]>
}

@Injectable()
export class ProductImageService implements ICanFetchProductImages {
  private readonly _contentTypeName: string = 'digitalAsset'
  constructor(
    @Inject(ContentfulClientConnectionToken)
    private readonly _client: ContentfulClientApi,
  ) {}

  private async getImageUrlBySku(sku: string): Promise<string | null> {
    try {
      const entries = await this._client.getEntries<{ asset: Asset }>({
        limit: 1,
        content_type: this._contentTypeName,
        'fields.productId': sku,
        select: 'fields.asset',
      })
      const entryExists = entries.total > 0
      if (!entryExists) return null

      const entryFile = entries.items[0].fields.asset.fields.file

      return entryFile.url
    } catch (error: unknown) {
      Logger.error(`Could not find entry for the given sku: ${sku}`, (error as Error).stack)

      return null
    }
  }

  async getImageForSingleSku(sku: string): Promise<ProductSkuWithImage> {
    return this.getImageUrlBySku(sku).then((image) => ({
      sku,
      imageUrl: image,
    }))
  }

  async getImagesForGivenSkus(skus: string[]): Promise<ProductSkuWithImage[]> {
    const images = await Promise.all(
      skus.map(async (sku) => {
        return { sku, imageUrl: await this.getImageUrlBySku(sku) }
      }),
    )

    return images
  }
}
