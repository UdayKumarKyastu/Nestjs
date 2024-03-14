import { StringAttribute } from '../base-attributes/string-attribute'

export class HgRecipeStatusAttribute extends StringAttribute {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'hgRecipeStatus'

  private _tag = 'HgRecipeStatusAttribute'
}
