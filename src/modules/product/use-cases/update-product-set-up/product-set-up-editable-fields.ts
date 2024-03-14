import { UpdateProductSetUpDto } from './update-product-set-up.dto'

export class ProductSetUpEditableFields {
  requiresIceMachine!: boolean
  requiresBlender!: boolean
  canHaveVariants!: boolean
  canAddSyrup!: boolean
  canAddExtraShot!: boolean
  canAddWhippedCream!: boolean
}

export abstract class ProductSetUpEditableFieldsFactory {
  static fromUpdateSetupDto(dto: UpdateProductSetUpDto): ProductSetUpEditableFields {
    return {
      requiresBlender: dto.blenderRequired,
      canAddExtraShot: dto.canAddExtraCoffeeShot,
      canAddSyrup: dto.canAddSyrup,
      canAddWhippedCream: dto.canAddWhippedCream,
      canHaveVariants: dto.canHaveVariants,
      requiresIceMachine: dto.iceMachineRequired,
    }
  }
}
