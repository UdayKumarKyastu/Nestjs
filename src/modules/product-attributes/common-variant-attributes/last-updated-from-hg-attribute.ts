import { DateAttribute } from '../base-attributes/date-attribute'

export class LastUpdatedFromHgAttribute extends DateAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'lastUpdatedFromHG'

  private _tag = 'LastUpdatedFromHgAttribute'
}
