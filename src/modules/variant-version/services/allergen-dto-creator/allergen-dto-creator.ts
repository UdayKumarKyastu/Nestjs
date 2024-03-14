import { Inject, Injectable } from '@nestjs/common'

import { AllergenDto } from '../../../../shared/dto/hamilton-grant.dto'
import {
  HgAllergensTranslationService,
  ICanTranslate,
} from '../../../hg-translation/hg-translations.service'

export interface ICanCreateAllergensDto {
  getDtoFromKeys(codes: string[]): Promise<AllergenDto[]>
}

@Injectable()
export class AllergenDtoCreator implements ICanCreateAllergensDto {
  constructor(
    @Inject(HgAllergensTranslationService)
    private readonly _allergensTranslation: ICanTranslate,
  ) {}

  async getDtoFromKeys(codes: string[]): Promise<AllergenDto[]> {
    return this._allergensTranslation.translateMany(codes).map((translation, index) => ({
      label: translation.toDto(),
      name: codes[index],
    }))
  }
}
