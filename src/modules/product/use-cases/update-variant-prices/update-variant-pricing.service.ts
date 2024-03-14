import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'

import { CtProductDao } from '../../../ct-product/ct-product.dao'
import {
  ICanUpdateVariantVersion,
  VariantVersionUpdaterService,
} from '../../../variant-version/services/variant-version-updater/variant-version-updater.service'
import {
  ICanFetchVariantVersions,
  VariantVersionFetcherService,
} from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { ChannelPrice } from '../../../../shared/model/channel-price'
import { VersionEditabilityChecker } from '../../../variant-version/version-editability-checker'
import { VariantLiveDates } from '../../logic/models/variant-live-dates'
import { VariantVersion } from '../../../variant-version/model/variant-version'
import { ProductGroup } from '../../../../shared/model/product-group'
import { SaveDuplicatedDataDto } from '../save-duplicated-data/save-duplicated-data.dto'
import { VersionCustomObjectPayload } from '../../../variant-version/model/version-custom-object'
import { CommonProductVariantAttributes } from '../../../product-attributes/common-product-variant-attributes'
import { CountryCode } from '../../../../shared/model/country-code'
import { ReviewStatusService } from '../../logic/review-status/review-status.service'
import { ProductPublishStateValidator } from '../validate-product-publish-state/validate-product-publish-state'

import { UpdateVariantPricingDao } from './update-variant-pricing.dao'
import { UpdateVariantPricingDto } from './update-variant-pricing.dto'

@Injectable()
export class UpdateVariantPricingService {
  private logger = new Logger(UpdateVariantPricingService.name)

  constructor(
    private readonly _productDao: CtProductDao,
    private readonly _updateVariantPricingDao: UpdateVariantPricingDao,

    @Inject(VariantVersionUpdaterService)
    private readonly _variantVersionUpdater: ICanUpdateVariantVersion,

    @Inject(VariantVersionFetcherService)
    private readonly _variantVersionFetcher: ICanFetchVariantVersions,

    private readonly _reviewStatusService: ReviewStatusService,
  ) {}

  async updateVariant(masterSku: string, variantSku: string, dto: UpdateVariantPricingDto) {
    const product = await this._productDao.getOneProductBySkuOrThrow(masterSku)

    ProductPublishStateValidator.validateProductPublishState(product.masterData.published)

    const attributes = product.masterData.current.masterVariant.attributes

    const { country } = new CommonProductVariantAttributes(attributes)

    return this._updateVariantPricingDao
      .updateVariantPricing(
        masterSku,
        variantSku,
        product.version,
        dto,
        country.value as CountryCode,
      )
      .catch((e) => {
        this.logger.error(`Error updating pricing: ${e}`)
        throw new InternalServerErrorException('Error updating pricing')
      })
  }

  async updateVersion(
    masterSku: string,
    variantSku: string,
    versionKey: string,
    dto: UpdateVariantPricingDto & SaveDuplicatedDataDto,
  ): Promise<void> {
    const productGroup = await this._productDao.getOneProductBySkuOrThrow(masterSku)
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

    const versionPricing = dto.prices.map((priceDto) => ChannelPrice.fromDto(priceDto))

    const versionData: VersionCustomObjectPayload = {
      ...version.data,
      draft: {
        ...version.data.draft,
        pricing: versionPricing,
      },
      hasDraftChanges: !dto.isDuplicatedData,
    }

    if (dto.isDuplicatedData) {
      versionData.approved = {
        ...version.data.approved,
        pricing: versionPricing,
      }
    }

    await this._variantVersionUpdater.updateVariantVersion(versionKey, versionData)
  }
}
