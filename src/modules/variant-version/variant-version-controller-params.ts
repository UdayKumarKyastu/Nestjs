import { IsString } from 'class-validator'
import { applyDecorators } from '@nestjs/common'
import { ApiParam, ApiTags } from '@nestjs/swagger'

import { SwaggerApiTag } from '../../shared/swagger-api-tag'

export class VariantVersionControllerParams {
  @IsString()
  masterSku!: string

  @IsString()
  variantSku!: string

  @IsString()
  versionKey!: string
}

export const VariantVersionControllerParamsSwagger = applyDecorators(
  ApiTags(SwaggerApiTag.ProductVariant, SwaggerApiTag.VariantVersion),
  ApiParam({
    name: 'versionKey',
    required: true,
    example: 'FP00000226-1',
  }),
  ApiParam({
    name: 'masterSku',
    required: true,
    example: 'UK12345',
  }),
  ApiParam({
    name: 'variantSku',
    required: true,
    example: 'UK12346',
  }),
)
