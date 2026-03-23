import { cn } from "@/shared/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  CREATED: "bg-amber-900/60 text-amber-400 border border-amber-600",
  PROCESSING: "bg-blue-900/60 text-blue-400 border border-blue-600",
  PLACED: "bg-purple-900/60 text-purple-400 border border-purple-600",
};

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export const OrderStatusBadge = ({
  status,
  className,
}: OrderStatusBadgeProps) => (
  <span
    className={cn(
      "rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest",
      STATUS_STYLES[status] ?? "bg-zinc-700 text-zinc-400 border border-zinc-600",
      className
    )}
  >
    {status}
  </span>
);
