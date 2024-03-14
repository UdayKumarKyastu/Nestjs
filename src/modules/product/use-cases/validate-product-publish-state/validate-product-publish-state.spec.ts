import { ProductPublishStateValidator } from './validate-product-publish-state'

describe('ProductPublishStateValidator', () => {
  it('should throw forbidden exception if product is unpublished', () => {
    expect(() => {
      ProductPublishStateValidator.validateProductPublishState(false)
    }).toThrow()
  })
})
