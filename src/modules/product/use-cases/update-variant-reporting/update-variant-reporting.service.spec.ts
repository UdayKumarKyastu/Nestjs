import {
  ClientResponse,
  Product,
  ProductUpdateAction,
  ProductVariant,
} from '@commercetools/platform-sdk'

import { VariantReportingOptionsDto } from '../../../variant-reporting/variant-reporting-options.dto'
import { ICanGetCtProduct } from '../../../ct-product/ct-product.dao'
import { IReportingOptionsResolverService } from '../../../variant-reporting/reporting-options-resolver.service'
import { ProductTypeKey } from '../../../product-type/product-type-key'
import { ICanUpdateVariantVersion } from '../../../variant-version/services/variant-version-updater/variant-version-updater.service'
import {
  ICanFetchVariantVersions,
  VariantVersionWithId,
  VariantVersionWithIdAndModel,
} from '../../../variant-version/services/variant-version-fetcher/variant-version-fetcher.service'
import {
  VariantVersionCustomObject,
  VersionCustomObjectPayload,
} from '../../../variant-version/model/version-custom-object'
import { MultiLangStringMockFactory } from '../../logic/models/multilang-string'
import { VariantVersion } from '../../../variant-version/model/variant-version'
import { PosIdAttribute } from '../../../product-attributes/common-variant-attributes/pos-id-attribute'

import { UpdateVariantReportingService } from './update-variant-reporting.service'
import { IUpdateVariantReportingDao } from './update-variant-reporting.dao'

const masterSku = 'UK10000'
const version = 1
const reportingNameCurrent = 'current-reporting-name'
const pluPrimaryCurrent = 'current-plu-primary'
const pluSecondaryCurrent = 'current-plu-secondary'
const starKisCategoryCurrent = 'current-category'
const starKisSubCategoryCurrent = 'current-sub-category'
const parentProductSkuCurrent = 'current-test-sku'
const productRangeCurrent = ['current-product-range']

const getMockProductToUpdate = (): Product => {
  return {
    version,
    productType: {
      obj: {
        key: ProductTypeKey.BaristaBeverage,
      },
    },
    key: masterSku,
    masterData: {
      current: {
        masterVariant: {
          sku: masterSku,
          attributes: [
            {
              name: PosIdAttribute.COMMERCE_TOOLS_ATTR_NAME,
              value: null,
            },
            {
              name: 'pluReportingName',
              value: reportingNameCurrent,
            },
            {
              name: 'pluPrimaryCategory',
              value: {
                key: pluPrimaryCurrent,
              },
            },
            {
              name: 'pluSecondaryCategory',
              value: {
                key: pluSecondaryCurrent,
              },
            },
            {
              name: 'productCategory',
              value: {
                key: starKisCategoryCurrent,
              },
            },
            {
              name: 'productSubCategory',
              value: {
                key: starKisSubCategoryCurrent,
              },
            },
            {
              name: 'parentProductSku',
              value: parentProductSkuCurrent,
            },
            {
              name: 'productRange',
              value: productRangeCurrent.map((key) => ({
                key,
              })),
            },
          ],
          key: masterSku,
        },
      },
      staged: {
        masterVariant: {
          sku: masterSku,
          attributes: [
            {
              name: 'posId',
              value: null,
            },
            {
              name: 'pluReportingName',
              value: reportingNameCurrent,
            },
            {
              name: 'pluPrimaryCategory',
              value: {
                key: pluPrimaryCurrent,
              },
            },
            {
              name: 'pluSecondaryCategory',
              value: {
                key: pluSecondaryCurrent,
              },
            },
            {
              name: 'productCategory',
              value: {
                key: starKisCategoryCurrent,
              },
            },
            {
              name: 'productSubCategory',
              value: {
                key: starKisSubCategoryCurrent,
              },
            },
            {
              name: 'parentProductSku',
              value: parentProductSkuCurrent,
            },
            {
              name: 'productRange',
              value: productRangeCurrent.map((key) => ({
                key,
              })),
            },
          ],
          key: masterSku,
        },
        variants: [],
      },
      published: true,
    },
  } as any as Product
}

