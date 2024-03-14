import { LocalizedString } from '@commercetools/platform-sdk'

import { MultilangString } from '../../product/logic/models/multilang-string'

import { AbstractAttribute } from './abstract-attribute'

export class LocalisedStringAttribute extends AbstractAttribute<LocalizedString> {
  value: LocalizedString

  constructor(value: LocalizedString) {
    super()

    this.value = value
  }

  toString(): string {
    return JSON.stringify(this.value)
  }

  toJSON() {
    return {
      value: this.value,
    }
  }

  toMultiLangString() {
    return new MultilangString(this.value)
  }
}
