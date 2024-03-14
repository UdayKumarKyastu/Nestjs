import { VariantLiveDates } from '../product/logic/models/variant-live-dates'

import { VersionEditabilityChecker } from './version-editability-checker'

describe('VersionEditabilityChecker', function () {
  it('Marks not editable for versions CURRENT and PAST', () => {
    const c = new VersionEditabilityChecker(
      new VariantLiveDates({
        from: new Date(2020, 2, 1),
        to: null,
      }),
    )

    expect(
      c.isEditable(
        new VariantLiveDates({
          from: new Date(2019, 1, 1),
          to: null,
        }),
      ),
    ).toBe(false)

    expect(
      c.isEditable(
        new VariantLiveDates({
          from: new Date(2020, 2, 1),
          to: null,
        }),
      ),
    ).toBe(false)
  })

  it('Marks not ediable if  variant version doesnt have live date', () => {
    const c = new VersionEditabilityChecker(
      new VariantLiveDates({
        from: new Date(2019, 1, 1),
        to: null,
      }),
    )

    expect(
      c.isEditable(
        new VariantLiveDates({
          from: null,
          to: null,
        }),
      ),
    ).toBe(false)
  })

  it('Marks as editable if version if FUTURE compared to live variant', () => {
    const c = new VersionEditabilityChecker(
      new VariantLiveDates({
        from: new Date(2019, 1, 1),
        to: null,
      }),
    )

    expect(
      c.isEditable(
        new VariantLiveDates({
          from: new Date(2021, 1, 1),
          to: null,
        }),
      ),
    ).toBe(true)
  })
})
