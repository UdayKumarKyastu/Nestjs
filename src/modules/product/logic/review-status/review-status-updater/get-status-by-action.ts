import { STATUS_TYPES } from '../models/status-types'
import { Action } from '../models/update-action'

export const getFieldStatusByAction = (action: Action) => {
  if (action === 'approve') {
    return STATUS_TYPES.accepted
  }

  if (action === 'reject') {
    return STATUS_TYPES.rejected
  }

  if (action === 'reset') {
    return STATUS_TYPES.pending
  }
}
