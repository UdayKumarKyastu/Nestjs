import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { LabellingOptionsDto } from '../../shared/dto/labellingOptions.dto'

import { ICanFindLabellingOptions, LabellingOptionsService } from './labelling-options.service'

@Injectable()
export class LabellingOptionsValidator {
  constructor(
    @Inject(LabellingOptionsService)
    private readonly _labellingOptionsService: ICanFindLabellingOptions,
  ) {}

  async validateLabellingOptionKey(field: keyof LabellingOptionsDto, key: string): Promise<void> {
    switch (field) {
      case 'instructionsForUse':
        return this._labellingOptionsService.findStorageConditions().then((options) => {
          if (!options.find((opt) => opt.key === key)) {
            throw new BadRequestException(
              `instructionsForUse must be one of: ${options.map((o) => o.key).join(' | ')}`,
            )
          }
        })

      case 'useBy':
        return this._labellingOptionsService.findUseBy().then((options) => {
          if (!options.find((opt) => opt.key === key)) {
            throw new BadRequestException(
              `useBy must be one of: ${options.map((o) => o.key).join(' | ')}`,
            )
          }
        })
      case 'sellBy':
        return this._labellingOptionsService.findSellBy().then((options) => {
          if (!options.find((opt) => opt.key === key)) {
            throw new BadRequestException(
              `sellBy must be one of: ${options.map((o) => o.key).join(' | ')}`,
            )
          }
        })
      case 'productServes':
        return this._labellingOptionsService.findProductServes().then((options) => {
          if (!options.find(({ key: optionKey }) => optionKey === key)) {
            throw new BadRequestException(
              `productServes must be one of: ${options.map(({ key }) => key).join(' | ')}`,
            )
          }
        })
    }
  }
}
