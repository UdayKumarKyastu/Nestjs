import { DateAttribute } from '../base-attributes/date-attribute'

export class LiveFromAttribute extends DateAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'liveFrom'

  private _tag = 'LiveFromAttribute'
}
