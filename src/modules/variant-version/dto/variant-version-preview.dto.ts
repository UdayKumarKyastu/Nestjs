import { ApiProperty } from '@nestjs/swagger'
import { plainToClass, Type } from 'class-transformer'
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
  validateOrReject,
} from 'class-validator'

import { MultiLangStringDto } from '../../../shared/dto/multi-lang-string.dto'
import { VariantVersionPublishState } from '../model/variant-version-publish-state'

export class VariantVersionPreviewDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => MultiLangStringDto)
  name!: MultiLangStringDto

  @ApiProperty()
  @IsString()
  hgCode!: string

  @ApiProperty()
  @IsString()
  sku!: string

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  @IsString()
  liveFrom!: string

  @IsNumber()
  @ApiProperty()
  version!: number

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

  static validate(dtoValue: VariantVersionPreviewDto) {
    return validateOrReject(plainToClass(VariantVersionPreviewDto, dtoValue))
  }
}
