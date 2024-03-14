import { Module } from '@nestjs/common'

import { CommerceToolsModule } from '../commercetools/commercetools.module'

import { CtProductDao } from './ct-product.dao'

@Module({
  imports: [CommerceToolsModule],
  providers: [CtProductDao],
  exports: [CtProductDao],
})
export class CtProductModule {}
