import type { OrderItemDto } from "../cart.types";

export const CartItemPanel = ({ item }: { item: OrderItemDto }) => (
  <div className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-zinc-700 bg-zinc-800 p-2">
    {/* Image */}
    <div className="relative h-14 w-full overflow-hidden rounded-lg border-2 border-zinc-700 bg-zinc-900">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover brightness-90"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-xl font-bold text-zinc-600">
            {item.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
    {/* Name */}
    <p className="text-wrap w-full text-center text-xs  text-green-400">
      {item.name}
    </p>
    {/* Quantity */}
    <p className="text-xs text-zinc-500">Quantity ×{item.quantity}</p>
  </div>
);
