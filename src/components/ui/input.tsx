import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-lg border border-stone-300 bg-white px-4 text-base text-stone-900 placeholder:text-stone-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20",
        className,
      )}
      {...props}
    />
  );
});