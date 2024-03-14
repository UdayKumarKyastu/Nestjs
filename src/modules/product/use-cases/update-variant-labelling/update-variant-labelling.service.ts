import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'

import { CtProductDao } from '../../../ct-product/ct-product.dao'
import { LabellingOptionsValidator } from '../../../labelling-options/labelling-options-validator'
import { ProductGroup } from '../../../../shared/model/product-group'
import { VariantLabelling } from '../../../../shared/model/variant-labelling'
import {
  ICanUpdateVariantVersion,
  VariantVersionUpdaterService,
} from '../../../variant-version/services/variant-version-updater/variant-version-updater.service'
import {
  ICanFetchVariantVersions,
  VariantVersionFetcherService,
} from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import { VersionEditabilityChecker } from '../../../variant-version/version-editability-checker'
import { VariantLiveDates } from '../../logic/models/variant-live-dates'
import { VariantVersion } from '../../../variant-version/model/variant-version'
import { BarcodeService } from '../../../barcode/barcode.service'
import { Ean13CodeAttribute } from '../../../product-attributes/food-variant-attributes/ean-13-code-attribute'
import { SaveDuplicatedDataDto } from '../save-duplicated-data/save-duplicated-data.dto'
import {
  VersionCustomObjectPayload,
  VariantVersionPortalFields,
} from '../../../variant-version/model/version-custom-object'
import { ProductPublishStateValidator } from '../validate-product-publish-state/validate-product-publish-state'

import { UpdateVariantLabellingDao } from './update-variant-labelling.dao'
import { UpdateVariantLabellingDto } from './update-variant-labelling.dto'

@Injectable()
export class UpdateVariantLabellingService {
  private logger = new Logger(UpdateVariantLabellingService.name)

  constructor(
    private readonly _productDao: CtProductDao,
    private readonly _updateVariantLabellingDao: UpdateVariantLabellingDao,
    private readonly _labellingOptionsValidator: LabellingOptionsValidator,
    @Inject(VariantVersionUpdaterService)
    private readonly _variantVersionUpdater: ICanUpdateVariantVersion,
    @Inject(VariantVersionFetcherService)
    private readonly _variantVersionFetcher: ICanFetchVariantVersions,
    private readonly _barcodeService: BarcodeService,
  ) {}

  private async validateDto(masterSku: string, dto: UpdateVariantLabellingDto) {
    const validators: Promise<void>[] = []

    if (dto.ean13Code) {
      const productsWithThisBarcode = await this._barcodeService
        .getProductsWithBarcode(new Ean13CodeAttribute(dto.ean13Code))
        .then((products) => products.filter((p) => p.key !== masterSku))

      if (productsWithThisBarcode.length > 0) {
        throw new ConflictException(
          `Product with ean ${dto.ean13Code} exists: ${productsWithThisBarcode[0].key}`,
        )
      }
    }

    if (dto.storageConditions) {
      validators.push(
        this._labellingOptionsValidator.validateLabellingOptionKey(
          'instructionsForUse',
          dto.storageConditions,
        ),
      )
    }
    if (dto.sellBy) {
      validators.push(
        this._labellingOptionsValidator.validateLabellingOptionKey('sellBy', dto.sellBy),
      )
    }
    if (dto.useBy) {
      validators.push(
        this._labellingOptionsValidator.validateLabellingOptionKey('useBy', dto.useBy),
      )
    }

    if (dto.useByTurboChef) {
      validators.push(
        this._labellingOptionsValidator.validateLabellingOptionKey('useBy', dto.useByTurboChef),
      )
    }

    if (dto.sellByTurboChef) {
      validators.push(
        this._labellingOptionsValidator.validateLabellingOptionKey('sellBy', dto.sellByTurboChef),
      )
    }

    if (dto.productServes) {
      validators.push(
        this._labellingOptionsValidator.validateLabellingOptionKey(
          'productServes',
          dto.productServes,
        ),
      )
    }

    return Promise.all(validators)
  }

