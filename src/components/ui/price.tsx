import { cn, formatMoney } from "@/lib/utils";

type PriceProps = {
  current: number;
  original?: number | null;
  currencyCode?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
};

export function Price({
  current,
  original,
  currencyCode = "NGN",
  size = "md",
  className,
}: PriceProps) {
  const hasDiscount = original != null && original > current;
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-baseline gap-x-2",
        className,
      )}
    >
      <span
        className={cn(
          "font-semibold tabular-nums text-brand-950",
          sizeClasses[size],
        )}
      >
        {formatMoney(current, currencyCode)}
      </span>
      {hasDiscount && (
        <span className="text-sm tabular-nums text-stone-400 line-through">
          {formatMoney(original, currencyCode)}
        </span>
      )}
    </span>
  );
}