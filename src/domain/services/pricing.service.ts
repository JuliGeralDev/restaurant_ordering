import { OrderItem } from '@/domain/entities/order.entity';
import { Money } from '@/domain/value-objects/money.vo';

export class PricingService {
  calculateSubtotal(items: OrderItem[]): Money {
    let total = 0;

    for (const item of items) {
      const base = item.basePrice.value * item.quantity;

      const modifiersTotal = item.modifiers.reduce(
        (sum, mod) => sum + mod.price.value,
        0
      ) * item.quantity;

      total += base + modifiersTotal;
    }

    return new Money(total);
  }

  calculateTax(subtotal: Money): Money {
    const taxRate = 0.1; // 10%
    const taxAmount = Math.round(subtotal.value * taxRate);
    return new Money(taxAmount);
  }

  calculateServiceFee(subtotal: Money): Money {
    const feeRate = 0.05; // 5%
    const feeAmount = Math.round(subtotal.value * feeRate);
    return new Money(feeAmount);
  }

  calculateTotal(subtotal: Money): Money {
    const tax = this.calculateTax(subtotal);
    const serviceFee = this.calculateServiceFee(subtotal);

    return subtotal.add(tax).add(serviceFee);
  }
}