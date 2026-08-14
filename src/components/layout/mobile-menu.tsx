"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { MgWordmark } from "@/components/brand/mg-wordmark";
import type { StoreProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  categories: StoreProductCategory[];
};

const SHOP_LINKS = [{ label: "Shop everything", href: "/products" }];

const DEALS_LINKS = [{ label: "Deals", href: "/deals" }];

const CUSTOMER_SERVICE_LINKS = [
  { label: "Delivery information", href: "/delivery" },
  { label: "Returns & refunds", href: "/returns" },
  { label: "Track order", href: "/track-order" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact us", href: "/contact" },
];

const ABOUT_LINKS = [
  { label: "About us", href: "/about" },
  { label: "Terms of service", href: "/terms" },
  { label: "Privacy policy", href: "/privacy" },
];

function LinkList({
  links,
  onClose,
}: {
  links: { label: string; href: string }[];
  onClose: () => void;
}) {
  return (
    <ul className="space-y-1">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={onClose}
            className="flex h-12 items-center rounded-lg px-3 text-base font-medium text-stone-900 transition-colors hover:bg-stone-100"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function MobileMenu({ open, onClose, categories }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const topLevel = categories.filter((c) => !c.parent_category_id);
  const renderLink = (href: string, label: string) => (
    <Link
      href={href}
      onClick={onClose}
      className="flex h-12 items-center rounded-lg px-3 text-base font-medium text-stone-900 transition-colors hover:bg-stone-100"
    >
      {label}
    </Link>
  );

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
          <Link href="/" onClick={onClose} aria-label="MARKSONGLOBAL STORES home">
            <MgWordmark compact />
          </Link>
          <button
            type="button"
            autoFocus
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100"
          >
            <X aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4">
          <div>
            <h3 className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Shop
            </h3>
            <ul className="space-y-1">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>{renderLink(link.href, link.label)}</li>
              ))}
              {topLevel.map((category) => {
                const hasChildren =
                  category.category_children &&
                  category.category_children.length > 0;
                return (
                  <li key={category.id}>
                    {hasChildren ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={expanded === category.id}
                          onClick={() =>
                            setExpanded(
                              expanded === category.id ? null : category.id,
                            )
                          }
                          className="flex h-12 w-full items-center justify-between rounded-lg px-3 text-base font-medium text-stone-900 transition-colors hover:bg-stone-100"
                        >
                          {category.name}
                          <ChevronDown
                            aria-hidden="true"
                            className={cn(
                              "h-5 w-5 text-stone-400 transition-transform",
                              expanded === category.id && "rotate-180",
                            )}
                          />
                        </button>
                        {expanded === category.id && (
                          <ul className="ml-4 mt-1 space-y-1 border-l border-stone-200 pl-3">
                            {category.category_children.map((child) => (
                              <li key={child.id}>
                                {renderLink(
                                  `/categories/${child.handle}`,
                                  child.name,
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      renderLink(`/categories/${category.handle}`, category.name)
                    )}
                  </li>
                );
              })}
              {DEALS_LINKS.map((link) => (
                <li key={link.href}>{renderLink(link.href, link.label)}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Customer service
            </h3>
            <LinkList links={CUSTOMER_SERVICE_LINKS} onClose={onClose} />
          </div>

          <div className="mt-6">
            <h3 className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Company
            </h3>
            <LinkList links={ABOUT_LINKS} onClose={onClose} />
          </div>
        </nav>
      </div>
    </div>
  );
}