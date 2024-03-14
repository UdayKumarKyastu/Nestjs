import { Equals, IsBoolean, IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Logger } from '@nestjs/common'
import { formatISO } from 'date-fns'
import { isEqual } from 'lodash'

import { IsNullable } from '../../configuration/validation/is-nullable'
import { DisplayAsNewAttribute } from '../../modules/product-attributes/common-variant-attributes/display-as-new-attribute'
import { NewUntilAttribute } from '../../modules/product-attributes/common-variant-attributes/new-until-attribute'

export class DisplayedAsNew {
  private _tag = 'DisplayedAsNew'

  @IsBoolean()
  @ApiProperty()
  @Equals(true)
  isDisplayed: true

  @IsDateString()
  until: string

  constructor(until: string) {
    this.isDisplayed = true
    this.until = until
  }

  toJSON() {
    const date = new Date(this.until)

    return {
      isDisplayed: this.isDisplayed,
      until: formatISO(date, {
        representation: 'date',
      }),
    }
  }
}

export class DisplayAsNotNew {
  private _tag = 'DisplayAsNotNew'

  @IsBoolean()
  @Equals(false)
  @ApiProperty()
  isDisplayed: false

  @IsNullable()
  @Equals(null)
  until: null

  constructor() {
    this.isDisplayed = false
    this.until = null
  }

  toJSON() {
    return {
      isDisplayed: this.isDisplayed,
      until: this.until,
    }
  }
}

export abstract class DisplayAsNewFactory {
  private static logger = new Logger(DisplayAsNewFactory.name)

  static create(
    displayAsNewAttr: DisplayAsNewAttribute,
    newUntilAttr: NewUntilAttribute | null,
  ): DisplayedAsNew | DisplayAsNotNew {
    if (displayAsNewAttr.value && newUntilAttr?.value) {
      return new DisplayedAsNew(newUntilAttr.value.toISOString())
    } else if (!displayAsNewAttr.value && !newUntilAttr?.value) {
      return new DisplayAsNotNew()
    } else {
      this.logger.warn(
        `Trying to construct DisplayAsNew, but fields are not consistent. Received: DisplayAsNew attr: ${displayAsNewAttr.value} and NewUntil attr: ${newUntilAttr?.value}`,
      )

      return new DisplayAsNotNew()
    }
  }
}

export class DisplayAsNewComparator {
  constructor(private first: DisplayedAsNew | DisplayAsNotNew) {}

  compareTo(second: DisplayedAsNew | DisplayAsNotNew): 2 | 1 | 0 {
    if (this.first.isDisplayed !== second.isDisplayed && this.first.until !== second.until) {
      return 2
    }

    if (this.first.isDisplayed !== second.isDisplayed || this.first.until !== second.until) {
      return 1
    }

    if (isEqual(this.first, second)) {
      return 0
    }

    console.warn('Fallthrough condition, should not happen')

    return 0
  }
}
