import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsArray,
} from 'class-validator'
import { Type } from 'class-transformer'

import { LiveStatus } from '../model/live-status'
import { IsNullable } from '../../configuration/validation/is-nullable'
import { VariantVersionPreviewDto } from '../../modules/variant-version/dto/variant-version-preview.dto'

import { ImageDto } from './image.dto'
import { ChannelPriceDto } from './channel-price.dto'
import { BaristaAttributesDto } from './barista-attributes.dto'
import { AvailabilityDto } from './availability.dto'
import { HamiltonGrantDto } from './hamilton-grant.dto'
import { MultiLangStringDto } from './multi-lang-string.dto'
import { ProductVariantDescriptionDto } from './variant-description.dto'
import { LabellingDto } from './labelling.dto'

export class ProductVariantDto {
  @ValidateNested()
  @Type(() => BaristaAttributesDto)
  @IsNullable()
  @ApiProperty({
    type: () => BaristaAttributesDto,
    nullable: true,
    oneOf: [
      {
        $ref: getSchemaPath(BaristaAttributesDto),
      },
    ],
  })
  attributes!: BaristaAttributesDto | null

  @Type(() => AvailabilityDto)
  @ValidateNested()
  @ApiProperty({
    type: AvailabilityDto,
  })
  availability!: AvailabilityDto

  @Type(() => HamiltonGrantDto)
  @ValidateNested()
  @ApiProperty({
    type: HamiltonGrantDto,
  })
  hamiltonGrant!: HamiltonGrantDto

  @ApiProperty({
    isArray: true,
  })
  howToDisplay!: string[]

  @ValidateNested()
  @IsNullable()
  @ApiProperty({
    type: () => ImageDto,
    nullable: true,
    oneOf: [
      {
        $ref: getSchemaPath(ImageDto),
      },
    ],
  })
  @Type(() => ImageDto)
  image!: ImageDto | null

  @IsString()
  @IsNullable()
  @ApiProperty({
    nullable: true,
  })
  pluReportingName!: string | null

  @IsString()
  @IsNullable()
  @ApiProperty({ nullable: true })
  pluPrimaryCategoryID!: string | null

  @IsString()
  @IsNullable()
  @ApiProperty({ nullable: true })
  pluSecondaryCategoryID!: string | null

  @IsString()
  @IsNullable()
  @ApiProperty({ nullable: true })
  starKisProductCategoryID!: string | null

  @IsString()
  @IsNullable()
  @ApiProperty({ nullable: true })
  starKisProductSubCategoryID!: string | null

  @IsString()
  @IsNullable()
  @ApiProperty({ nullable: true })
  posID!: string | null

  @IsArray()
  @IsNullable()
  @ApiProperty({ nullable: true })
  productRange!: string[] | null

  @ApiProperty({
    type: ChannelPriceDto,
    isArray: true,
  })
  prices!: ChannelPriceDto[]

  @Type(() => MultiLangStringDto)
  @ValidateNested()
  @ApiProperty({
    type: MultiLangStringDto,
  })
  name!: MultiLangStringDto

  @ValidateNested()
  @Type(() => ProductVariantDescriptionDto)
  @ApiProperty({ type: ProductVariantDescriptionDto })
  description!: ProductVariantDescriptionDto

  @IsString()
  @ApiProperty({
    example: 'UK12345',
  })
  sku!: string

  @IsEnum(LiveStatus)
  @ApiProperty({
    enum: LiveStatus,
  })
  status!: LiveStatus

  @IsBoolean()
  @ApiProperty({
    type: 'boolean',
  })
  isMaster!: boolean

  @IsString()
  @ApiProperty({
    name: 'size',
    example: ['300g'],
    type: 'string',
  })
  size!: string

  @ValidateNested({ each: true })
  @Type(() => VariantVersionPreviewDto)
  versions!: VariantVersionPreviewDto[]

  @IsNullable()
  @Type(() => LabellingDto)
  @ValidateNested()
  @ApiProperty()
  labelling!: LabellingDto | null

  @IsString()
  @IsNullable()
  @ApiProperty({ nullable: true })
  @IsOptional()
  parentProductSku!: string | null

  @IsNumber()
  @IsNullable()
  version!: number | null
}
