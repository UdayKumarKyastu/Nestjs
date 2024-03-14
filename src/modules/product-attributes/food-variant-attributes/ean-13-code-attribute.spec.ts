import { Ean13CodeAttribute } from './ean-13-code-attribute'

describe('Ean13CodeAttribute', function () {
  it('Builds if code is proper value', () => {
    ;['1595846235499', '2222568042157', '8517622011410'].forEach((ean) => {
      const instance = new Ean13CodeAttribute(ean)

      expect(instance).toBeDefined()
    })
  })

  it('Throws if ean is invalid value', () => {
    ;[null, '', '1231231231230'].forEach((value) => {
      expect(() => new Ean13CodeAttribute(value!)).toThrow()
    })
  })

  it('Gets value', () => {
    const ean = '1595846235499'

    const instance = new Ean13CodeAttribute(ean)

    expect(instance.value).toBe(ean)
  })

  it('Serializes to have value', () => {
    const ean = '1595846235499'

    const instance = new Ean13CodeAttribute(ean)

    const serialized = JSON.stringify(instance)

    expect(serialized).toMatchInlineSnapshot(`"{\\"value\\":\\"1595846235499\\"}"`)
  })

  it('Can statically validate ean code', () => {
    expect(Ean13CodeAttribute.isValidEan('foo')).toBe(false)

    expect(Ean13CodeAttribute.isValidEan('1595846235499')).toBe(true)
  })
})
