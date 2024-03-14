import { STATUS_TYPES } from './status-types'
import { User } from './user'
export class FieldStatus {
  status: STATUS_TYPES
  user: User
  modifiedAt: string

  constructor(params: { status: STATUS_TYPES; user?: User; modifiedAt?: string }) {
    const { status, user, modifiedAt } = params

    this.status = status
    this.user = user || { name: null, id: null }
    this.modifiedAt = modifiedAt || ''
  }
}
