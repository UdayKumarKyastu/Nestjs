import { FieldStatus } from './field-status'

export interface ProductReviewStatus {
  setUp: {
    [key: string]: FieldStatus
  }
  categories: Array<FieldStatus & { value: string[] }>
}
