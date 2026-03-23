import { AddItemToCartUseCase } from '@/application/use-cases/add-item-to-cart.use-case';
import { RemoveItemFromCartUseCase } from '@/application/use-cases/remove-item-from-cart.use-case';
import { UpdateItemInCartUseCase } from '@/application/use-cases/update-item-in-cart.use-case';
import { OrderPricingService } from '@/application/services/order-pricing.service';
import { OrderService } from '@/application/services/order.service';
import { CartItemService } from '@/application/services/cart-item.service';
import { CartOperationOrchestrator } from '@/application/services/cart-operation.orchestrator';
import { ModifierSelectionService } from '@/domain/services/modifier-selection.service';
import { PricingService } from '@/domain/services/pricing.service';
import { menuRepository, orderRepository, timelineRepository } from '@/infrastructure/container';

const pricingService = new PricingService();
const orderPricingService = new OrderPricingService(pricingService);
const modifierSelectionService = new ModifierSelectionService();
const orderService = new OrderService(orderRepository);
const cartItemService = new CartItemService(menuRepository, modifierSelectionService);
const cartOrchestrator = new CartOperationOrchestrator(
  orderRepository,
  timelineRepository,
  orderPricingService
);

export const addItemToCartUseCase = new AddItemToCartUseCase(
  orderRepository,
  timelineRepository,
  orderService,
  cartItemService,
  cartOrchestrator
);

export const updateItemInCartUseCase = new UpdateItemInCartUseCase(
  orderService,
  cartItemService,
  cartOrchestrator
);

export const removeItemFromCartUseCase = new RemoveItemFromCartUseCase(
  orderService,
  cartOrchestrator
);
