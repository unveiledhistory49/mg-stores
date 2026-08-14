import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type RouteStubProps = {
  title: string;
  description: string;
};

export function RouteStub({ title, description }: RouteStubProps) {
  return (
    <Container className="py-24 md:py-32">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
          MARKSONGLOBAL STORES
        </p>
        <h1 className="font-display text-3xl font-bold text-brand-950">
          {title}
        </h1>
        <p className="text-stone-600">{description}</p>
        <Link
          href="/"
          className={buttonClasses({ variant: "primary", size: "md" })}
        >
          Back to the store
        </Link>
      </div>
    </Container>
  );
}