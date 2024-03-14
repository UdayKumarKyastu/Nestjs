import { Inject, Injectable } from '@nestjs/common'

import { MultilangString } from '../product/logic/models/multilang-string'

import {
  AllergenTranslationsFileLoaderService,
  IHasTranslations,
  NutritionalsTranslationsFileLoaderService,
} from './translations-file-loader.service'

export interface ICanTranslate {
  translateKey(key: string): MultilangString
  translateMany(keys: string[]): MultilangString[]
}

@Injectable()
export class HgTranslationsService implements ICanTranslate {
  private readonly _translations: IHasTranslations

  constructor(_translations: IHasTranslations) {
    this._translations = _translations
  }

  translateKey(key: string): MultilangString {
    return (
      this._translations.getTranslations()[key]?.translation ||
      new MultilangString({
        'en-GB': key,
      })
    )
  }

  translateMany(keys: string[]): MultilangString[] {
    return keys.map((k) => {
      return this.translateKey(k)
    })
  }
}

@Injectable()
export class HgAllergensTranslationService extends HgTranslationsService {
  constructor(@Inject(AllergenTranslationsFileLoaderService) _translations: IHasTranslations) {
    super(_translations)
  }
}

@Injectable()
export class HgNutritionalsTranslationService extends HgTranslationsService {
  constructor(@Inject(NutritionalsTranslationsFileLoaderService) _translations: IHasTranslations) {
    super(_translations)
  }
}
