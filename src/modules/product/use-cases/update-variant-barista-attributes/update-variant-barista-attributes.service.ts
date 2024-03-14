import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { Product } from '@commercetools/platform-sdk'

import { CtProductDao } from '../../../ct-product/ct-product.dao'
import { ProductTypeKey, ProductTypeKeyParser } from '../../../product-type/product-type-key'
import {
  ICanUpdateVariantVersion,
  VariantVersionUpdaterService,
} from '../../../variant-version/services/variant-version-updater/variant-version-updater.service'
import {
  ICanFetchVariantVersions,
  VariantVersionFetcherService,
} from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { ProductGroup } from '../../../../shared/model/product-group'
import { BaristaAttributes } from '../../../../shared/model/barista-attributes'
import { VersionEditabilityChecker } from '../../../variant-version/version-editability-checker'
import { VariantLiveDates } from '../../logic/models/variant-live-dates'
import { VariantVersion } from '../../../variant-version/model/variant-version'
import { SaveDuplicatedDataDto } from '../save-duplicated-data/save-duplicated-data.dto'
import { VersionCustomObjectPayload } from '../../../variant-version/model/version-custom-object'
import { ProductPublishStateValidator } from '../validate-product-publish-state/validate-product-publish-state'

import { UpdateVariantBaristaAttributesDao } from './update-variant-barista-attributes.dao'
import { UpdateVariantBaristaAttributesDto } from './update-variant-barista-attributes.dto'

@Injectable()
export class UpdateVariantBaristaAttributesService {
  private logger = new Logger(UpdateVariantBaristaAttributesService.name)

  constructor(
    private readonly _productDao: CtProductDao,
    private readonly _updateVariantBaristaAttributesDao: UpdateVariantBaristaAttributesDao,
    @Inject(VariantVersionUpdaterService)
    private readonly _variantVersionUpdater: ICanUpdateVariantVersion,
    @Inject(VariantVersionFetcherService)
    private readonly _variantVersionFetcher: ICanFetchVariantVersions,
  ) {}

  private checkIfBaristaOrThrow(product: Product) {
    const type = ProductTypeKeyParser.parseKey(product.productType.obj?.key)

    if (type !== ProductTypeKey.BaristaBeverage) {
      throw new BadRequestException('Only barista product can have variant attributes')
    }
  }

  async updateVariant(
    masterSku: string,
    variantSku: string,
    dto: UpdateVariantBaristaAttributesDto,
  ) {
    const product = await this._productDao.getOneProductBySkuOrThrow(masterSku)

    ProductPublishStateValidator.validateProductPublishState(product.masterData.published)

    this.checkIfBaristaOrThrow(product)

    return this._updateVariantBaristaAttributesDao
      .updateVariantBaristaAttributes(masterSku, variantSku, product.version, dto)
      .catch((e) => {
        this.logger.error(`Error updating barista attributes: ${e}`)
        throw new InternalServerErrorException('Error updating barista attributes')
      })
  }

  async updateVariantVersion(
    masterVariantSku: string,
    variantSku: string,
    versionKey: string,
    dto: UpdateVariantBaristaAttributesDto & SaveDuplicatedDataDto,
  ) {
    const productGroup = await this._productDao.getOneProductBySkuOrThrow(masterVariantSku)
    const product = new ProductGroup(productGroup)
    const version = await this._variantVersionFetcher.fetchVariantVersionByKeyOrThrow(versionKey)

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

    if (product.isFoodType()) {
      throw new BadRequestException('Barista attributes can be only set to BARISTA product type')
    }

    const baristaAttributes = new BaristaAttributes(dto)

    const versionData: VersionCustomObjectPayload = {
      ...version.data,
      draft: {
        ...version.data.draft,
        baristaAttributes,
      },
      hasDraftChanges: !dto.isDuplicatedData,
    }

    if (dto.isDuplicatedData) {
      versionData.approved = {
        ...version.data.approved,
        baristaAttributes,
      }
    }

    await this._variantVersionUpdater.updateVariantVersion(versionKey, versionData)
  }
}
