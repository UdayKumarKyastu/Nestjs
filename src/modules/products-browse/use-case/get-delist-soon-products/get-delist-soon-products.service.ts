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

import { GetDelistSoonProductsDao, IGetDelistSoonProductsDao } from './get-delist-soon-products.dao'
import { GetDelistSoonProductsDto } from './dto/get-delist-soon-products.dto'

export interface ICanGetDelistSoonProducts {
  getDelistSoonProducts(country?: CountryCode): Promise<GetDelistSoonProductsDto>
}

@Injectable()
export class GetDelistSoonProductsService implements ICanGetDelistSoonProducts {
  constructor(
    private _productImagesService: ProductImageService,
    @Inject(GetDelistSoonProductsDao)
    private readonly _getDelistSoonProductsDao: IGetDelistSoonProductsDao,
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

  private getAllDelistSoonVersions = async (): Promise<
    Record<string, VariantVersionCustomObject>
  > => {
    return this._getDelistSoonProductsDao.getDelistSoonVersions().then((objs) =>
      objs.reduce((acc, obj) => {
        acc[obj.id] = obj

        return acc
      }, {} as Record<string, VariantVersionCustomObject>),
    )
  }

  async getDelistSoonProducts(country: CountryCode) {
    const delistSoonProducts = await this._getDelistSoonProductsDao.getDelistSoonProducts(country)
    const allVariants = this.extractAllVariantsFromProducts(delistSoonProducts)
    const productImagesRecord = await this.getAllVariantsImagesRecord(allVariants)

    const allNestedCustomObjectsRecord = await this.getAllDelistSoonVersions()

    const delistSoonVersionsHgCodes = Object.values(allNestedCustomObjectsRecord)
      .filter((version) => version.value.hg?.country === country)
      .map((version) => version.value.hg?.hgCode)

    const productsContainingDelistSoonVersions =
      delistSoonVersionsHgCodes.length > 0
        ? await this._getDelistSoonProductsDao.getProductsContainingDelistSoonVersions(
            delistSoonVersionsHgCodes,
          )
        : []

    const delistSoonProductsWithoutDuplicates = uniqBy(
      [...delistSoonProducts, ...productsContainingDelistSoonVersions],
      'id',
    )

    const productSortedByDate = delistSoonProductsWithoutDuplicates.sort((p1, p2) => {
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

        const delistSoonVersionsIDs = commonAttributes.versions.value.filter((versionID) => {
          return Boolean(allNestedCustomObjectsRecord[versionID])
        })

        const versions = delistSoonVersionsIDs.map((versionID) => {
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
            liveTo: relatedVersionObj.value.hg.liveTo as string,
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
          liveTo: commonAttributes.liveTo ? commonAttributes.liveTo.toString() : null,
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
