import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "gold" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex select-none items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-800 text-white hover:bg-brand-700",
  gold: "bg-gold-500 text-brand-950 hover:bg-gold-400",
  outline: "border border-brand-800 text-brand-800 hover:bg-brand-50",
  ghost: "text-brand-800 hover:bg-brand-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}