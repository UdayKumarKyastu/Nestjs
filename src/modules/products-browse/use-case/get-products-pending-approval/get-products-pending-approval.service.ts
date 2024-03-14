import { Inject, Injectable } from '@nestjs/common'
import { isAfter } from 'date-fns'
import { Product, ProductVariant } from '@commercetools/platform-sdk'
import { uniqBy } from 'lodash'

import { VariantVersion } from '../../../variant-version/model/variant-version'
import { ProductGroup } from '../../../../shared/model/product-group'
import { CommonProductVariantAttributes } from '../../../product-attributes/common-product-variant-attributes'
import { ProductImageService } from '../../../content-management/services/product-image.service'
import { Sku } from '../../../../shared/model/sku'
import { CountryCode } from '../../../../shared/model/country-code'
import { VariantVersionCustomObject } from '../../../variant-version/model/version-custom-object'
import { MultilangString } from '../../../product/logic/models/multilang-string'
import { ProductVariantChangesCounter } from '../../../product-variant/product-variant-changes-counter'
import { BaristaProductVariant, FoodProductVariant } from '../../../product-variant/product-variant'
import { mapChannelsToCtPrices } from '../../../ct-utils/get-channel-price'
import { CtAttributesResolver } from '../../../ct-utils/get-attribute-value'
import { ProductGroupChangesCounter } from '../../../product/product-group-changes-counter'
import { VariantNameAttribute } from '../../../product-attributes/barista-variant-attributes/variant-name-attribute'
import { DescriptionAttribute } from '../../../product-attributes/common-variant-attributes/description-attribute'

import { GetProductsPendingApprovalDto } from './dto/get-products-pending-approval.dto'
import {
  GetProductsWithStagedChangesService,
  ICanGetProductsWithStagedChanges,
} from './get-products-with-staged-changes.service'
import {
  GetVersionsWithStagedChangesService,
  ICanGetVersionsWithStagedChanges,
} from './get-versions-with-staged-changes.service'

export interface ICanGetPendingApprovalProducts {
  getProductsPendingApproval(params: {
    country?: CountryCode
  }): Promise<GetProductsPendingApprovalDto>
}

