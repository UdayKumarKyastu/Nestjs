import { Injectable, Inject } from '@nestjs/common'

import { CtProductDao } from '../../../ct-product/ct-product.dao'
import { CommercetoolsCustomObjectDao } from '../../../commercetools/commercetools-custom-object.dao'
import { VariantVersion } from '../../../variant-version/model/variant-version'
import { ProductGroup } from '../../../../shared/model/product-group'
import {
  VariantVersionFetcherService,
  ICanFetchVariantVersions,
} from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { ProductMapper } from '../../../product/logic/product.mapper'
import { ProductTypeKey } from '../../../product-type/product-type-key'
import { VersionCustomObjectPayload } from '../../../variant-version/model/version-custom-object'

import { VariantReviewStatusGenerator } from './review-status-generator/variant-review-status-generator'
import { ProductReviewStatusGenerator } from './review-status-generator/product-review-status-generator'
import { DIFF_TYPES } from './models/diff-types'
import { VariantReviewStatus } from './models/variant-review-status'
import { VariantFieldStatusUpdater } from './review-status-updater/variant-field-status-updater'
import { ProductFieldStatusUpdater } from './review-status-updater/product-field-status-updater'
import { Action } from './models/update-action'
import { Area } from './models/area'
import { User } from './models/user'

const CUSTOM_OBJECT_CONTAINER_NAME = 'reviewStatus'

export interface PricingFieldValue {
  channelName: string
  field:
    | 'takeAwayPrice'
    | 'eatInPrice'
    | 'deliveryPrice'
    | 'eatInTax'
    | 'deliveryTax'
    | 'takeAwayClubPret'
    | 'eatInClubPret'
}
export interface UpdateReviewStatusParams {
  masterSku: string
  variantSku?: string
  version?: string
  area: Area
  fieldName: string
  action: Action
  user: User | null
  fieldValue?: string[] | PricingFieldValue
}
@Injectable()
export class ReviewStatusService {
  originalProduct: ProductGroup | null
  originalVersion: VersionCustomObjectPayload | null
  constructor(
    private readonly _commerceToolsCustomObjectService: CommercetoolsCustomObjectDao,
    private readonly _productDao: CtProductDao,
    @Inject(VariantVersionFetcherService)
    private readonly _versionsService: ICanFetchVariantVersions,
    private readonly _productMapper: ProductMapper,
  ) {
    this.originalProduct = null
    this.originalVersion = null
  }

  private async getProduct(sku: string) {
    const product = await this._productDao.getOneProductBySku(sku)

    return new ProductGroup(product!)
  }

  private getDiffType(masterSku: string, variantSku?: string, versionKey?: string) {
    if (versionKey) {
      return DIFF_TYPES.version
    }

    if (variantSku) {
      return DIFF_TYPES.variant
    }

    if (masterSku) {
      return DIFF_TYPES.product
    }

    return DIFF_TYPES.product
  }

  async setOriginalProduct(sku: string) {
    const product = await this.getProduct(sku)

    if (product) {
      this.originalProduct = product
    }
  }

  async setOriginalVersion(versionKey: string) {
    const version = await this._versionsService.fetchVariantVersionByKeyOrThrow(versionKey!)

    if (version) {
      this.originalVersion = version.data
    }
  }

  async getFieldReviewStatuses(
    sku: string,
    productType: DIFF_TYPES,
    versionKey?: string,
    hasStagedChanges?: boolean,
  ) {
    let key = `${sku}-${productType}-reviewStatus`

    if (!hasStagedChanges) {
      await this.removeReviewStatusCustomObject(sku, productType)

      return {}
    }

    if (versionKey) {
      key = `${sku}-${versionKey}-${productType}-reviewStatus`
    }

    const fieldReviewStatuses = await this._commerceToolsCustomObjectService.getCustomObjectByKey(
      key,
    )

    return fieldReviewStatuses?.value
  }

  async removeReviewStatusCustomObject(sku: string, productType: DIFF_TYPES) {
    const key = `${sku}-${productType}-reviewStatus`

    await this._commerceToolsCustomObjectService.writeCustomObject(
      key,
      CUSTOM_OBJECT_CONTAINER_NAME,
      {},
    )
  }

  getCustomObjectKey(sku: string, diffType: DIFF_TYPES, variantSku?: string, versionKey?: string) {
    let key = `${sku}-${diffType}-reviewStatus`

    if (variantSku) {
      key = `${variantSku}-${diffType}-reviewStatus`
    }

    if (versionKey) {
      key = `${sku}-${versionKey}-${diffType}-reviewStatus`
    }

    return key
  }

