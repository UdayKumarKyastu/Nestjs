import { isEqual } from 'lodash'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ProductUpdateAction, ProductVariant } from '@commercetools/platform-sdk'

import { CtProductDao, ICanGetCtProduct } from '../../../ct-product/ct-product.dao'
import {
  IReportingOptionsResolverService,
  ReportingOptionsResolverService,
} from '../../../variant-reporting/reporting-options-resolver.service'
import {
  ParsedVariantReportingFields,
  SerializedVariantReportingFields,
} from '../../logic/models/variant-reporting'
import {
  ICanUpdateVariantVersion,
  VariantVersionUpdaterService,
} from '../../../variant-version/services/variant-version-updater/variant-version-updater.service'
import {
  ICanFetchVariantVersions,
  VariantVersionFetcherService,
} from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { ProductGroup } from '../../../../shared/model/product-group'
import { CommonProductVariantAttributes } from '../../../product-attributes/common-product-variant-attributes'
import { VersionEditabilityChecker } from '../../../variant-version/version-editability-checker'
import { VariantLiveDates } from '../../logic/models/variant-live-dates'
import { VariantVersion } from '../../../variant-version/model/variant-version'
import { ProductTypeKey } from '../../../product-type/product-type-key'
import { PosIdAttribute } from '../../../product-attributes/common-variant-attributes/pos-id-attribute'
import { ParentProductSkuAttribute } from '../../../product-attributes/common-variant-attributes/parent-product-sku-attribute'
import { PluPrimaryCategoryAttribute } from '../../../product-attributes/common-variant-attributes/plu-primary-category-attribute'
import { PluSecondaryCategoryAttribute } from '../../../product-attributes/common-variant-attributes/plu-secondary-category-attribute'
import { PluReportingNameAttribute } from '../../../product-attributes/common-variant-attributes/plu-reporting-name-attribute'
import { ProductSubCategoryAttribute } from '../../../product-attributes/common-variant-attributes/product-sub-category-attribute'
import { ProductCategoryAttribute } from '../../../product-attributes/common-variant-attributes/product-category-attribute'
import { ProductRangeAttribute } from '../../../product-attributes/common-variant-attributes/product-range-attribute'
import { SaveDuplicatedDataDto } from '../save-duplicated-data/save-duplicated-data.dto'
import { VersionCustomObjectPayload } from '../../../variant-version/model/version-custom-object'
import { ProductPublishStateValidator } from '../validate-product-publish-state/validate-product-publish-state'

import { UpdateReportingDto } from './update-reporting.dto'
import {
  IUpdateVariantReportingDao,
  UpdateVariantReportingDao,
} from './update-variant-reporting.dao'

export interface ICanUpdateVariantReporting {
  updateVariant(
    masterVariantSku: string,
    variantSku: string,
    dto: UpdateReportingDto,
  ): Promise<void>
}

export interface ICanUpdateVariantVersionReporting {
  updateVersion(
    masterVariantSku: string,
    variantSku: string,
    versionKey: string,
    dto: UpdateReportingDto,
  ): Promise<void>
}

