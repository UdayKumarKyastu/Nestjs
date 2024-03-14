import { IsEnum, IsString, IsUUID, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { ProductVariantDto } from '../../../../shared/dto/product-variant.dto'
import { ProductVariantDraftChangesDto } from '../../../../shared/dto/product-variant-draft-changes.dto'
import { VariantVersionPublishState } from '../../model/variant-version-publish-state'

class VersionCompletedTabs {
  @ApiProperty()
  marketing!: boolean

  @ApiProperty()
  reporting!: boolean

  @ApiProperty()
  pricing!: boolean

  @ApiProperty()
  labelling?: boolean

  @ApiProperty()
  baristaAttributes?: boolean
}

export class GetVariantVersionDto {
  @Type(() => ProductVariantDto)
  @ValidateNested()
  @ApiProperty({
    type: ProductVariantDto,
  })
  variant!: ProductVariantDto

  @Type(() => ProductVariantDto)
  @ValidateNested()
  @ApiProperty({
    type: ProductVariantDraftChangesDto,
  })
  draft!: ProductVariantDraftChangesDto

  @ApiProperty()
  variantVersion!: number

  @IsUUID()
  @ApiProperty({
    format: 'uuid',
  })
  id!: string

  @IsEnum(VariantVersionPublishState)
  @ApiProperty({
    enum: VariantVersionPublishState,
  })
  publishState!: VariantVersionPublishState

  @ApiProperty({
    example: 'FP000001-1',
  })
  @IsString()
  key!: string

  @ApiProperty({
    type: VersionCompletedTabs,
  })
  approvedTabs!: VersionCompletedTabs

  @ApiProperty({
    type: VersionCompletedTabs,
  })
  draftTabs!: VersionCompletedTabs
}
