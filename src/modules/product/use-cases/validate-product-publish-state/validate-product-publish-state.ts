import { ForbiddenException } from '@nestjs/common'

export class ProductPublishStateValidator {
  static validateProductPublishState(published: boolean) {
    if (!published) {
      throw new ForbiddenException('Only published products can be edited')
    }
  }
}
