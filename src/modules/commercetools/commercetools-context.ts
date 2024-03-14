import { ByProjectKeyProductProjectionsRequestBuilder } from '@commercetools/platform-sdk/dist/generated/client/product-projections/by-project-key-product-projections-request-builder'
import { ByProjectKeyProductsRequestBuilder } from '@commercetools/platform-sdk/dist/generated/client/products/by-project-key-products-request-builder'
import { Inject, Injectable } from '@nestjs/common'
import { ByProjectKeyTaxCategoriesRequestBuilder } from '@commercetools/platform-sdk/dist/generated/client/tax-categories/by-project-key-tax-categories-request-builder'
import { ByProjectKeyProductTypesRequestBuilder } from '@commercetools/platform-sdk/dist/generated/client/product-types/by-project-key-product-types-request-builder'
import { ByProjectKeyCategoriesRequestBuilder } from '@commercetools/platform-sdk/dist/generated/client/categories/by-project-key-categories-request-builder'
import { ByProjectKeyChannelsRequestBuilder } from '@commercetools/platform-sdk/dist/generated/client/channels/by-project-key-channels-request-builder'
import { ByProjectKeyCustomObjectsRequestBuilder } from '@commercetools/platform-sdk/dist/generated/client/custom-objects/by-project-key-custom-objects-request-builder'

import { CommercetoolsConnectionToken } from './commercetools-connection.token'
import { CommercetoolsRequestBuilder } from './commercetools-request-builder.interface'

export interface IHasCtCategoriesBuilder {
  readonly categories: ByProjectKeyCategoriesRequestBuilder
}

export interface IHasCtCustomObjectBuilder {
  readonly customObjects: ByProjectKeyCustomObjectsRequestBuilder
}

@Injectable()
export class CommercetoolsContext implements IHasCtCategoriesBuilder, IHasCtCustomObjectBuilder {
  readonly productProjections: ByProjectKeyProductProjectionsRequestBuilder
  readonly taxCategoriesProjections: ByProjectKeyTaxCategoriesRequestBuilder
  readonly products: ByProjectKeyProductsRequestBuilder
  readonly productTypes: ByProjectKeyProductTypesRequestBuilder
  readonly categories: ByProjectKeyCategoriesRequestBuilder
  readonly channels: ByProjectKeyChannelsRequestBuilder
  readonly customObjects: ByProjectKeyCustomObjectsRequestBuilder

  constructor(
    @Inject(CommercetoolsConnectionToken)
    ctConnection: CommercetoolsRequestBuilder,
  ) {
    this.productProjections = ctConnection.productProjections()
    this.taxCategoriesProjections = ctConnection.taxCategories()
    this.products = ctConnection.products()
    this.productTypes = ctConnection.productTypes()
    this.categories = ctConnection.categories()
    this.channels = ctConnection.channels()
    this.customObjects = ctConnection.customObjects()
  }
}
