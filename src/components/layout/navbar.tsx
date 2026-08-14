"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Menu, Search, ShoppingCart, User } from "lucide-react";
import { MgWordmark } from "@/components/brand/mg-wordmark";
import { Container } from "@/components/ui/container";
import { useCart } from "@/components/providers/cart-provider";
import { SearchBar } from "@/components/search/search-bar";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { sdk } from "@/lib/sdk";
import { cn } from "@/lib/utils";

const STATIC_LINKS = [
  { label: "Deals", href: "/deals" },
  { label: "About us", href: "/about" },
];

export function Navbar() {
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

  const { cartCount, openCart } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const topLevelCategories = categories.filter((c) => !c.parent_category_id);
  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
      <div className="bg-brand-950 text-brand-100">
        <Container className="flex h-9 items-center justify-between text-xs">
          <p className="font-medium">Everything you need. One store.</p>
          <p className="hidden sm:block">We deliver across Nigeria</p>
        </Container>
      </div>

      <Container className="flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-stone-700 transition-colors hover:bg-stone-100 lg:hidden"
          >
            <Menu aria-hidden="true" className="h-6 w-6" />
          </button>
          <Link href="/" aria-label="MARKSONGLOBAL STORES home">
            <MgWordmark />
          </Link>
        </div>

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 lg:flex"
        >
          {topLevelCategories.map((category) => (
            <div key={category.id} className="group relative">
              <Link
                href={`/categories/${category.handle}`}
                aria-current={isActive(`/categories/${category.handle}`) ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium transition-colors",
                  isActive(`/categories/${category.handle}`)
                    ? "text-brand-800"
                    : "text-stone-700 hover:bg-stone-100 hover:text-brand-800",
                )}
              >
                {category.name}
                {category.category_children && category.category_children.length > 0 && (
                  <ChevronDown
                    aria-hidden="true"
                    className="h-4 w-4 text-stone-400"
                  />
                )}
              </Link>
              {category.category_children && category.category_children.length > 0 && (
                <div className="invisible absolute left-0 top-full z-20 w-56 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
                  <ul className="rounded-lg border border-stone-200 bg-white p-1 shadow-lg">
                    {category.category_children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/categories/${child.handle}`}
                          className="flex h-11 items-center rounded-md px-3 text-sm text-stone-700 transition-colors hover:bg-stone-50 hover:text-brand-800"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          {STATIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "flex h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-brand-800"
                  : "text-stone-700 hover:bg-stone-100 hover:text-brand-800",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchBar variant="header" />
          <button
            type="button"
            aria-label="Open search"
            onClick={() => setSearchOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-stone-700 transition-colors hover:bg-stone-100 md:hidden"
          >
            <Search aria-hidden="true" className="h-6 w-6" />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-stone-700 transition-colors hover:bg-stone-100"
          >
            <User aria-hidden="true" className="h-6 w-6" />
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Shopping cart with ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            className="relative flex h-11 w-11 items-center justify-center rounded-lg text-stone-700 transition-colors hover:bg-stone-100"
          >
            <ShoppingCart aria-hidden="true" className="h-6 w-6" />
            <span
              aria-live="polite"
              className={cn(
                "absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-xs font-bold text-brand-950",
                cartCount === 0 && "hidden",
              )}
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          </button>
        </div>
      </Container>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
      />
      <SearchBar
        variant="overlay"
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}