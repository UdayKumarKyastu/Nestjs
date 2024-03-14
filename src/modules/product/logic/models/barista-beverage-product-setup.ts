import { Attribute } from '@commercetools/platform-sdk'

import { BaristaSetupDto } from '../../../../shared/dto/barista-setup.dto'
import { CtAttributesResolver } from '../../../ct-utils/get-attribute-value'

export class BaristaBeverageProductSetup {
  requiresIceMachine: boolean
  requiresBlender: boolean
  canHaveVariants: boolean
  canBeDecaf: boolean
  canAddSyrup: boolean
  canAddExtraShot: boolean
  canAddWhippedCream: boolean
  canBeBlack: boolean
  milkCanBeSemiSkimmed: boolean
  milkCanBeSkimmed: boolean
  milkCanBeOat: boolean
  milkCanBeRiceCoconut: boolean
  milkCanBeSoya: boolean

  constructor(attributes: Attribute[] = []) {
    const getAttributeValue = CtAttributesResolver.constructAttributeValueGetter(attributes)

    this.requiresIceMachine = getAttributeValue<boolean>('requiresIceMachine')
    this.requiresBlender = getAttributeValue<boolean>('requiresBlender')
    this.canHaveVariants = getAttributeValue<boolean>('canHaveVariants')
    this.canBeDecaf = getAttributeValue<boolean>('canBeDecaf')
    this.canAddSyrup = getAttributeValue<boolean>('canAddSyrup')
    this.canAddExtraShot = getAttributeValue<boolean>('canAddExtraShot')
    this.canAddWhippedCream = getAttributeValue<boolean>('canAddWhippedCream')
    this.canBeBlack = getAttributeValue<boolean>('canBeBlack')
    this.milkCanBeSemiSkimmed = getAttributeValue<boolean>('milkCanBeSemiSkimmed')
    this.milkCanBeSkimmed = getAttributeValue<boolean>('milkCanBeSkimmed')
    this.milkCanBeOat = getAttributeValue<boolean>('milkCanBeOat')
    this.milkCanBeRiceCoconut = getAttributeValue<boolean>('milkCanBeRiceCoconut')
    this.milkCanBeSoya = getAttributeValue<boolean>('milkCanBeSoya')
  }

  toDto(): BaristaSetupDto {
    const baristaSetup: BaristaSetupDto = {
      canHaveVariants: this.canHaveVariants,
      blenderRequired: this.requiresBlender,
      canAddExtraCoffeeShot: this.canAddExtraShot,
      canAddSyrup: this.canAddSyrup,
      canAddWhippedCream: this.canAddWhippedCream,
      canBeDecaf: this.canBeDecaf,
      canBeWithOatMilk: this.milkCanBeOat,
      canBeWithoutMilk: this.canBeBlack,
      canBeWithRiceCoconutMilk: this.milkCanBeRiceCoconut,
      canBeWithSemiSkimmedMilk: this.milkCanBeSemiSkimmed,
      canBeWithSkimmedMilk: this.milkCanBeSkimmed,
      canBeWithSoyMilk: this.milkCanBeSoya,
      iceMachineRequired: this.requiresIceMachine,
    }

    return baristaSetup
  }
}
