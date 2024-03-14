import { ICanTranslate } from '../../../hg-translation/hg-translations.service'
import {
  MultilangString,
  MultiLangStringMockFactory,
} from '../../../product/logic/models/multilang-string'

import { NutritionalsDtoCreator } from './nutritionals-dto-creator'

describe('NutritionalsDtoCreator', function () {
  it('Creates nutritionals DTO from base items', async () => {
    const translator: ICanTranslate = {
      translateKey(key: string): MultilangString {
        return MultiLangStringMockFactory.createMultiLangString(key)
      },
      translateMany(keys: string[]): MultilangString[] {
        return keys.map((k) => MultiLangStringMockFactory.createMultiLangString(k))
      },
    }

    const service = new NutritionalsDtoCreator(translator)

    const result = await service.getDtoFromBaseNutritionals([
      {
        item: 'UKFAT',
        perServing: 10,
        per100g: 50,
      },
    ])

    expect(result).toEqual([
      {
        localisedLabel: {
          'en-GB': 'UKFAT-en-GB',
          'en-HK': 'UKFAT-en-HK',
          'en-US': 'UKFAT-en-US',
          'fr-FR': 'UKFAT-fr-FR',
          'zh-HK': 'UKFAT-zh-HK',
        },
        name: 'UKFAT',
        per100g: 50,
        perServing: 10,
      },
    ])
  })
})