@Injectable()
export class UpdateVariantReportingService
  implements ICanUpdateVariantReporting, ICanUpdateVariantVersionReporting
{
  constructor(
    @Inject(ReportingOptionsResolverService)
    private readonly _reportingOptionsResolver: IReportingOptionsResolverService,
    @Inject(CtProductDao) private readonly _productDao: ICanGetCtProduct,
    @Inject(UpdateVariantReportingDao)
    private readonly _updateVariantReportingDao: IUpdateVariantReportingDao,
    @Inject(VariantVersionUpdaterService)
    private readonly _variantVersionUpdater: ICanUpdateVariantVersion,
    @Inject(VariantVersionFetcherService)
    private readonly _variantVersionFetcher: ICanFetchVariantVersions,
  ) {}

  private resolveCtActions(
    variant: ProductVariant,
    dto: UpdateReportingDto,
    type: ProductTypeKey,
  ): ProductUpdateAction[] {
    const actions: ProductUpdateAction[] = []

    const currentAttributes: ParsedVariantReportingFields = {
      posID: PosIdAttribute.createFromVariantAttributes(variant.attributes!),
      parentProductSku: ParentProductSkuAttribute.createFromVariantAttributes(variant.attributes!),
      pluPrimaryCategoryID: PluPrimaryCategoryAttribute.createFromVariantAttributes(
        variant.attributes!,
      ),
      pluSecondaryCategoryID: PluSecondaryCategoryAttribute.createFromVariantAttributes(
        variant.attributes!,
      ),
      pluReportingName: PluReportingNameAttribute.createFromVariantAttributes(variant.attributes!),
      starKisProductSubCategoryID: ProductSubCategoryAttribute.createFromVariantAttributes(
        variant.attributes!,
      ),
      starKisProductCategoryID: ProductCategoryAttribute.createFromVariantAttributes(
        variant.attributes!,
      ),
      productRange: ProductRangeAttribute.createFromVariantAttributes(variant.attributes!),
    }

    if ((currentAttributes.pluReportingName?.value ?? null) !== dto.pluReportingName) {
      actions.push({
        action: 'setAttribute',
        sku: variant.sku,
        name: PluReportingNameAttribute.COMMERCE_TOOLS_ATTR_NAME,
        value: dto.pluReportingName,
      })
    }

    if ((currentAttributes.pluPrimaryCategoryID?.value ?? null) !== dto.pluPrimaryCategoryID) {
      actions.push({
        action: 'setAttribute',
        sku: variant.sku,
        name: PluPrimaryCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME,
        value: dto.pluPrimaryCategoryID,
      })
    }

    if ((currentAttributes.pluSecondaryCategoryID?.value ?? null) !== dto.pluSecondaryCategoryID) {
      actions.push({
        action: 'setAttribute',
        sku: variant.sku,
        name: PluSecondaryCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME,
        value: dto.pluSecondaryCategoryID,
      })
    }

    if (
      (currentAttributes.starKisProductCategoryID?.value ?? null) !== dto.starKisProductCategoryID
    ) {
      actions.push({
        action: 'setAttribute',
        sku: variant.sku,
        name: ProductCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME,
        value: dto.starKisProductCategoryID,
      })
    }

    if (
      (currentAttributes.starKisProductSubCategoryID?.value ?? null) !==
      dto.starKisProductSubCategoryID
    ) {
      actions.push({
        action: 'setAttribute',
        sku: variant.sku,
        name: ProductSubCategoryAttribute.COMMERCE_TOOLS_ATTR_NAME,
        value: dto.starKisProductSubCategoryID,
      })
    }

    if (dto.productRange && !isEqual(currentAttributes.productRange?.value, dto.productRange)) {
      actions.push({
        action: 'setAttribute',
        sku: variant.sku,
        name: ProductRangeAttribute.COMMERCE_TOOLS_ATTR_NAME,
        value: dto.productRange.map((key) => key),
      })
    }

    if (type === ProductTypeKey.BaristaBeverage) {
      return actions
    }

    if ((currentAttributes.parentProductSku?.value ?? null) !== dto.parentProductSku) {
      actions.push({
        action: 'setAttribute',
        sku: variant.sku,
        name: ParentProductSkuAttribute.COMMERCE_TOOLS_ATTR_NAME,
        value: dto.parentProductSku,
      })
    }

    return actions
  }

  async updateVariant(masterVariantSku: string, variantSku: string, dto: UpdateReportingDto) {
    const ctProduct = await this._productDao.getOneProductBySkuOrThrow(masterVariantSku)
    const productGroup = new ProductGroup(ctProduct)

    ProductPublishStateValidator.validateProductPublishState(productGroup.getMasterData().published)

    const productData = ctProduct.masterData.staged
    const allVariants = [productData.masterVariant, ...productData.variants]

    const relatedVariant = allVariants.find((v) => v.sku === variantSku)

    if (!relatedVariant) {
      throw new NotFoundException(`The Product with sku '${variantSku}' was not found`)
    }

    const actions = this.resolveCtActions(relatedVariant, dto, productGroup.getProductType())

    return this._updateVariantReportingDao.updateVariantReporting(
      masterVariantSku,
      ctProduct.version,
      actions,
    )
  }

  /**
   * TODO Validate DTO, to use only enum values
   */
  async updateVersion(
    masterVariantSku: string,
    variantSku: string,
    versionKey: string,
    dto: UpdateReportingDto & SaveDuplicatedDataDto,
  ): Promise<void> {
    const productGroup = await this._productDao.getOneProductBySkuOrThrow(masterVariantSku)
    const product = new ProductGroup(productGroup)
    const version = await this._variantVersionFetcher.fetchVariantVersionByKeyOrThrow(versionKey)
    const commonAttributes = new CommonProductVariantAttributes(
      product.createVariantsExtractor().getMasterVariant().attributes!,
    )

    const editabilityChecker = new VersionEditabilityChecker(
      VariantLiveDates.fromCtVariant(product.getVariantBySkuOrThrow(variantSku)),
    )

    if (
      !editabilityChecker.isEditable(
        VariantLiveDates.fromVariantVersion(
          VariantVersion.fromRawCtObject(version.id, versionKey, version.data),
        ),
      )
    ) {
      throw new BadRequestException('Only FUTURE versions can be edited')
    }

    const reporting: SerializedVariantReportingFields = {
      posID: commonAttributes.posId?.value ?? null,
      starKisProductSubCategoryID: dto.starKisProductSubCategoryID,
      starKisProductCategoryID: dto.starKisProductCategoryID,
      pluReportingName: dto.pluReportingName,
      pluSecondaryCategoryID: dto.pluSecondaryCategoryID,
      pluPrimaryCategoryID: dto.pluPrimaryCategoryID,
      parentProductSku: dto.parentProductSku,
      productRange: dto.productRange,
    }

    const versionData: VersionCustomObjectPayload = {
      ...version.data,
      draft: {
        ...version.data.draft,
        reporting,
      },
      hasDraftChanges: !dto.isDuplicatedData,
    }

    if (dto.isDuplicatedData) {
      versionData.approved = {
        ...version.data.approved,
        reporting,
      }
    }

    await this._variantVersionUpdater.updateVariantVersion(versionKey, versionData)
  }
}
