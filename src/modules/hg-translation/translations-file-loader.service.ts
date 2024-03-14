import { join } from 'path'

import { Inject, Injectable } from '@nestjs/common'

import { CsvParserService, ICanParseCsv } from '../csv/csv-parser.service'
import { MultilangString } from '../product/logic/models/multilang-string'

export interface HgKeyTranslation {
  key: string
  translation: MultilangString
}

export interface HgTranslationDictionary {
  [allergenKey: string]: HgKeyTranslation
}

export interface ICanLoadTranslations {
  loadTranslations(): Promise<void>
}

export interface IHasTranslations {
  getTranslations(): HgTranslationDictionary
}

@Injectable()
export class TranslationsFileLoaderService implements ICanLoadTranslations, IHasTranslations {
  private readonly _csvParser: ICanParseCsv
  private translations: HgTranslationDictionary | null = null
  private readonly translationFile: string

  constructor(translationFile: string, @Inject(CsvParserService) _csvParser: ICanParseCsv) {
    this.translationFile = translationFile
    this._csvParser = _csvParser
  }

  async loadTranslations(): Promise<void> {
    const rawTranslations = await this._csvParser.parseFile(this.translationFile)

    this.translations = rawTranslations.reduce((acc, translationRow) => {
      const key = translationRow['sourceStrFoodApi']

      acc[key] = {
        key: key,
        translation: new MultilangString({
          'en-GB': translationRow['en-GB'],
          'zh-HK': translationRow['zh-HK'],
          'en-US': translationRow['en-US'],
          'en-HK': translationRow['en-HK'],
          'fr-FR': translationRow['fr-FR'],
        }),
      }

      return acc
    }, {} as HgTranslationDictionary)
  }

  getTranslations(): HgTranslationDictionary {
    if (!this.translations) {
      throw new Error(
        `Can find translations. Check if ${this.translationFile} was loaded in module`,
      )
    }

    return this.translations
  }
}

export class AllergenTranslationsFileLoaderService extends TranslationsFileLoaderService {
  constructor(@Inject(CsvParserService) _csvParser: ICanParseCsv) {
    super(join(__dirname, '..', '..', 'assets', 'translations-allergens.csv'), _csvParser)
  }
}

export class NutritionalsTranslationsFileLoaderService extends TranslationsFileLoaderService {
  constructor(@Inject(CsvParserService) _csvParser: ICanParseCsv) {
    super(join(__dirname, '..', '..', 'assets', 'translations-nutritionals.csv'), _csvParser)
  }
}
