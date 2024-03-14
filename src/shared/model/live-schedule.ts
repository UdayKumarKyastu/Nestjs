import { ProductVariant } from '@commercetools/platform-sdk'
import { IsDateString } from 'class-validator'

import { LiveScheduleDTO } from '../dto/availability.dto'
import { CommonProductVariantAttributes } from '../../modules/product-attributes/common-product-variant-attributes'
import { IsNullable } from '../../configuration/validation/is-nullable'

export interface LiveSchedulePayload {
  on: string | null
  off: string | null
}

export class LiveSchedule implements LiveSchedulePayload {
  @IsNullable()
  @IsDateString()
  on: string | null

  @IsNullable()
  @IsDateString()
  off: string | null

  constructor(data: LiveSchedulePayload) {
    this.on = data.on
    this.off = data.off
  }

  toDto() {
    const dto = new LiveScheduleDTO()

    dto.off = this.off
    dto.on = this.on

    return dto
  }

  static fromCtVariant(
    variant: Pick<ProductVariant, 'attributes'>,
    liveFromFallback: Date | string,
  ) {
    const commonAttrs = new CommonProductVariantAttributes(variant.attributes!)

    return new LiveSchedule({
      on: commonAttrs.liveFrom?.value.toISOString() || new Date(liveFromFallback).toISOString(),
      off: commonAttrs.liveTo?.value.toISOString() || null,
    })
  }
}
