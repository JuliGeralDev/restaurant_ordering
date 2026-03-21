import { OrderItemModifier } from '@/domain/entities/order.entity';
import { ValidationError } from '@/domain/errors/validation.error';
import { MenuProduct } from '@/domain/repositories/menu.repository';
import { Money } from '@/domain/value-objects/money.vo';

export interface ModifierSelectionInput {
  groupId: string;
  optionId: string;
  name: string;
  price: number;
}

export class ModifierSelectionService {
  resolve(
    product: MenuProduct,
    requestedModifiers: ModifierSelectionInput[] = []
  ): OrderItemModifier[] {
    if (!product.modifiers) {
      return [];
    }

    const groupedSelections = this.groupByGroupId(requestedModifiers);
    const resolvedModifiers: OrderItemModifier[] = [];

    for (const groupId of Object.keys(product.modifiers)) {
      const groupConfig = product.modifiers[groupId];
      const userSelections = groupedSelections[groupId] || [];

      if (groupConfig.required && userSelections.length === 0) {
        throw new ValidationError(`${groupId} is required`);
      }

      if (groupConfig.max && userSelections.length > groupConfig.max) {
        throw new ValidationError(`Too many ${groupId} selected (max: ${groupConfig.max})`);
      }

      for (const userSelection of userSelections) {
        const optionConfig = groupConfig.options[userSelection.optionId];

        if (!optionConfig) {
          throw new ValidationError(`Invalid ${groupId} option: ${userSelection.optionId}`);
        }

        resolvedModifiers.push({
          groupId,
          optionId: userSelection.optionId,
          name: optionConfig.name,
          price: new Money(optionConfig.price),
        });
      }
    }

    return resolvedModifiers;
  }

  private groupByGroupId(
    modifiers: ModifierSelectionInput[]
  ): Record<string, ModifierSelectionInput[]> {
    return modifiers.reduce<Record<string, ModifierSelectionInput[]>>((groups, modifier) => {
      if (!groups[modifier.groupId]) {
        groups[modifier.groupId] = [];
      }

      groups[modifier.groupId].push(modifier);
      return groups;
    }, {});
  }
}
