import { cn } from "@/lib/utils";

type MgMarkProps = {
  className?: string;
};

export function MgMark({ className }: MgMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold-500/40 bg-brand-900 font-display text-lg font-bold text-gold-400",
        className,
      )}
    >
      MG
    </span>
  );
}