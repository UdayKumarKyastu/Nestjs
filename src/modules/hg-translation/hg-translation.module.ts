import { Global, Module } from '@nestjs/common'

import { CsvModule } from '../csv/csv.module'
import { CsvParserService } from '../csv/csv-parser.service'

import {
  AllergenTranslationsFileLoaderService,
  NutritionalsTranslationsFileLoaderService,
} from './translations-file-loader.service'
import {
  HgAllergensTranslationService,
  HgNutritionalsTranslationService,
} from './hg-translations.service'

@Global()
@Module({
  imports: [CsvModule],
  providers: [
    {
      provide: AllergenTranslationsFileLoaderService,
      async useFactory(csvParser: CsvParserService) {
        const instance = new AllergenTranslationsFileLoaderService(csvParser)

        await instance.loadTranslations()

        return instance
      },
      inject: [CsvParserService],
    },
    {
      provide: NutritionalsTranslationsFileLoaderService,
      async useFactory(csvParser: CsvParserService) {
        const instance = new NutritionalsTranslationsFileLoaderService(csvParser)

        await instance.loadTranslations()

        return instance
      },
      inject: [CsvParserService],
    },
    HgAllergensTranslationService,
    HgNutritionalsTranslationService,
  ],
  exports: [HgAllergensTranslationService, HgNutritionalsTranslationService],
})
export class HgTranslationModule {}
