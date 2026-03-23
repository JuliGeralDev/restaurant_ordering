import { formatCurrency } from "@/shared/lib/formatters";

interface PricingRow {
  label: string;
  value: number;
}

interface PricingBreakdownProps {
  rows: PricingRow[];
  total: number;
  className?: string;
  rowValueClassName?: string;
  totalValueClassName?: string;
}

export const PricingBreakdown = ({
  rows,
  total,
  className = "flex flex-col gap-1 rounded-lg border-2 border-zinc-700 bg-zinc-900 px-3 py-2",
  rowValueClassName = "text-[10px] tabular-nums text-zinc-400",
  totalValueClassName = "text-xs font-bold tabular-nums text-green-400",
}: PricingBreakdownProps) => (
  <div className={className}>
    {rows.map(({ label, value }) => (
      <div key={label} className="flex justify-between gap-2">
        <span className="text-[9px] uppercase tracking-wide text-zinc-500">
          {label}
        </span>
        <span className={rowValueClassName}>{formatCurrency(value)}</span>
      </div>
    ))}

    <div className="mt-1 flex justify-between gap-2 border-t border-zinc-700 pt-1">
      <span className="text-[9px] font-bold uppercase tracking-wide text-zinc-400">
        Total
      </span>
      <span className={totalValueClassName}>{formatCurrency(total)}</span>
    </div>
  </div>
);
