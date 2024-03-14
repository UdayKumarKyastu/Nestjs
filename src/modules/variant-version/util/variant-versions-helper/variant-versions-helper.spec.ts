import { BadRequestException } from '@nestjs/common'

import { VersionReferenceAttribute } from '../../version-reference-attribute'

import { VariantVersionsHelper } from './variant-versions-helper'

describe('VariantVersionsHelper', () => {
  it('Returns true if has reference to version with given ID and false if not', () => {
    const instance = new VariantVersionsHelper({
      attributes: [
        {
          name: VersionReferenceAttribute,
          value: [
            {
              typeId: 'key-value-document',
              id: 'ID-1',
            },
            {
              typeId: 'key-value-document',
              id: 'ID-2',
            },
          ],
        },
      ],
    })

    expect(instance.hasVersionWithId('ID-1')).toBe(true)
    expect(instance.hasVersionWithId('ID-2')).toBe(true)
    expect(instance.hasVersionWithId('ID-3')).toBe(false)
  })

  it('Optionally throw error if doesnt have expected ID', () => {
    const instance = new VariantVersionsHelper({
      attributes: [
        {
          name: VersionReferenceAttribute,
          value: [
            {
              typeId: 'key-value-document',
              id: 'ID-1',
            },
            {
              typeId: 'key-value-document',
              id: 'ID-2',
            },
          ],
        },
      ],
    })

    expect(instance.hasVersionWithId('ID-1', new BadRequestException())).toBe(true)
    expect(instance.hasVersionWithId('ID-2', new BadRequestException())).toBe(true)
    expect(() => instance.hasVersionWithId('ID-3', new BadRequestException('error'))).toThrow(
      'error',
    )
  })
})
