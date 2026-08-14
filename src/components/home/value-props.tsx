import { BadgeCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";

const VALUE_PROPS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Truck,
    title: "Nationwide delivery",
    description: "From Lagos to Abuja, Onitsha to Port Harcourt.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    description: "Pay safely with card, bank or transfer.",
  },
  {
    icon: BadgeCheck,
    title: "Quality & genuine",
    description: "Authentic products, always.",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    description: "Simple returns within the policy window.",
  },
];

export function ValueProps() {
  return (
    <section className="bg-cream py-10 md:py-12">
      <Container>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-brand-950">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-stone-600">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}