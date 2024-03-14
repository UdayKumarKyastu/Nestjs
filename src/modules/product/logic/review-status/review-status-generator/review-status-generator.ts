import { isEqual } from 'lodash'

import { STATUS_TYPES } from '../models/status-types'
import { FieldStatus } from '../models/field-status'
import { User } from '../models/user'

export class ReviewStatusGenerator {
  generateFieldStatusObject(status = STATUS_TYPES.pending, user?: User | null): FieldStatus {
    return {
      modifiedAt: new Date().toISOString(),
      status,
      user: {
        id: user?.id || null,
        name: user?.name || null,
      },
    }
  }

  getObjectDiff<T>(originalObject: T, modifiedObject: T) {
    if (!originalObject) {
      return {}
    }

    return Object.keys(originalObject).reduce((acc, attribute) => {
      const mappedAttribute = attribute as keyof typeof originalObject
      if (!isEqual(originalObject?.[mappedAttribute], modifiedObject?.[mappedAttribute])) {
        return {
          ...acc,
          [mappedAttribute]: this.generateFieldStatusObject(),
        }
      }

      return acc
    }, {})
  }
}
