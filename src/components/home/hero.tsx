import Link from "next/link";
import { Cpu, Home, ShoppingBasket, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const SHELF_ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: ShoppingBasket, label: "Groceries" },
  { icon: Smartphone, label: "Phones" },
  { icon: Cpu, label: "Electronics" },
  { icon: Home, label: "Household" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 28%, rgba(201, 162, 39, 0.18) 0, transparent 42%), radial-gradient(circle at 82% 72%, rgba(17, 80, 58, 0.9) 0, transparent 45%)",
        }}
      />
      <Container className="relative flex flex-col items-start gap-10 py-16 md:py-24 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
            MARKSONGLOBAL STORES
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Everything you need.
            <span className="mt-2 block text-gold-300">One store.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-brand-100">
            Shop groceries, provisions, household essentials and genuine
            electronics from MARKSONGLOBAL STORES — delivered across Nigeria.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className={buttonClasses({ variant: "gold", size: "lg" })}
            >
              Shop now
            </Link>
            <Link
              href="/deals"
              className={cn(
                buttonClasses({ variant: "outline", size: "lg" }),
                "border-white text-white hover:bg-white/10",
              )}
            >
              View deals
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md lg:w-96">
          <ul className="grid grid-cols-2 gap-4">
            {SHELF_ITEMS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-8 text-center backdrop-blur-sm"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-300">
                  <Icon aria-hidden="true" className="h-7 w-7" />
                </span>
                <span className="text-sm font-semibold text-white">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}