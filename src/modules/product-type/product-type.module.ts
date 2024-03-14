import { Module } from '@nestjs/common'

import { CommerceToolsModule } from '../commercetools/commercetools.module'

import { ProductTypeDao } from './product-type.dao'

@Module({
  imports: [CommerceToolsModule],
  providers: [ProductTypeDao],
  exports: [ProductTypeDao],
})
export class ProductTypeModule {}
