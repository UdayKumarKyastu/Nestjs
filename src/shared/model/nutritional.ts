import { MultilangString } from '../../modules/product/logic/models/multilang-string'
import { NutritionalsAttribute } from '../../modules/product-attributes/common-variant-attributes/nutritionals-attribute'
import { NutritionItemDto } from '../dto/hamilton-grant.dto'

export class Nutritional {
  private _tag = 'Nutritional'

  code: string
  per100g: number | null = null
  perServing: number | null = null
  localizedLabel: MultilangString

  constructor(nutritional: {
    item: string
    per100g: number | null
    perServing: number | null
    localizedLabel?: MultilangString
  }) {
    this.code = nutritional.item
    this.per100g = nutritional.per100g
    this.perServing = nutritional.perServing
    this.localizedLabel =
      nutritional.localizedLabel ?? new MultilangString({ 'en-GB': nutritional.item })
  }
}

export abstract class NutritionalsMapper {
  static mapNutritionalsAttributeToModel(nutritionals: NutritionalsAttribute): Nutritional[] {
    return nutritionals?.value.map((value): Nutritional => {
      const [item, label, per100g, perServing] = value

      return new Nutritional({
        item: item?.value.key,
        per100g: per100g?.value,
        perServing: perServing?.value,
        localizedLabel: new MultilangString(label?.value.label || {}),
      })
    })
  }

  static mapNutritionalToDto(nutr: Nutritional): NutritionItemDto {
    return {
      per100g: nutr.per100g,
      perServing: nutr.perServing,
      name: nutr.code,
      localisedLabel: nutr.localizedLabel.toDto(),
    }
  }
}
