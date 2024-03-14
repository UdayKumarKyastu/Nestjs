import { addDays } from 'date-fns'

import { VariantVersionPublishState } from '../../model/variant-version-publish-state'

import { VariantVersionsPublishStateService } from './variant-versions-publish-state.service'

describe('VariantVersionsPublishStateService', function () {
  it('Resolves version to be PREVIOUS if version live date is older than live variants live date', () => {
    const service = new VariantVersionsPublishStateService('2021-01-01')

    expect(
      service.getVariantPublishState({
        liveFrom: '2019-01-01',
      }),
    ).toBe(VariantVersionPublishState.Previous)
  })

  it('Resolve version to be FUTURE if live date is later than live variants live date', () => {
    const service = new VariantVersionsPublishStateService('2020-01-01')

    expect(
      service.getVariantPublishState({
        liveFrom: '2019-01-01',
      }),
    ).toBe(VariantVersionPublishState.Previous)
  })

  it('Resolve version to be CURRENT if variant version date is the same day as versions', () => {
    const service = new VariantVersionsPublishStateService('2020-01-01T10:00:00')

    expect(
      service.getVariantPublishState({
        liveFrom: '2020-01-01T12:00:00',
      }),
    ).toBe(VariantVersionPublishState.Current)
  })

  it('Resolve version to be FUTURE if live variant has to live date yet', () => {
    const service = new VariantVersionsPublishStateService(null)

    expect(
      service.getVariantPublishState({
        liveFrom: '2020-01-01T12:00:00',
      }),
    ).toBe(VariantVersionPublishState.Future)
  })

  it('Throws constructor if invalid date provided', () => {
    expect(() => new VariantVersionsPublishStateService('foobar')).toThrow()
  })

  it('Throws if version date provided is invalid date', () => {
    expect(() =>
      new VariantVersionsPublishStateService('2020-01-01T12:00:00').getVariantPublishState({
        liveFrom: 'foobar',
      }),
    ).toThrow()
  })

  it('Shows FUTURE if both live and version are the same date, but the date is after today', () => {
    const tomorrow = addDays(new Date(), 1)

    const service = new VariantVersionsPublishStateService(tomorrow.toISOString())

    expect(
      service.getVariantPublishState({
        liveFrom: tomorrow.toISOString(),
      }),
    ).toBe(VariantVersionPublishState.Future)
  })
})
