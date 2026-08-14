import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "sale" | "deal" | "new" | "out" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  sale: "bg-gold-500 text-brand-950",
  deal: "bg-brand-800 text-gold-300",
  new: "bg-brand-100 text-brand-800",
  out: "bg-stone-200 text-stone-600",
  neutral: "bg-stone-100 text-stone-600",
};

type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
};

export function Badge({ variant = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}