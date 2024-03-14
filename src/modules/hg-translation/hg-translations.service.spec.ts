import { MultiLangStringMockFactory } from '../product/logic/models/multilang-string'

import { HgTranslationsService } from './hg-translations.service'
import { HgTranslationDictionary, IHasTranslations } from './translations-file-loader.service'

describe('AllergensTranslationsService', function () {
  let translationProvider: IHasTranslations
  let service: HgTranslationsService

  beforeEach(() => {
    translationProvider = {
      getTranslations(): HgTranslationDictionary {
        return {
          OATS: {
            key: 'OATS',
            translation: MultiLangStringMockFactory.createMultiLangString('Oats'),
          },
          PEANUTS: {
            key: 'PEANUTS',
            translation: MultiLangStringMockFactory.createMultiLangString('Peanuts'),
          },
        }
      },
    }

    service = new HgTranslationsService(translationProvider)
  })

  it('Translates single key', () => {
    expect(service.translateKey('OATS')?.['en-GB']).toBe('Oats-en-GB')
    expect(service.translateKey('PEANUTS')?.['en-GB']).toBe('Peanuts-en-GB')
  })

  it('Returns fallback with key as en-GB -  if no translation founds', () => {
    expect(service.translateKey('NOT_FOUND')?.['en-GB']).toBe('NOT_FOUND')
  })

  it('Can translate many keys in batch', () => {
    expect(
      service
        .translateMany(['OATS', 'PEANUTS', 'NOT FOUND'])
        .map((translation) => translation['en-GB']),
    ).toEqual(['Oats-en-GB', 'Peanuts-en-GB', 'NOT FOUND'])
  })
})