describe('UpdateVariantReportingService', () => {
  let reportingOptionsResolver!: IReportingOptionsResolverService
  let productDao!: ICanGetCtProduct & { mockProduct: Product }
  let mockUpdateReporting = jest.fn()
  let updateReportingDao: IUpdateVariantReportingDao
  let variantVersionUpdater: ICanUpdateVariantVersion
  let variantVersionFetcher: ICanFetchVariantVersions & {
    mock: VersionCustomObjectPayload
  }

  beforeEach(() => {
    mockUpdateReporting = jest.fn()

    reportingOptionsResolver = {
      async constructDto(): Promise<VariantReportingOptionsDto> {
        return {
          starKisCategoryOptions: [
            {
              key: starKisCategoryCurrent,
              label: 'Coffee',
              children: [
                {
                  key: starKisSubCategoryCurrent,
                  label: 'Cold Coffee',
                },
              ],
            },
          ],
          pluCategoryOptions: [
            {
              key: pluPrimaryCurrent,
              label: 'Coffee',
              children: [
                {
                  key: pluSecondaryCurrent,
                  label: 'Cold Coffee',
                },
              ],
            },
          ],
        }
      },
    }

    productDao = {
      mockProduct: getMockProductToUpdate(),
      async getOneProductBySku(sku: string): Promise<Product | null> {
        return Promise.resolve(this.mockProduct)
      },
      async getOneProductBySkuOrThrow(sku: string): Promise<Product> {
        return Promise.resolve(this.mockProduct)
      },
    }

    updateReportingDao = {
      async updateVariantReporting(
        masterVariantSku: string,
        currentProductVersion: number,
        actions: ProductUpdateAction[],
      ): Promise<void> {
        mockUpdateReporting(masterVariantSku, currentProductVersion, actions)
      },
    }

    variantVersionUpdater = {
      async updateVariantVersion(
        versionKey: string,
        data: VersionCustomObjectPayload,
      ): Promise<ClientResponse<VariantVersionCustomObject>> {
        return null as any
      },
    }

    variantVersionFetcher = {
      mock: {
        hg: {
          liveFrom: '2020-01-01T10:00:00',
          hgCode: 'FP123',
          lastUpdatedFromHG: '2020-01-01T10:00:00',
          ingredients: { 'en-GB': '' },
          name: 'name',
          version: 1,
          suitableForVegetarians: true,
          country: 'UK',
          localizedClaims: [],
          localizedContainsAllergens: [],
          nutritionals: [],
          averageWeight: 123,
          suitableForVegans: true,
          productCountry: 'UK',
          productId: {
            code: 'FP1234',
            version: '1',
          },
          constituentItems: [],
          hgRecipeStatus: 'Approved',
          recipeType: [],
        },
        key: 'FP1234',
        draft: {
          name: MultiLangStringMockFactory.createMultiLangString('name'),
        },
        approved: {
          name: MultiLangStringMockFactory.createMultiLangString('name'),
        },
      },

      async fetchVariantVersionByKeyOrThrow(versionKey: string): Promise<VariantVersionWithId> {
        return {
          id: 'UUID',
          data: this.mock,
        }
      },
      async fetchVariantVersionsForIDs(
        variantsIDs: string[],
      ): Promise<Array<VariantVersionWithId>> {
        return [
          {
            id: 'UUId',
            data: this.mock,
          },
        ]
      },
      async fetchVariantVersionsForVariant(
        sku: string,
        hasAttributes: Pick<ProductVariant, 'attributes'>,
      ): Promise<VariantVersionWithIdAndModel[]> {
        return [
          {
            id: 'UUID',
            data: this.mock,
            model: VariantVersion.fromRawCtObject('id', sku, this.mock),
          },
        ]
      },
    }
  })

  describe('Calls CT update function with proper actions list', () => {
    it('Sends empty actions if all values are the same as existing', () => {
      const service = new UpdateVariantReportingService(
        reportingOptionsResolver,
        productDao,
        updateReportingDao,
        variantVersionUpdater,
        variantVersionFetcher,
      )

      return service
        .updateVariant(masterSku, masterSku, {
          starKisProductCategoryID: starKisCategoryCurrent,
          pluSecondaryCategoryID: pluSecondaryCurrent,
          pluPrimaryCategoryID: pluPrimaryCurrent,
          pluReportingName: reportingNameCurrent,
          starKisProductSubCategoryID: starKisSubCategoryCurrent,
          parentProductSku: parentProductSkuCurrent,
          productRange: productRangeCurrent,
        })
        .then(() => {
          expect(mockUpdateReporting).toHaveBeenCalledWith(masterSku, version, [])
        })
    })

    it('Sets nulls if send in the DTO', () => {
      const service = new UpdateVariantReportingService(
        reportingOptionsResolver,
        productDao,
        updateReportingDao,
        variantVersionUpdater,
        variantVersionFetcher,
      )

      return service
        .updateVariant(masterSku, masterSku, {
          starKisProductCategoryID: null,
          pluSecondaryCategoryID: null,
          pluPrimaryCategoryID: null,
          pluReportingName: null,
          starKisProductSubCategoryID: null,
          parentProductSku: null,
          productRange: [],
        })
        .then(() => {
          expect(mockUpdateReporting).toHaveBeenCalledWith(masterSku, version, [
            {
              action: 'setAttribute',
              name: 'pluReportingName',
              sku: masterSku,
              value: null,
            },
            {
              action: 'setAttribute',
              name: 'pluPrimaryCategory',
              sku: masterSku,
              value: null,
            },
            {
              action: 'setAttribute',
              name: 'pluSecondaryCategory',
              sku: masterSku,
              value: null,
            },
            {
              action: 'setAttribute',
              name: 'productCategory',
              sku: masterSku,
              value: null,
            },
            {
              action: 'setAttribute',
              name: 'productSubCategory',
              sku: masterSku,
              value: null,
            },
            {
              action: 'setAttribute',
              name: 'productRange',
              sku: masterSku,
              value: [],
            },
          ])
        })
    })

    it('Adds parentProductSku attribute if updated product is FOOD', () => {
      ;(productDao.mockProduct.productType.obj!.key as string) = ProductTypeKey.Food

      const service = new UpdateVariantReportingService(
        reportingOptionsResolver,
        productDao,
        updateReportingDao,
        variantVersionUpdater,
        variantVersionFetcher,
      )

      return service
        .updateVariant(masterSku, masterSku, {
          starKisProductCategoryID: starKisCategoryCurrent,
          pluSecondaryCategoryID: pluSecondaryCurrent,
          pluPrimaryCategoryID: pluPrimaryCurrent,
          pluReportingName: reportingNameCurrent,
          starKisProductSubCategoryID: starKisSubCategoryCurrent,
          parentProductSku: 'FOO_BAR',
          productRange: productRangeCurrent,
        })
        .then(() => {
          expect(mockUpdateReporting).toHaveBeenCalledWith(masterSku, version, [
            {
              action: 'setAttribute',
              name: 'parentProductSku',
              sku: 'UK10000',
              value: 'FOO_BAR',
            },
          ])
        })
    })

    it.todo('Calls version updater with reporting draft applied. Preserves already saved values')
  })
})
