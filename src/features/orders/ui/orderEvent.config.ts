import {
  ShoppingCart,
  Trash2,
  RefreshCw,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Edit,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventConfig = {
  label: string;
  icon: React.ElementType;
  borderClass: string;
  iconClass: string;
  dotClass: string;
  badgeClass: string;
};

// ─── Config registry ─────────────────────────────────────────────────────────
// To support a new event type visually, add an entry here.

export const EVENT_CONFIG: Record<string, EventConfig> = {
  CART_ITEM_ADDED: {
    label: "Item Added",
    icon: ShoppingCart,
    borderClass: "border-green-800",
    iconClass: "text-green-400",
    dotClass: "bg-green-500",
    badgeClass: "bg-green-900/50 text-green-400",
  },
  CART_ITEM_UPDATED: {
    label: "Item Updated",
    icon: Edit,
    borderClass: "border-yellow-800",
    iconClass: "text-yellow-400",
    dotClass: "bg-yellow-500",
    badgeClass: "bg-yellow-900/50 text-yellow-400",
  },
  CART_ITEM_REMOVED: {
    label: "Item Removed",
    icon: Trash2,
    borderClass: "border-red-800",
    iconClass: "text-red-400",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-900/50 text-red-400",
  },
  PRICING_CALCULATED: {
    label: "Pricing Calculated",
    icon: Calculator,
    borderClass: "border-blue-800",
    iconClass: "text-blue-400",
    dotClass: "bg-blue-500",
    badgeClass: "bg-blue-900/50 text-blue-400",
  },
  ORDER_PLACED: {
    label: "Order Placed",
    icon: CheckCircle,
    borderClass: "border-purple-800",
    iconClass: "text-purple-400",
    dotClass: "bg-purple-500",
    badgeClass: "bg-purple-900/50 text-purple-400",
  },
  ORDER_STATUS_CHANGED: {
    label: "Status Changed",
    icon: RefreshCw,
    borderClass: "border-orange-800",
    iconClass: "text-orange-400",
    dotClass: "bg-orange-500",
    badgeClass: "bg-orange-900/50 text-orange-400",
  },
  VALIDATION_FAILED: {
    label: "Validation Failed",
    icon: AlertTriangle,
    borderClass: "border-red-800",
    iconClass: "text-red-400",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-900/50 text-red-400",
  },
};

export const DEFAULT_CONFIG: EventConfig = {
  label: "Event",
  icon: RefreshCw,
  borderClass: "border-zinc-700",
  iconClass: "text-zinc-400",
  dotClass: "bg-zinc-500",
  badgeClass: "bg-zinc-800 text-zinc-400",
};
