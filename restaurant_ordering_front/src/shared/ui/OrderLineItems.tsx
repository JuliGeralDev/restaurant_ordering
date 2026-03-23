import { formatCurrency } from "@/shared/lib/formatters";

export interface OrderLineModifier {
  key: string;
  name: string;
  price: number;
}

export interface OrderLineItem {
  key: string;
  name: string;
  quantity: number;
  total: number;
  modifiers?: OrderLineModifier[];
}

interface OrderLineItemsProps {
  items: OrderLineItem[];
  className?: string;
  itemClassName?: string;
  nameClassName?: string;
  totalClassName?: string;
  modifierNameClassName?: string;
  modifierPriceClassName?: string;
}

export const OrderLineItems = ({
  items,
  className = "flex flex-col gap-1 rounded-lg border-2 border-zinc-700 bg-zinc-900 px-3 py-2",
  itemClassName = "flex items-center justify-between gap-2",
  nameClassName = "text-[11px] text-zinc-300",
  totalClassName = "shrink-0 text-[11px] tabular-nums text-zinc-400",
  modifierNameClassName = "text-[9px] uppercase tracking-wide text-zinc-500",
  modifierPriceClassName = "text-[9px] tabular-nums text-yellow-500",
}: OrderLineItemsProps) => (
  <div className={className}>
    {items.map((item) => (
      <div key={item.key} className="flex flex-col gap-0.5">
        <div className={itemClassName}>
          <span className={nameClassName}>
            <span className="font-bold text-green-400">{item.quantity}x</span> {item.name}
          </span>
          <span className={totalClassName}>{formatCurrency(item.total)}</span>
        </div>

        {item.modifiers && item.modifiers.length > 0 && (
          <ul className="ml-3 flex flex-col gap-0.5">
            {item.modifiers.map((modifier) => (
              <li key={modifier.key} className="flex items-center justify-between gap-2">
                <span className={modifierNameClassName}>+ {modifier.name}</span>
                {modifier.price > 0 && (
                  <span className={modifierPriceClassName}>
                    +{formatCurrency(modifier.price)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
);
