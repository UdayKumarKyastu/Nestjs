import { AbstractAttribute } from '../base-attributes/abstract-attribute'

export type CtConsituentItem = [
  { name: 'constituentItemCode'; value: string },
  { name: 'constituentItemQuantity'; value: string },
  { name: 'constituentItemVersion'; value: number },
]

export class ConstituentItems extends AbstractAttribute<CtConsituentItem[]> {
  static readonly COMMERCE_TOOLS_ATTR_NAME = 'constituentItems'

  private _tag = 'ConstituentItems'

  value: CtConsituentItem[]

  constructor(constituentItems: CtConsituentItem[]) {
    super()

    this.value = constituentItems
  }
}
