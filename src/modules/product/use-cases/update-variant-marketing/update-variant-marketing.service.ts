import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { difference } from 'lodash'

import { VariantHowToDisplayDao } from '../../../variant-how-to-display/variant-how-to-display.dao'
import { CtProductDao } from '../../../ct-product/ct-product.dao'
import { ProductTypeKey, ProductTypeKeyParser } from '../../../product-type/product-type-key'
import { RawCommercetoolsProductTypeAttributes } from '../../../product-attributes/raw-commercetools-product-type-attributes'
import { VariantMarketingFactory } from '../../logic/models/variant-marketing'
import { VariantVersionUpdaterService } from '../../../variant-version/services/variant-version-updater/variant-version-updater.service'
import { VariantVersionsHelper } from '../../../variant-version/util/variant-versions-helper/variant-versions-helper'
import { VariantAvailability } from '../../../../shared/model/variant-availability'
import { VariantVersionFetcherService } from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { VariantHowToDisplay } from '../../../../shared/model/variant-how-to-display'
import { VariantLiveDates } from '../../logic/models/variant-live-dates'
import { VariantVersion } from '../../../variant-version/model/variant-version'
import { VersionEditabilityChecker } from '../../../variant-version/version-editability-checker'
import { ProductGroup } from '../../../../shared/model/product-group'
import { SaveDuplicatedDataDto } from '../save-duplicated-data/save-duplicated-data.dto'
import {
  VersionCustomObjectPayload,
  VariantVersionPortalFields,
} from '../../../variant-version/model/version-custom-object'
import { ProductPublishStateValidator } from '../validate-product-publish-state/validate-product-publish-state'

import { UpdateVariantMarketingDao } from './update-variant-marketing.dao'
import { UpdateVariantMarketingDto } from './update-variant-marketing.dto'
import { UpdateVariantMarketingActionsResolver } from './update-variant-marketing-actions-resolver'

@Injectable()
export class UpdateVariantMarketingService {
  private _variantMarketingFactory = new VariantMarketingFactory()

  constructor(
    private readonly _productDao: CtProductDao,
    private readonly _updateVariantMarketingDao: UpdateVariantMarketingDao,
    private readonly _howToDisplayDao: VariantHowToDisplayDao,
    private readonly _updateVariantMarketingActionsResolver: UpdateVariantMarketingActionsResolver,
    private readonly _variantVersionUpdater: VariantVersionUpdaterService,
    private readonly _variantVersionFetcher: VariantVersionFetcherService,
  ) {}

  private async validateHtdOptions(
    productTypeKey: ProductTypeKey,
    howToDisplay: UpdateVariantMarketingDto['howToDisplay'],
  ) {
    const availableHowToDisplay = await this._howToDisplayDao.findAll(productTypeKey)

    const htdAvailableKeys = availableHowToDisplay.map((available) => available.key)
    const notAvailableKeys = difference(howToDisplay, htdAvailableKeys)

    if (notAvailableKeys.length > 0) {
      throw new BadRequestException(
        `Invalid howToDisplay value. ${notAvailableKeys[0]} is not valid Key`,
      )
    }
  }

  private async resolveRelatedVariant(masterVariantSku: string, variantSku: string) {
    const productGroup = await this._productDao.getOneProductBySkuOrThrow(masterVariantSku)

    const productData = productGroup.masterData.hasStagedChanges
      ? productGroup.masterData.staged
      : productGroup.masterData.current

    const variants = [productData.masterVariant, ...productData.variants]

    const variant = variants.find((variant) => variant.sku === variantSku)

    if (!variant) {
      throw new NotFoundException(`The Product with sku '${variantSku}' was not found`)
    }

    return [productGroup, variant] as const
  }

  async updateLiveVariant(
    masterVariantSku: string,
    variantSku: string,
    dto: UpdateVariantMarketingDto,
  ) {
    const [productGroup, variant] = await this.resolveRelatedVariant(masterVariantSku, variantSku)

    ProductPublishStateValidator.validateProductPublishState(productGroup.masterData.published)

    const productTypeKey = ProductTypeKeyParser.parseKey(productGroup.productType.obj?.key)

    await Promise.all([this.validateHtdOptions(productTypeKey, dto.howToDisplay)])

    const variantMarketing = this._variantMarketingFactory.createFromUpdateDto(dto)

    const isMaster = variantSku === masterVariantSku

    const rawVariantAttributes = new RawCommercetoolsProductTypeAttributes(variant.attributes!)

    const actions = this._updateVariantMarketingActionsResolver.resolveActions(
      variant.sku!,
      productTypeKey,
      variantMarketing,
      {
        liveFrom: rawVariantAttributes.liveFrom || null,
        liveTo: rawVariantAttributes.liveTo || null,
        newUntil: rawVariantAttributes.newUntil || null,
      },
      isMaster,
    )

    await this._updateVariantMarketingDao.updateVariantMarketing(
      masterVariantSku,
      productGroup.version,
      actions,
    )
  }

  async updateVariantVersion(
    masterVariantSku: string,
    variantSku: string,
    versionKey: string,
    dto: UpdateVariantMarketingDto & SaveDuplicatedDataDto,
  ) {
    const [productGroup, variant] = await this.resolveRelatedVariant(masterVariantSku, variantSku)

    const productTypeKey = ProductTypeKeyParser.parseKey(productGroup.productType.obj?.key)

    await this.validateHtdOptions(productTypeKey, dto.howToDisplay)

    const variantMarketing = this._variantMarketingFactory.createFromUpdateDto(dto)

    const version = await this._variantVersionFetcher.fetchVariantVersionByKeyOrThrow(versionKey)

    new VariantVersionsHelper(variant).hasVersionWithId(
      version.id,
      new BadRequestException('Version not related to variant'),
    )

    const editabilityChecker = new VersionEditabilityChecker(
      VariantLiveDates.fromCtVariant(
        new ProductGroup(productGroup).getVariantBySkuOrThrow(variantSku),
      ),
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

    const versionMarketing: Pick<
      VariantVersionPortalFields,
      'name' | 'description' | 'availability' | 'howToDisplay'
    > = {
      name: variantMarketing.name,
      description: variantMarketing.description,
      availability: VariantAvailability.fromUpdateVariantMarketingDto(dto).serialize(),
      howToDisplay: new VariantHowToDisplay(dto.howToDisplay),
    }

    const versionData: VersionCustomObjectPayload = {
      ...version.data,
      draft: {
        ...version.data.draft,
        ...versionMarketing,
      },
      hasDraftChanges: !dto.isDuplicatedData,
    }

    if (dto.isDuplicatedData) {
      versionData.approved = {
        ...version.data.approved,
        ...versionMarketing,
      }
    }

    await this._variantVersionUpdater.updateVariantVersion(versionKey, versionData)
  }
}
