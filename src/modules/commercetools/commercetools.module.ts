import { Module } from '@nestjs/common'

import { ConfigurationModule } from '../../configuration/configuration.module'

import { commercetoolsConnectionProvider } from './commercetools-connection.provider'
import { CommercetoolsContext } from './commercetools-context'
import { CommercetoolsCustomObjectDao } from './commercetools-custom-object.dao'

@Module({
  imports: [ConfigurationModule],
  providers: [commercetoolsConnectionProvider, CommercetoolsContext, CommercetoolsCustomObjectDao],
  exports: [CommercetoolsContext, CommercetoolsCustomObjectDao],
})
export class CommerceToolsModule {}
