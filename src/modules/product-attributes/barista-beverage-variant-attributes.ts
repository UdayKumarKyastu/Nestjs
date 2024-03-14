import { Attribute } from '@commercetools/platform-sdk'

import { CtAttributesResolver } from '../ct-utils/get-attribute-value'
import { BaristaAttributesDto } from '../../shared/dto/barista-attributes.dto'

import { IsDecafPodAttribute } from './barista-variant-attributes/is-decaf-pod-attribute'
import { IsBlackAttribute } from './barista-variant-attributes/is-black-attribute'
import { MilkIsSemiSkimmedAttribute } from './barista-variant-attributes/milk-is-semi-skimmed-attribute'
import { MilkIsSkimmedAttribute } from './barista-variant-attributes/milk-is-skimmed-attribute'
import { MilkIsOatAttribute } from './barista-variant-attributes/milk-is-oat-attribute'
import { MilkIsRiceCoconutAttribute } from './barista-variant-attributes/milk-is-rice-coconut-attribute'
import { MilkIsSoyaAttribute } from './barista-variant-attributes/milk-is-soya-attribute'
import { VariantNameAttribute } from './barista-variant-attributes/variant-name-attribute'

export class BaristaBeverageVariantAttributes {
  variantName: VariantNameAttribute

  isDecafPod: IsDecafPodAttribute
  isBlack: IsBlackAttribute
  milkIsSemiSkimmed: MilkIsSemiSkimmedAttribute
  milkIsSkimmed: MilkIsSkimmedAttribute
  milkIsOat: MilkIsOatAttribute
  milkIsRiceCoconut: MilkIsRiceCoconutAttribute
  milkIsSoya: MilkIsSoyaAttribute

  constructor(attributes: Attribute[] = []) {
    const getAttributeValue = CtAttributesResolver.constructAttributeValueGetter(attributes)

    this.variantName = new VariantNameAttribute(getAttributeValue(VariantNameAttribute))
    this.isDecafPod = new IsDecafPodAttribute(getAttributeValue(IsDecafPodAttribute) || false)
    this.isBlack = new IsBlackAttribute(getAttributeValue(IsBlackAttribute) || false)
    this.milkIsSemiSkimmed = new MilkIsSemiSkimmedAttribute(
      getAttributeValue(MilkIsSemiSkimmedAttribute) || false,
    )
    this.milkIsSkimmed = new MilkIsSkimmedAttribute(
      getAttributeValue(MilkIsSkimmedAttribute) || false,
    )
    this.milkIsOat = new MilkIsOatAttribute(getAttributeValue(MilkIsOatAttribute) || false)
    this.milkIsRiceCoconut = new MilkIsRiceCoconutAttribute(
      getAttributeValue(MilkIsRiceCoconutAttribute) || false,
    )
    this.milkIsSoya = new MilkIsSoyaAttribute(getAttributeValue(MilkIsSoyaAttribute) || false)
  }

  toDto(): BaristaAttributesDto {
    return {
      withDecafPods: this.isDecafPod.value,
      withOatMilk: this.milkIsOat.value,
      withoutMilk: this.isBlack.value,
      withRiceCoconutMilk: this.milkIsRiceCoconut.value,
      withSemiSkimmedMilk: this.milkIsSemiSkimmed.value,
      withSkimmedMilk: this.milkIsSkimmed.value,
      withSoyMilk: this.milkIsSoya.value,
    }
  }
}
