import { cn } from "@/lib/utils";
import { MgMark } from "@/components/brand/mg-mark";

type MgWordmarkProps = {
  className?: string;
  light?: boolean;
};

export function MgWordmark({ className, light = false }: MgWordmarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <MgMark className="h-11 w-11 text-xl" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-bold tracking-tight",
            light ? "text-white" : "text-brand-950",
          )}
        >
          MARKSONGLOBAL
        </span>
        <span
          className={cn(
            "text-[0.68rem] font-semibold tracking-[0.22em]",
            light ? "text-gold-300" : "text-gold-600",
          )}
        >
          STORES
        </span>
      </span>
    </span>
  );
}