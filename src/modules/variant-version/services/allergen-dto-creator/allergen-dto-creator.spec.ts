import { ICanTranslate } from '../../../hg-translation/hg-translations.service'
import {
  MultilangString,
  MultiLangStringMockFactory,
} from '../../../product/logic/models/multilang-string'

import { AllergenDtoCreator } from './allergen-dto-creator'

describe('AllergenDtoCreator', function () {
  it('Creates allergens DTO from codes', async () => {
    const translator: ICanTranslate = {
      translateKey(key: string): MultilangString {
        return MultiLangStringMockFactory.createMultiLangString(key)
      },
      translateMany(keys: string[]): MultilangString[] {
        return keys.map((k) => MultiLangStringMockFactory.createMultiLangString(k))
      },
    }

    const service = new AllergenDtoCreator(translator)

    const result = await service.getDtoFromKeys(['UKALGOATS', 'UKALGWHEAT'])

    expect(result).toEqual([
      {
        label: {
          'en-GB': 'UKALGOATS-en-GB',
          'en-HK': 'UKALGOATS-en-HK',
          'en-US': 'UKALGOATS-en-US',
          'fr-FR': 'UKALGOATS-fr-FR',
          'zh-HK': 'UKALGOATS-zh-HK',
        },
        name: 'UKALGOATS',
      },
      {
        label: {
          'en-GB': 'UKALGWHEAT-en-GB',
          'en-HK': 'UKALGWHEAT-en-HK',
          'en-US': 'UKALGWHEAT-en-US',
          'fr-FR': 'UKALGWHEAT-fr-FR',
          'zh-HK': 'UKALGWHEAT-zh-HK',
        },
        name: 'UKALGWHEAT',
      },
    ])
  })
})
