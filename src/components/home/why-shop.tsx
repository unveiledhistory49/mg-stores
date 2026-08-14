import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";

const REASONS = [
  "Quality products",
  "Affordable prices",
  "Nationwide delivery",
  "Secure payments",
  "Excellent customer service",
  "Genuine electronics",
];

export function WhyShop() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow="Why shop with us"
          title="Why shop with MG Stores?"
          align="center"
        />
        <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason) => (
            <li
              key={reason}
              className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-5 py-4"
            >
              <CheckCircle2 aria-hidden="true" className="h-6 w-6 shrink-0 text-gold-500" />
              <span className="font-medium text-stone-800">{reason}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}