  async update(masterSku: string, variantSku: string, dto: UpdateVariantLabellingDto) {
    const product = await this._productDao.getOneProductBySkuOrThrow(masterSku)
    const productGroup = new ProductGroup(product)

    ProductPublishStateValidator.validateProductPublishState(productGroup.getMasterData().published)

    if (productGroup.isBaristaType()) {
      throw new BadRequestException('Labelling can be updated only for FOOD product type')
    }

    productGroup.getVariantBySkuOrThrow(variantSku)

    await this.validateDto(masterSku, dto)

    const draftVariant = [
      product.masterData.staged.masterVariant,
      ...product.masterData.staged.variants,
    ].find((variant) => variant.sku === variantSku)

    const draftLabelling = VariantLabelling.fromCtVariant(draftVariant!)

    return this._updateVariantLabellingDao
      .updateVariantLabelling(masterSku, variantSku, product.version, dto, draftLabelling)
      .catch((e) => {
        this.logger.error(`Error updating variant labelling: ${e}`)
        throw new InternalServerErrorException('Error updating variant labelling')
      })
  }

  async updateVersion(
    masterSku: string,
    variantSku: string,
    versionKey: string,
    dto: UpdateVariantLabellingDto & SaveDuplicatedDataDto,
  ) {
    const product = await this._productDao.getOneProductBySkuOrThrow(masterSku)
    const productGroup = new ProductGroup(product)

    if (productGroup.isBaristaType()) {
      throw new BadRequestException('Labelling can be updated only for FOOD product type')
    }

    await this.validateDto(masterSku, dto)

    const version = await this._variantVersionFetcher.fetchVariantVersionByKeyOrThrow(versionKey)

    const editabilityChecker = new VersionEditabilityChecker(
      VariantLiveDates.fromCtVariant(productGroup.getVariantBySkuOrThrow(variantSku)),
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

    if (productGroup.isBaristaType()) {
      throw new BadRequestException('Labelling attributes can be only set to FOOD product type')
    }

    const labelling = new VariantLabelling({
      storageConditions: dto.storageConditions,
      useBy: dto.useBy,
      sellBy: dto.sellBy,
      legalTitle: dto.legalTitle,
      countryOfOriginDescription: dto.countryOfOriginDescription,
      includeAverageWeightOnLabel: dto.includeAverageWeightOnLabel,
      ean13Code: dto.ean13Code,
      includeNutritionalInformationOnLabel: dto.includeNutritionalInformationOnLabel,
      canBeCookedInTurboChef: dto.canBeCookedInTurboChef,
      useByTurboChef: dto.useByTurboChef,
      sellByTurboChef: dto.sellByTurboChef,
      productServes: dto.productServes,
    })

    const versionLabelling: VariantVersionPortalFields['labelling'] = {
      ean13Code: labelling.ean13Code?.value ?? null,
      includeAverageWeightOnLabel: labelling.includeAverageWeightOnLabel.value,
      storageConditions: labelling.storageConditions?.value ?? null,
      legalTitle: labelling.legalTitle?.value ?? null,
      sellBy: labelling.sellBy?.value ?? null,
      useBy: labelling.useBy?.value ?? null,
      countryOfOriginDescription: labelling.countryOfOriginDescription?.value ?? null,
      includeNutritionalInformationOnLabel: labelling.includeNutritionalInformationOnLabel.value,
      canBeCookedInTurboChef: labelling.canBeCookedInTurboChef.value,
      useByTurboChef: labelling.useByTurboChef?.value ?? null,
      sellByTurboChef: labelling.sellByTurboChef?.value ?? null,
      productServes: labelling.productServes?.value ?? null,
    }

    const versionData: VersionCustomObjectPayload = {
      ...version.data,
      draft: {
        ...version.data.draft,
        labelling: versionLabelling,
      },
      hasDraftChanges: !dto.isDuplicatedData,
    }

    if (dto.isDuplicatedData) {
      versionData.approved = {
        ...version.data.approved,
        labelling: versionLabelling,
      }
    }

    await this._variantVersionUpdater.updateVariantVersion(versionKey, versionData)
  }
}
