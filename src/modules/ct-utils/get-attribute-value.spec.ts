import { AbstractAttribute } from '../product-attributes/base-attributes/abstract-attribute'

import { CtAttributesResolver } from './get-attribute-value'

describe('CtAttributesResolver', function () {
  let getter = CtAttributesResolver.constructAttributeValueGetter([])

  beforeEach(() => {
    getter = CtAttributesResolver.constructAttributeValueGetter([
      {
        value: false,
        name: 'Attr1',
      },
      {
        value: 'Foo',
        name: 'Attr2',
      },
    ])
  })

  it('Can get attribute computed object with COMMERCE_TOOLS_ATTR_NAME', () => {
    expect(
      getter({
        COMMERCE_TOOLS_ATTR_NAME: 'Attr1',
      }),
    ).toBe(false)

    expect(
      getter({
        COMMERCE_TOOLS_ATTR_NAME: 'Attr2',
      }),
    ).toBe('Foo')
  })

  it('Can get attribute computed object with some attribute', () => {
    class Attr extends AbstractAttribute {
      value = 'foo'

      static readonly COMMERCE_TOOLS_ATTR_NAME = 'Attr2'
    }

    expect(getter(Attr)).toBe('Foo')

    expect(
      getter({
        COMMERCE_TOOLS_ATTR_NAME: 'Attr2',
      }),
    ).toBe('Foo')
  })

  it('Can get attr by string', () => {
    expect(getter('Attr1')).toBe(false)

    expect(getter('Attr2')).toBe('Foo')
  })
})
