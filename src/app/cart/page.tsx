"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Package, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Container } from "@/components/ui/container";
import { Button, buttonClasses } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatMoney } from "@/lib/utils";
import type { StoreCart } from "@/lib/types";

function currencyCodeOf(cart: StoreCart | null): string {
  return cart?.currency_code ?? "NGN";
}

function PromoCodeForm() {
  const { cart, applyPromotion, removePromotion, isMutating } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const appliedPromotions = cart?.promotions ?? [];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = code.trim().toUpperCase();
    if (!value) return;
    setError(null);
    const ok = await applyPromotion(value);
    if (ok) {
      setCode("");
    } else {
      setError("That promo code couldn't be applied. Check it and try again.");
    }
  };

  const handleRemove = async (promoCode: string) => {
    setError(null);
    await removePromotion(promoCode);
  };

  return (
    <div className="mt-6">
      {appliedPromotions.length > 0 ? (
        <div className="space-y-2">
          {appliedPromotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  Code applied: {promotion.code ?? ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(promotion.code ?? "")}
                disabled={isMutating || !promotion.code}
                aria-label={`Remove promo code ${promotion.code ?? ""}`}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-emerald-800 transition-colors hover:bg-emerald-100"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="promo-code" className="sr-only">
            Promo code
          </label>
          <input
            id="promo-code"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Promo code"
            autoComplete="off"
            className="h-12 w-full rounded-lg border border-stone-300 bg-white px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20"
          />
          <Button type="submit" disabled={isMutating || !code.trim()} size="md">
            {isMutating ? "Applying..." : "Apply"}
          </Button>
        </form>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CartPage() {
  const {
    cart,
    isLoading,
    isMutating,
    error,
    updateQuantity,
    removeItem,
  } = useCart();

  const items = cart?.items ?? [];
  const currencyCode = currencyCodeOf(cart);
  const subtotal = cart?.subtotal ?? cart?.item_subtotal ?? null;
  const discount = cart?.discount_total ?? null;
  const shipping = cart?.shipping_total ?? null;
  const tax = cart?.tax_total ?? null;
  const total = cart?.total ?? null;

  return (
    <Container className="py-12 md:py-16">
      <h1 className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">
        Your cart
      </h1>

      {error && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-dashed border-brand-200 bg-cream px-6 py-16 text-center">
          <ShoppingBag aria-hidden="true" className="h-14 w-14 text-stone-300" />
          <h2 className="font-display text-xl font-semibold text-brand-900">
            Your cart is empty
          </h2>
          <p className="max-w-md text-stone-600">
            Start adding items from the store to see them here.
          </p>
          <Link
            href="/products"
            className={buttonClasses({ variant: "primary", size: "lg" })}
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <ul className="space-y-5">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-stone-200 bg-white p-4"
                >
                  <Link
                    href={item.product_handle ? `/products/${item.product_handle}` : "/products"}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-100"
                  >
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        sizes="96px"
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package aria-hidden="true" className="h-7 w-7 text-stone-300" />
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={item.product_handle ? `/products/${item.product_handle}` : "/products"}
                          className="font-medium text-stone-900 hover:text-brand-800"
                        >
                          {item.title}
                        </Link>
                        {item.variant?.title ? (
                          <p className="mt-0.5 text-sm text-stone-500">
                            Variant: {item.variant.title}
                          </p>
                        ) : null}
                        {item.product_type ? (
                          <p className="mt-0.5 text-xs text-stone-400">
                            {item.product_type}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.title}`}
                        onClick={() => removeItem(item.id)}
                        disabled={isMutating}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 aria-hidden="true" className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
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
                      <span className="font-semibold tabular-nums text-brand-950">
                        {formatMoney(item.unit_price ?? 0, currencyCode)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <PromoCodeForm />
            </div>

            <p className="mt-6 text-sm text-stone-500">
              <Link href="/products" className="font-semibold text-brand-800 hover:text-brand-700">
                Continue shopping
              </Link>
            </p>
          </div>

          <aside className="h-fit rounded-xl border border-stone-200 bg-white p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-semibold text-brand-950">
              Order summary
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">
                  {subtotal != null ? formatMoney(subtotal, currencyCode) : "—"}
                </dd>
              </div>
              {discount != null && discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <dt>Discount</dt>
                  <dd className="tabular-nums">−{formatMoney(discount, currencyCode)}</dd>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <dt>Shipping</dt>
                <dd>{shipping != null ? formatMoney(shipping, currencyCode) : "Calculated at checkout"}</dd>
              </div>
              {tax != null && tax > 0 && (
                <div className="flex justify-between text-stone-600">
                  <dt>Tax</dt>
                  <dd className="tabular-nums">{formatMoney(tax, currencyCode)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-4 flex justify-between border-t border-stone-200 pt-4">
              <span className="font-medium text-stone-900">Total</span>
              <span className="text-lg font-bold tabular-nums text-brand-950">
                {total != null ? formatMoney(total, currencyCode) : "—"}
              </span>
            </div>
            <Link
              href="/checkout"
              className={cn(buttonClasses({ variant: "gold", size: "lg" }), "mt-6 w-full")}
            >
              Proceed to checkout
            </Link>
            <p className="mt-3 text-center text-xs text-stone-500">
              Secure checkout — Visa, Mastercard, Verve, Paystack
            </p>
          </aside>
        </div>
      )}
    </Container>
  );
}