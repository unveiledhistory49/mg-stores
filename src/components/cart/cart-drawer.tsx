"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Package, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { buttonClasses } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatMoney } from "@/lib/utils";

export function CartDrawer() {
  const {
    cart,
    isLoading,
    isMutating,
    error,
    cartCount,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  useEffect(() => {
    if (!isCartOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? cart?.item_subtotal ?? null;
  const currencyCode = cart?.currency_code ?? "NGN";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 h-full w-full bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-brand-950">
            Your cart
            {cartCount > 0 && (
              <span className="ml-2 text-base font-normal text-stone-500">
                ({cartCount})
              </span>
            )}
          </h2>
          <button
            type="button"
            autoFocus
            aria-label="Close cart"
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100"
          >
            <X aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div
            role="status"
            className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag aria-hidden="true" className="h-12 w-12 text-stone-300" />
              <p className="font-display text-lg font-medium text-brand-950">
                Your cart is empty
              </p>
              <p className="text-sm text-stone-500">
                Add items from the store to get started.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className={buttonClasses({ variant: "outline", size: "md" })}
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        sizes="80px"
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package aria-hidden="true" className="h-6 w-6 text-stone-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm font-medium text-stone-900">{item.title}</p>
                    {item.variant?.title ? (
                      <p className="text-xs text-stone-500">{item.variant.title}</p>
                    ) : null}
                    <Price
                      current={item.unit_price ?? 0}
                      currencyCode={currencyCode}
                      size="sm"
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-stone-300">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.title}`}
                          disabled={isMutating}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-11 w-11 items-center justify-center text-stone-600 disabled:opacity-50"
                        >
                          <Minus aria-hidden="true" className="h-4 w-4" />
                        </button>
                        <span
                          aria-live="polite"
                          className="w-8 text-center text-sm tabular-nums"
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.title}`}
                          disabled={isMutating}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-11 w-11 items-center justify-center text-stone-600 disabled:opacity-50"
                        >
                          <Plus aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.title}`}
                        onClick={() => removeItem(item.id)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 aria-hidden="true" className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isLoading && items.length > 0 && (
          <div className="border-t border-stone-200 px-5 py-4">
            <div className="mb-1 flex items-center justify-between text-base">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-semibold tabular-nums text-brand-950">
                {subtotal != null ? formatMoney(subtotal, currencyCode) : "—"}
              </span>
            </div>
            <p className="mb-4 text-xs text-stone-500">
              Shipping calculated at checkout.
            </p>
            <div className="flex gap-3">
              <Link
                href="/cart"
                onClick={closeCart}
                className={buttonClasses({ variant: "outline", size: "md" })}
              >
                View cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className={cn(buttonClasses({ variant: "gold", size: "md" }), "flex-1")}
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}