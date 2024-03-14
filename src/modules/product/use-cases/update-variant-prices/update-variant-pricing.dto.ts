import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { UpdateChannelPriceDto } from '../../../../shared/dto/channel-price.dto'

export class UpdateVariantPricingDto {
  @IsNotEmpty()
  @ValidateNested({
    each: true,
  })
  @Type(() => UpdateChannelPriceDto)
  @ApiProperty({ type: UpdateChannelPriceDto, isArray: true })
  prices!: UpdateChannelPriceDto[]
}
