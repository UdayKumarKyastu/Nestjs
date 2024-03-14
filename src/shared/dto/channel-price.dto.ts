import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  IsOptional,
  Min,
  ValidateNested,
  validateOrReject,
} from 'class-validator'
import { plainToClass, Type } from 'class-transformer'

import { MultiLangStringDto } from '../../shared/dto/multi-lang-string.dto'

import { MoneyDto } from './money.dto'

export class UpdateChannelPriceDto {
  @IsString()
  @ApiProperty()
  channelName!: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MoneyDto)
  @ApiProperty()
  takeAwayPrice!: MoneyDto

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MoneyDto)
  @ApiProperty()
  takeAwayClubPret!: MoneyDto

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MoneyDto)
  @ApiProperty()
  eatInPrice!: MoneyDto

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MoneyDto)
  @ApiProperty()
  eatInClubPret!: MoneyDto

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MoneyDto)
  @ApiProperty()
  deliveryPrice!: MoneyDto

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  @ApiProperty()
  eatInTax!: number

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  @ApiProperty()
  @IsOptional()
  takeAwayTax?: number

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  @ApiProperty()
  deliveryTax?: number

  static validate(priceDto: UpdateChannelPriceDto) {
    return validateOrReject(plainToClass(UpdateChannelPriceDto, priceDto))
  }
}

export class ChannelPriceDto extends UpdateChannelPriceDto {
  @ValidateNested()
  @Type(() => MultiLangStringDto)
  @ApiProperty()
  channelLabel!: MultiLangStringDto

  static validate(priceDto: ChannelPriceDto) {
    return validateOrReject(plainToClass(ChannelPriceDto, priceDto))
  }
}
