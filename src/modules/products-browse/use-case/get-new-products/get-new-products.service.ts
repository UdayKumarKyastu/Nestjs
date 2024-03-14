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

import { IGetNewProductsDao, GetNewProductsDao } from './get-new-products.dao'
import { GetNewProductsDto } from './dto/get-new-products.dto'

export interface ICanGetNewProducts {
  getNewProducts(country?: CountryCode): Promise<GetNewProductsDto>
}

@Injectable()
export class GetNewProductsService implements ICanGetNewProducts {
  constructor(
    private _productImagesService: ProductImageService,
    @Inject(GetNewProductsDao) private readonly _getNewProductsDao: IGetNewProductsDao,
  ) {}

  private extractAllVariantsFromProducts = (stagedProducts: Product[]) => {
    return stagedProducts
      .map((product) => new ProductGroup(product))
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

  private getAllNewVersions = async (): Promise<Record<string, VariantVersionCustomObject>> => {
    return this._getNewProductsDao.getNewVersions().then((objs) =>
      objs.reduce((acc, obj) => {
        acc[obj.id] = obj

        return acc
      }, {} as Record<string, VariantVersionCustomObject>),
    )
  }

  async getNewProducts(country: CountryCode) {
    const newProducts = await this._getNewProductsDao.getNewProducts(country)
    const allVariants = this.extractAllVariantsFromProducts(newProducts)
    const productImagesRecord = await this.getAllVariantsImagesRecord(allVariants)

    const allNestedCustomObjectsRecord = await this.getAllNewVersions()

    const newVersionsHgCodes = Object.values(allNestedCustomObjectsRecord)
      .filter((version) => version.value.hg?.country === country)
      .map((version) => version.value.hg?.hgCode)

    const productsContainingNewVersions =
      newVersionsHgCodes.length > 0
        ? await this._getNewProductsDao.getProductsContainingNewVersions(newVersionsHgCodes)
        : []

    const newProductsWithoutDuplicates = uniqBy(
      [...newProducts, ...productsContainingNewVersions],
      'id',
    )

    const productSortedByDate = newProductsWithoutDuplicates.sort((p1, p2) => {
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

        const newVersionsIDs = commonAttributes.versions.value.filter((versionID) => {
          return Boolean(allNestedCustomObjectsRecord[versionID])
        })

        const versions = newVersionsIDs.map((versionID) => {
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
            createdAt: relatedVersionObj.createdAt,
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
          createdAt: product.createdAt,
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
