import { LocalizedString } from '@commercetools/platform-sdk'

import { MultiLangStringDto } from '../../../../shared/dto/multi-lang-string.dto'

export type LanguageCode = 'en-GB' | 'en-US' | 'fr-FR' | 'en-HK' | 'zh-HK'

type MultiLangStringValuesRecord = Record<LanguageCode, string>

// Todo - unify with DTO
export class MultilangString implements MultiLangStringValuesRecord {
  'en-GB': string
  'en-HK': string
  'en-US': string
  'zh-HK': string
  'fr-FR': string

  constructor(
    ctLocalizedString:
      | (Partial<MultiLangStringValuesRecord> & LocalizedString)
      | MultiLangStringValuesRecord,
  ) {
    this['en-GB'] = ctLocalizedString['en-GB'] ?? ''
    this['en-US'] = ctLocalizedString['en-US'] ?? ''
    this['fr-FR'] = ctLocalizedString['fr-FR'] ?? ''
    this['en-HK'] = ctLocalizedString['en-HK'] ?? ''
    this['zh-HK'] = ctLocalizedString['zh-HK'] ?? ''
  }

  toDto(): MultiLangStringDto {
    return {
      'en-GB': this['en-GB'],
      'en-US': this['en-US'],
      'fr-FR': this['fr-FR'],
      'en-HK': this['en-HK'],
      'zh-HK': this['zh-HK'],
    }
  }

  toPersistence(): LocalizedString {
    return {
      'en-GB': this['en-GB'],
      'en-HK': this['en-HK'],
      'en-US': this['en-US'],
      'zh-HK': this['zh-HK'],
      'fr-FR': this['fr-FR'],
    }
  }

  static fromDto(dto: MultiLangStringDto) {
    return new MultilangString({
      'en-GB': dto['en-GB'] || '',
      'en-US': dto['en-US'] || '',
      'fr-FR': dto['fr-FR'] || '',
      'en-HK': dto['en-HK'] || '',
      'zh-HK': dto['zh-HK'] || '',
    })
  }
}

export abstract class MultiLangStringMockFactory {
  static createDto(value: string): MultiLangStringDto {
    return {
      'fr-FR': `${value}-fr-FR`,
      'en-GB': `${value}-en-GB`,
      'en-HK': `${value}-en-HK`,
      'en-US': `${value}-en-US`,
      'zh-HK': `${value}-zh-HK`,
    }
  }

  static createMultiLangString(value: string): MultilangString {
    return new MultilangString({
      'fr-FR': `${value}-fr-FR`,
      'en-GB': `${value}-en-GB`,
      'en-HK': `${value}-en-HK`,
      'en-US': `${value}-en-US`,
      'zh-HK': `${value}-zh-HK`,
    })
  }
}
