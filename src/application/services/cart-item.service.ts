import { OrderItem } from '@/domain/entities/order.entity';
import { MenuRepository } from '@/domain/repositories/menu.repository';
import { ModifierSelectionInput, ModifierSelectionService } from '@/domain/services/modifier-selection.service';
import { Money } from '@/domain/value-objects/money.vo';
import { NotFoundError } from '@/domain/errors/not-found.error';

export class CartItemService {
  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly modifierSelectionService: ModifierSelectionService
  ) {}

  async resolveProductWithModifiers(
    productId: string,
    quantity: number,
    modifiers?: ModifierSelectionInput[]
  ): Promise<OrderItem> {
    const product = await this.menuRepository.findById(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const basePrice = new Money(product.basePrice);
    const resolvedModifiers = this.modifierSelectionService.resolve(product, modifiers);

    return {
      productId: product.productId,
      name: product.name,
      basePrice,
      quantity,
      modifiers: resolvedModifiers,
    };
  }
}