@Injectable()
export class GetProductsPendingApprovalService implements ICanGetPendingApprovalProducts {
  constructor(
    @Inject(GetProductsWithStagedChangesService)
    private _stagedProductsFetcher: ICanGetProductsWithStagedChanges,
    private _productImagesService: ProductImageService,
    @Inject(GetVersionsWithStagedChangesService)
    private _draftVersionsFetcher: ICanGetVersionsWithStagedChanges,
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

  private getAllVersionsWithDraftChanges = async (): Promise<
    Record<string, VariantVersionCustomObject>
  > => {
    return this._draftVersionsFetcher.getVersionsWithDraftChanges().then((objs) =>
      objs.reduce((acc, obj) => {
        acc[obj.id] = obj

        return acc
      }, {} as Record<string, VariantVersionCustomObject>),
    )
  }

  async getProductsPendingApproval(params: {
    country?: CountryCode
  }): Promise<GetProductsPendingApprovalDto> {
    const [stagedProducts] = await this._stagedProductsFetcher.getProducts(500, 0, params.country)
    const allVariants = this.extractAllVariantsFromProducts(stagedProducts)
    const productImagesRecord = await this.getAllVariantsImagesRecord(allVariants)
    const allNestedCustomObjectsRecord = await this.getAllVersionsWithDraftChanges()

    const versionsWithDraftChangesHgCodes = Object.values(allNestedCustomObjectsRecord)
      .filter((version) => version.value.hg?.country === params.country)
      .map((version) => version.value.hg?.hgCode)

    const productsWithVersionsWithDraftChanges =
      versionsWithDraftChangesHgCodes.length > 0
        ? await this._stagedProductsFetcher.getProductsContainingCustomObjectsWithDraftChanges(
            versionsWithDraftChangesHgCodes,
          )
        : []

    const stagedProductsWithoutDuplicates = uniqBy(
      [...stagedProducts, ...productsWithVersionsWithDraftChanges],
      'id',
    )

    return {
      productGroups: stagedProductsWithoutDuplicates
        .sort((p1, p2) => {
          const date1 = new Date(p1.lastModifiedAt)
          const date2 = new Date(p2.lastModifiedAt)

          return isAfter(date1, date2) ? -1 : 1
        })
        .map((product) => {
          const pg = new ProductGroup(product)
          const masterVariant = pg.getMasterVariant()
          const commonAttributes = new CommonProductVariantAttributes(masterVariant.attributes!)

          const variants = pg.getMasterAndAllVariants().map((variant, index) => {
            const commonAttributes = new CommonProductVariantAttributes(variant.attributes!)
            const stagedVariant = pg.getStagedVariant(variant.sku!)! || variant

            const versionsIDsWithDraftChanges = commonAttributes.versions.value.filter(
              (versionID) => {
                return Boolean(allNestedCustomObjectsRecord[versionID])
              },
            )

            const getAttributeValue = CtAttributesResolver.constructAttributeValueGetter(
              variant.attributes!,
            )

            const getStagedAttributeValue = CtAttributesResolver.constructAttributeValueGetter(
              stagedVariant.attributes!,
            )

            const variantName = getAttributeValue(VariantNameAttribute)
              ? new VariantNameAttribute(
                  getAttributeValue(VariantNameAttribute),
                ).toMultiLangString()
              : new MultilangString({})

            const stagedName = getStagedAttributeValue(VariantNameAttribute)
              ? new VariantNameAttribute(
                  getStagedAttributeValue(VariantNameAttribute),
                ).toMultiLangString()
              : new MultilangString({})

            const variantDescription = getAttributeValue(DescriptionAttribute)
              ? new VariantNameAttribute(
                  getAttributeValue(DescriptionAttribute),
                ).toMultiLangString()
              : new MultilangString({})

            const stagedDescription = getStagedAttributeValue(DescriptionAttribute)
              ? new VariantNameAttribute(
                  getStagedAttributeValue(DescriptionAttribute),
                ).toMultiLangString()
              : new MultilangString({})

            const isMaster = index === 0

            const changesCount = pg.isFoodType()
              ? new ProductVariantChangesCounter(
                  FoodProductVariant.create({
                    sku: new Sku(variant.sku!),
                    name: isMaster ? pg.getProductGroupName('current') : variantName,
                    prices: variant.prices ?? [],
                    description: isMaster
                      ? pg.getProductGroupDescription('current')
                      : variantDescription,
                    ctAttributes: variant.attributes!,
                  }),
                  FoodProductVariant.create({
                    sku: new Sku(variant.sku!),
                    name: isMaster ? pg.getProductGroupName('staged') : stagedName,
                    prices: stagedVariant.prices ?? [],
                    description: isMaster
                      ? pg.getProductGroupDescription('staged')
                      : stagedDescription,
                    ctAttributes: stagedVariant.attributes!,
                  }),
                ).countChanges()
              : new ProductVariantChangesCounter(
                  BaristaProductVariant.create({
                    sku: new Sku(variant.sku!),
                    name: isMaster ? pg.getProductGroupName('current') : stagedName,
                    prices: variant.prices ?? [],
                    description: isMaster
                      ? pg.getProductGroupDescription('current')
                      : stagedDescription,
                    ctAttributes: variant.attributes!,
                  }),
                  BaristaProductVariant.create({
                    sku: new Sku(variant.sku!),
                    name: isMaster ? pg.getProductGroupName('staged') : variantName,
                    prices: stagedVariant.prices ?? [],
                    description: isMaster
                      ? pg.getProductGroupDescription('staged')
                      : variantDescription,
                    ctAttributes: stagedVariant.attributes!,
                  }),
                ).countChanges()

            const versions = versionsIDsWithDraftChanges.map((versionID) => {
              const relatedVersionObj = allNestedCustomObjectsRecord[versionID]

              const rawName =
                relatedVersionObj.value.approved?.name ??
                relatedVersionObj.value.draft?.name ??
                pg.getProductGroupName('current')

              const variantVersion = VariantVersion.fromRawCtObject(
                relatedVersionObj.id,
                variant.sku!,
                relatedVersionObj.value,
              )

              const versionCtAttributes = VariantVersion.getVariantCtFieldsFromVersionObject(
                relatedVersionObj.value,
                variantVersion.approved,
                variant,
              )

              const versionCtDraftAttributes = VariantVersion.getVariantCtFieldsFromVersionObject(
                relatedVersionObj.value,
                variantVersion.draft,
                variant,
              )

              const versionChangesCount = pg.isFoodType()
                ? new ProductVariantChangesCounter(
                    FoodProductVariant.create({
                      sku: new Sku(variant.sku!),
                      name: variantVersion.approved.name || pg.getProductGroupName('current'),
                      prices: relatedVersionObj.value.approved?.pricing
                        ? mapChannelsToCtPrices(relatedVersionObj.value.approved?.pricing)
                        : [],
                      description:
                        variantVersion.approved.description ||
                        pg.getProductGroupDescription('current'),
                      ctAttributes: versionCtAttributes,
                    }),
                    FoodProductVariant.create({
                      sku: new Sku(variant.sku!),
                      name: variantVersion.draft.name || pg.getProductGroupName('current'),
                      prices: relatedVersionObj.value.draft?.pricing
                        ? mapChannelsToCtPrices(relatedVersionObj.value.draft?.pricing)
                        : [],
                      description:
                        variantVersion.draft.description ||
                        pg.getProductGroupDescription('current'),
                      ctAttributes: versionCtDraftAttributes,
                    }),
                  ).countChanges()
                : new ProductVariantChangesCounter(
                    BaristaProductVariant.create({
                      sku: new Sku(variant.sku!),
                      name: variantVersion.approved.name || new MultilangString({}),
                      prices: relatedVersionObj.value.approved?.pricing
                        ? mapChannelsToCtPrices(relatedVersionObj.value.approved?.pricing)
                        : [],
                      description: variantVersion.approved.description || new MultilangString({}),
                      ctAttributes: versionCtAttributes,
                    }),
                    BaristaProductVariant.create({
                      sku: new Sku(variant.sku!),
                      name: variantVersion.draft.name || new MultilangString({}),
                      prices: relatedVersionObj.value.draft?.pricing
                        ? mapChannelsToCtPrices(relatedVersionObj.value.draft?.pricing)
                        : [],
                      description: variantVersion.draft.description || new MultilangString({}),
                      ctAttributes: versionCtDraftAttributes,
                    }),
                  ).countChanges()

              return {
                name: new MultilangString(rawName).toDto(),
                sku: variant.sku!,
                isMaster: index === 0,
                recipeID: relatedVersionObj.value.hg.hgCode,
                imageUrl: productImagesRecord[variant.sku!],
                countryCode: commonAttributes.country.asEnum(),
                changesCount: versionChangesCount,
                versionNumber: relatedVersionObj.value.hg.version,
              }
            })

            return {
              name: pg.getProductGroupName('current'), // TODO Do we have any specific name for variant?
              imageUrl: productImagesRecord[variant.sku!],
              countryCode: commonAttributes.country.asEnum(),
              changesCount: changesCount,
              sku: variant.sku!,
              isMaster: index === 0,
              recipeID: commonAttributes.hgCode?.value ?? null,
              versions,
            }
          })

          const productChangesCount = new ProductGroupChangesCounter(
            pg.getMasterData().current,
            pg.getMasterData().staged,
          ).countChanges()

          const variantsChangesCount = variants.reduce((acc, variant) => {
            acc += variant.changesCount

            return acc
          }, 0)

          const versionsChangesCount = variants.reduce((acc, variant) => {
            const singleVersionsChangesCount = variant.versions.reduce((total, version) => {
              return (total += version.changesCount)
            }, 0)

            return (acc += singleVersionsChangesCount)
          }, 0)

          return {
            changesCount: productChangesCount + variantsChangesCount + versionsChangesCount,
            countryCode: commonAttributes.country.asEnum(),
            sku: pg.getMasterVariant().sku,
            name: pg.getProductGroupName('current'),
            imageUrl: productImagesRecord[masterVariant.sku!],
            variants:
              versionsChangesCount > 0
                ? variants
                : variants.filter((variant) => variant.changesCount > 0),
          }
        })
        .filter((productGroup) => productGroup.changesCount > 0),
    }
  }
}
