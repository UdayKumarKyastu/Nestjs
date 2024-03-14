import { DateAttribute } from '../base-attributes/date-attribute'

export class NewUntilAttribute extends DateAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'newUntil'

  private _tag = 'NewUntilAttribute'
}
