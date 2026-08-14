"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  AtSign,
  Globe,
  MessageCircle,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { MgWordmark } from "@/components/brand/mg-wordmark";
import { Container } from "@/components/ui/container";
import { sdk } from "@/lib/sdk";

const CUSTOMER_SERVICE_LINKS = [
  { label: "Delivery information", href: "/delivery" },
  { label: "Returns & refunds", href: "/returns" },
  { label: "Track order", href: "/track-order" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact us", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", Icon: Globe },
  { label: "Instagram", Icon: AtSign },
  { label: "TikTok", Icon: Share2 },
  { label: "WhatsApp", Icon: MessageCircle },
];

function FooterCategories() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { product_categories } = await sdk.store.category.list({
        include_descendants_tree: true,
        limit: 100,
      });
      return product_categories;
    },
    staleTime: 10 * 60 * 1000,
  });

  const topLevel = categories.filter((c) => !c.parent_category_id).slice(0, 8);
  if (topLevel.length === 0) return null;

  return (
    <ul className="space-y-2">
      {topLevel.map((category) => (
        <li key={category.id}>
          <Link
            href={`/categories/${category.handle}`}
            className="text-sm text-stone-300 transition-colors hover:text-gold-300"
          >
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Enter your email address.");
      setMessage(null);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email address.");
      setMessage(null);
      return;
    }
    setError(null);
    setMessage(
      "Subscriptions aren't live yet — we'll let you know when they open.",
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="text-sm font-semibold text-white">
        Get 10% off your first order
      </p>
      <p className="mt-1 text-xs text-stone-400">
        Deals, new arrivals and early access — straight to your inbox.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-12 w-full rounded-lg border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-stone-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
        />
        <button
          type="submit"
          className="h-12 shrink-0 rounded-lg bg-gold-500 px-5 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
        >
          Subscribe
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mt-2 text-xs text-gold-300">
          {message}
        </p>
      )}
    </form>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-stone-300">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <MgWordmark light />
          <p className="mt-4 max-w-xs text-sm text-stone-400">
            Everything you need. One store.
          </p>
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Follow us
            </p>
            <ul className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, Icon }) => (
                <li key={label}>
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 text-stone-300"
                    title={`${label} — links coming soon`}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav aria-label="Shop">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Shop
          </h3>
          <FooterCategories />
        </nav>

        <nav aria-label="Customer service">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Customer service
          </h3>
          <ul className="space-y-2">
            {CUSTOMER_SERVICE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-stone-300 transition-colors hover:text-gold-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Stay in the loop
          </h3>
          <NewsletterForm />
          <p className="mt-6 flex items-center gap-2 text-sm text-stone-400">
            <ShieldCheck aria-hidden="true" className="h-5 w-5 text-gold-400" />
            Secure payments: Visa, Mastercard, Verve, Paystack
          </p>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-stone-400 sm:flex-row">
          <p>© {year} MARKSONGLOBAL (MG) STORES. All rights reserved.</p>
          <ul className="flex gap-4">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-gold-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}