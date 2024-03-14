import { EnumOption } from '../product/logic/models/enum-option'
import { LabellingOptionsDto } from '../../shared/dto/labellingOptions.dto'

import { LabellingOptionsValidator } from './labelling-options-validator'
import { ICanFindLabellingOptions } from './labelling-options.service'

describe('LabellingOptionsValidator', function () {
  let service: LabellingOptionsValidator
  let optionsFetcherService: ICanFindLabellingOptions

  beforeEach(() => {
    optionsFetcherService = {
      async findSellBy(): Promise<EnumOption[]> {
        return [
          {
            key: 'SELL_BY_KEY_1',
            label: 'Sell by key 1',
          },
          {
            key: 'SELL_BY_KEY_2',
            label: 'Sell by key 2',
          },
        ]
      },
      async findStorageConditions(): Promise<EnumOption[]> {
        return [
          {
            key: 'STORAGE_COND_KEY_1',
            label: 'Storage condition key 1',
          },
          {
            key: 'STORAGE_COND_KEY_2',
            label: 'Storage condition key 2',
          },
        ]
      },
      async findUseBy(): Promise<EnumOption[]> {
        return [
          {
            key: 'USE_BY_KEY_1',
            label: 'Use by key 1',
          },
          {
            key: 'USE_BY_KEY_2',
            label: 'Use by key 2',
          },
        ]
      },
      async findProductServes(): Promise<EnumOption[]> {
        return [
          {
            key: '1',
            label: '1',
          },
          {
            key: '2',
            label: '2',
          },
        ]
      },
      async findAll(): Promise<LabellingOptionsDto> {
        return {
          useBy: await this.findUseBy(),
          sellBy: await this.findSellBy(),
          instructionsForUse: await this.findStorageConditions(),
          productServes: await this.findProductServes(),
        }
      },
    }
    service = new LabellingOptionsValidator(optionsFetcherService)
  })

  it('Validates labelling instructionsForUse key, to check if it matches commercetools set', async () => {
    await service
      .validateLabellingOptionKey('instructionsForUse', 'STORAGE_COND_KEY_1')
      .then(() => expect(expect.anything()))

    return expect(() =>
      service.validateLabellingOptionKey('instructionsForUse', 'INVALID'),
    ).rejects.toThrow()
  })

  it('Validates labelling sellBy key, to check if it matches commercetools set', async () => {
    await service
      .validateLabellingOptionKey('sellBy', 'SELL_BY_KEY_1')
      .then(() => expect(expect.anything()))

    return expect(() => service.validateLabellingOptionKey('sellBy', 'INVALID')).rejects.toThrow()
  })

  it('Validates labelling useBy key, to check if it matches commercetools set', async () => {
    await service
      .validateLabellingOptionKey('useBy', 'USE_BY_KEY_1')
      .then(() => expect(expect.anything()))

    return expect(() => service.validateLabellingOptionKey('useBy', 'INVALID')).rejects.toThrow()
  })
})
