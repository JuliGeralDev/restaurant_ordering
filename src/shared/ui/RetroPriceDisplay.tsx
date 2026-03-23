import { formatCurrency } from "@/shared/lib/formatters";

interface RetroPriceDisplayProps {
  price: number;
  className?: string;
}

export const RetroPriceDisplay = ({
  price,
  className = "mb-2 rounded-xl border-4 border-zinc-700 bg-zinc-800 px-3 py-2 text-center text-lg font-bold text-green-400 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]",
}: RetroPriceDisplayProps) => (
  <div className={className}>{formatCurrency(price)}</div>
);
