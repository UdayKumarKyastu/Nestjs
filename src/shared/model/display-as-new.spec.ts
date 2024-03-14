import { DisplayedAsNew } from './display-as-new'

describe('DisplayAsNew', function () {
  it('Stringifies to JSON with DATE-only string (no time)', () => {
    const model = new DisplayedAsNew(new Date(2021, 9, 28, 0, 0, 0).toISOString())

    expect(model.toJSON()).toMatchInlineSnapshot(`
      Object {
        "isDisplayed": true,
        "until": "2021-10-28",
      }
    `)
    expect(JSON.stringify(model)).toMatchInlineSnapshot(
      `"{\\"isDisplayed\\":true,\\"until\\":\\"2021-10-28\\"}"`,
    )
  })
})