  async generateFieldReviewStatuses(
    modifiedProductSku: string,
    variantSku?: string,
    versionKey?: string,
  ) {
    const productType = this.getDiffType(modifiedProductSku, variantSku, versionKey)

    let key = `${modifiedProductSku}-${productType}-reviewStatus`

    if (variantSku) {
      key = `${variantSku}-${productType}-reviewStatus`
    }

    if (versionKey) {
      key = `${modifiedProductSku}-${versionKey}-${productType}-reviewStatus`
    }

    const matchingObject = await this._commerceToolsCustomObjectService.getCustomObjectByKey(key)
    const modifiedProduct = await this.getProduct(modifiedProductSku)

    if (productType === DIFF_TYPES.version) {
      const version = await this._versionsService.fetchVariantVersionByKeyOrThrow(versionKey!)

      if (!version || !this.originalVersion) return {}

      const modifiedVersion = VariantVersion.fromRawCtObject(
        version.id,
        modifiedProductSku,
        version.data,
      )

      const originalVersion = VariantVersion.fromRawCtObject(
        version.id,
        modifiedProductSku,
        this.originalVersion!,
      )

      const relatedProduct = await this._productDao.getOneProductBySku(modifiedProductSku)

      const product = new ProductGroup(relatedProduct!)

      const relatedVariant = product.createVariantsExtractor().getVariantBySku(variantSku!)

      const variantVersionModel = VariantVersion.mapVersionToVariantModel(
        originalVersion.draft,
        this.originalVersion!,
        product.getProductType(),
        relatedVariant!,
        product.getProductGroupName('current'),
      )

      const draftVariantVersionModel = VariantVersion.mapVersionToVariantModel(
        modifiedVersion.draft,
        version.data,
        product.getProductType(),
        relatedVariant!,
        product.getProductGroupName('staged'),
      )

      const reviewStatusObject = new VariantReviewStatusGenerator(
        variantVersionModel,
        draftVariantVersionModel,
        matchingObject?.value,
      ).getStatusObject()

      const finalObject: VariantReviewStatus & { sku: string } = {
        sku: modifiedProductSku,
        ...reviewStatusObject,
      }

      await this._commerceToolsCustomObjectService.writeCustomObject(
        key,
        CUSTOM_OBJECT_CONTAINER_NAME,
        finalObject,
      )

      return finalObject
    }

    if (!modifiedProduct || !this.originalProduct) return {}

    if (productType === DIFF_TYPES.variant) {
      const originalVariant = this.originalProduct
        .getMasterAndAllVariants('staged')
        .find((variant) => variant.sku === variantSku)

      const modifiedVariant = modifiedProduct
        .getMasterAndAllVariants('staged')
        .find((variant) => variant.sku === variantSku)

      if (!originalVariant || !modifiedVariant) return {}

      const type = this.originalProduct.isFoodType()
        ? ProductTypeKey.Food
        : ProductTypeKey.BaristaBeverage

      const isMaster = this.originalProduct.getMasterVariant().sku === variantSku
      const originalVariantModel = this._productMapper.mapCtVariantToVariantModel(
        originalVariant,
        type,
        isMaster,
        this.originalProduct.getProductGroupName('staged'),
      )

      const modifiedVariantModel = this._productMapper.mapCtVariantToVariantModel(
        modifiedVariant,
        type,
        isMaster,
        modifiedProduct.getProductGroupName('staged'),
      )

      const reviewStatusObject = new VariantReviewStatusGenerator(
        originalVariantModel,
        modifiedVariantModel,
        matchingObject?.value,
      ).getStatusObject()

      const finalObject: VariantReviewStatus & { sku: string } = {
        sku: variantSku!,
        ...reviewStatusObject,
      }

      await this._commerceToolsCustomObjectService.writeCustomObject(
        key,
        CUSTOM_OBJECT_CONTAINER_NAME,
        finalObject,
      )

      return finalObject
    }

    if (productType === DIFF_TYPES.product) {
      const reviewStatusObject = new ProductReviewStatusGenerator(
        this.originalProduct,
        modifiedProduct,
        matchingObject?.value,
      ).getStatusObject()

      const finalObject = {
        sku: modifiedProductSku,
        ...reviewStatusObject,
      }

      await this._commerceToolsCustomObjectService.writeCustomObject(
        key,
        CUSTOM_OBJECT_CONTAINER_NAME,
        finalObject,
      )

      return finalObject
    }
  }

  async updateReviewStatus({
    masterSku,
    version,
    area,
    fieldName,
    variantSku,
    action,
    fieldValue,
    user,
  }: UpdateReviewStatusParams) {
    const diffType = this.getDiffType(masterSku, variantSku, version)
    const key = this.getCustomObjectKey(masterSku, diffType, variantSku, version)
    const matchingObject = await this._commerceToolsCustomObjectService.getCustomObjectByKey(key)

    if (!matchingObject) throw new Error(`No object matching ${masterSku} ${area} ${diffType}`)

    let updatedStatusObject

    if (diffType === DIFF_TYPES.product) {
      updatedStatusObject = new ProductFieldStatusUpdater(
        matchingObject.value,
        user,
      ).updateReviewStatusObject(area, fieldName, action, fieldValue as string[])
    } else {
      updatedStatusObject = new VariantFieldStatusUpdater(
        matchingObject.value,
        user,
      ).updateReviewStatusObject(area, fieldName, action, fieldValue as PricingFieldValue)
    }

    await this._commerceToolsCustomObjectService.writeCustomObject(
      key,
      CUSTOM_OBJECT_CONTAINER_NAME,
      updatedStatusObject,
    )
  }
}
