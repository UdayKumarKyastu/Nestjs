import { Module } from '@nestjs/common'

import { ConfigurationModule } from '../../configuration/configuration.module'

import { contentfulClientConnectionProvider } from './contentful/contentful-client-connection.provider'
import { ProductImageService } from './services/product-image.service'

@Module({
  imports: [ConfigurationModule],
  providers: [contentfulClientConnectionProvider, ProductImageService],
  exports: [ProductImageService],
})
export class ContentManagementModule {}
