import { Injectable, Inject } from '@nestjs/common'
import { Product, ProductVariant } from '@commercetools/platform-sdk'
import { isAfter } from 'date-fns'
import { uniqBy } from 'lodash'

import { CountryCode } from '../../../../shared/model/country-code'
import { ProductGroup } from '../../../../shared/model/product-group'
import { ProductImageService } from '../../../content-management/services/product-image.service'
import { Sku } from '../../../../shared/model/sku'
import { CommonProductVariantAttributes } from '../../../product-attributes/common-product-variant-attributes'
import { MultilangString } from '../../../product/logic/models/multilang-string'
import { VariantVersionCustomObject } from '../../../variant-version/model/version-custom-object'

import { GetLiveSoonProductsDao, IGetLiveSoonProductsDao } from './get-live-soon-products.dao'
import { GetLiveSoonProductsDto } from './dto/get-live-soon-products.dto'

export interface ICanGetLiveSoonProducts {
  getLiveSoonProducts(country?: CountryCode): Promise<GetLiveSoonProductsDto>
}

@Injectable()
export class GetLiveSoonProductsService implements ICanGetLiveSoonProducts {
  constructor(
    private _productImagesService: ProductImageService,
    @Inject(GetLiveSoonProductsDao)
    private readonly _getLiveSoonProductsDao: IGetLiveSoonProductsDao,
  ) {}

  private extractAllVariantsFromProducts = (stagedProducts: Product[]) => {
    return stagedProducts
      ?.map((product) => new ProductGroup(product))
      .flatMap((pg) => pg.getMasterAndAllVariants())
  }

  private getAllVariantsImagesRecord = async (
    allVariants: ProductVariant[],
  ): Promise<Record<string, string | null>> => {
    const allNestedSkus = allVariants.map((v) => new Sku(v.sku!))

    return this._productImagesService
      .getImagesForGivenSkus(allNestedSkus.map((s) => s.value))
      .then((imgsAndSkus) =>
        imgsAndSkus.reduce((acc, pair) => {
          acc[pair.sku] = pair.imageUrl

          return acc
        }, {} as Record<string, string | null>),
      )
  }

  private getAllLiveSoonVersions = async (): Promise<
    Record<string, VariantVersionCustomObject>
  > => {
    return this._getLiveSoonProductsDao.getLiveSoonVersions().then((objs) =>
      objs.reduce((acc, obj) => {
        acc[obj.id] = obj

        return acc
      }, {} as Record<string, VariantVersionCustomObject>),
    )
  }

  async getLiveSoonProducts(country: CountryCode) {
    const liveSoonProducts = await this._getLiveSoonProductsDao.getLiveSoonProducts(country)
    const allVariants = this.extractAllVariantsFromProducts(liveSoonProducts)
    const productImagesRecord = await this.getAllVariantsImagesRecord(allVariants)

    const allNestedCustomObjectsRecord = await this.getAllLiveSoonVersions()

    const liveSoonVersionsHgCodes = Object.values(allNestedCustomObjectsRecord)
      .filter((version) => version.value.hg?.country === country)
      .map((version) => version.value.hg?.hgCode)

    const productsContainingLiveSoonVersions =
      liveSoonVersionsHgCodes.length > 0
        ? await this._getLiveSoonProductsDao.getProductsContainingLiveSoonVersions(
            liveSoonVersionsHgCodes,
          )
        : []

    const liveSoonProductsWithoutDuplicates = uniqBy(
      [...liveSoonProducts, ...productsContainingLiveSoonVersions],
      'id',
    )

    const productSortedByDate = liveSoonProductsWithoutDuplicates.sort((p1, p2) => {
      const date1 = new Date(p1.lastModifiedAt)
      const date2 = new Date(p2.lastModifiedAt)

      return isAfter(date1, date2) ? -1 : 1
    })

    const mappedProducts = productSortedByDate.map((product) => {
      const pg = new ProductGroup(product)
      const masterVariant = pg.getMasterVariant()
      const commonAttributes = new CommonProductVariantAttributes(masterVariant.attributes!)

      const variants = pg.getMasterAndAllVariants().map((variant, index) => {
        const commonAttributes = new CommonProductVariantAttributes(variant.attributes!)

        const liveSoonVersionsIDs = commonAttributes.versions.value.filter((versionID) => {
          return Boolean(allNestedCustomObjectsRecord[versionID])
        })

        const versions = liveSoonVersionsIDs.map((versionID) => {
          const relatedVersionObj = allNestedCustomObjectsRecord[versionID]

          const rawName =
            relatedVersionObj.value.approved?.name ??
            relatedVersionObj.value.draft?.name ??
            pg.getProductGroupName('current')

          return {
            name: new MultilangString(rawName).toDto(),
            sku: variant.sku!,
            isMaster: index === 0,
            recipeID: relatedVersionObj.value.hg.hgCode,
            imageUrl: productImagesRecord[variant.sku!],
            countryCode: commonAttributes.country.asEnum(),
            versionNumber: relatedVersionObj.value.hg.version,
            liveFrom: relatedVersionObj.value.hg.liveFrom as string,
          }
        })

        return {
          name: pg.getProductGroupName('current'),
          imageUrl: productImagesRecord[variant.sku!],
          countryCode: commonAttributes.country.asEnum(),
          sku: variant.sku!,
          masterSku: pg.getMasterVariant().sku!,
          isMaster: index === 0,
          recipeID: commonAttributes.hgCode?.value ?? null,
          liveFrom: commonAttributes.liveFrom ? commonAttributes.liveFrom.toString() : null,
          versions: versions,
        }
      })

      return {
        sku: pg.getMasterVariant().sku,
        countryCode: commonAttributes.country.asEnum(),
        name: pg.getProductGroupName('current'),
        imageUrl: productImagesRecord[masterVariant.sku!],
        variants,
      }
    })

    return {
      productGroups: mappedProducts,
    }
  }
}
