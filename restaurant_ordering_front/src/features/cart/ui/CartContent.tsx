import type { GroupedCartItem } from "@/features/cart/hooks/useGroupedCartItems";
import { CartItemRow } from "@/features/cart/ui/CartItemRow";
import { CartOrderSummary } from "@/features/cart/ui/CartOrderSummary";

interface CartContentProps {
  items: GroupedCartItem[];
  pricing: {
    subtotal: number;
    tax: number;
    serviceFee: number;
    total: number;
  };
  onIncrement: (item: GroupedCartItem) => void;
  onDecrement: (item: GroupedCartItem) => void;
  onRemoveAll: (item: GroupedCartItem) => void;
  onEdit: (item: GroupedCartItem) => void;
  onConfirm: () => void;
  isConfirming: boolean;
}

export const CartContent = ({
  items,
  pricing,
  onIncrement,
  onDecrement,
  onRemoveAll,
  onEdit,
  onConfirm,
  isConfirming,
}: CartContentProps) => (
  <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
    <div className="flex w-full flex-col gap-4 lg:w-[60%]">
      {items.map((item) => (
        <CartItemRow
          key={item.key}
          item={item}
          onIncrement={() => onIncrement(item)}
          onDecrement={() => onDecrement(item)}
          onEdit={() => onEdit(item)}
          onRemove={() => onRemoveAll(item)}
        />
      ))}
    </div>

    <div className="w-full lg:w-[40%] lg:sticky lg:top-20">
      <CartOrderSummary
        pricing={pricing}
        items={items}
        onConfirm={onConfirm}
        isLoading={isConfirming}
      />
    </div>
  </div>
);
