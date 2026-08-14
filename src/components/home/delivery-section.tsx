import Link from "next/link";
import { MapPin } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const CITIES = [
  "Lagos",
  "Abuja",
  "Onitsha",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Enugu",
  "Benin City",
];

export function DeliverySection() {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-16 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 flex h-64 w-64 items-center justify-center rounded-3xl border border-gold-500/20 bg-brand-900/60 text-gold-400/20"
      >
        <span className="font-display text-8xl font-extrabold">MG</span>
      </div>
      <Container className="relative">
        <div className="max-w-2xl">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
            Nationwide delivery
          </p>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            We deliver across Nigeria.
          </h2>
          <p className="mt-4 text-lg text-stone-300">
            From Lagos to Abuja, Onitsha to Port Harcourt — everyday essentials
            delivered to your door.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CITIES.map((city) => (
              <li
                key={city}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-brand-100"
              >
                <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-gold-400" />
                {city}
              </li>
            ))}
          </ul>
          <Link
            href="/products"
            className={cn(buttonClasses({ variant: "gold", size: "lg" }), "mt-8")}
          >
            Shop now
          </Link>
        </div>
      </Container>
    </section>
  );
}