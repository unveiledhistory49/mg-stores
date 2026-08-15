"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Lock, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShippingInformationStep } from "@/components/checkout/shipping-information-step";
import { DeliveryMethodStep } from "@/components/checkout/delivery-method-step";
import { PaymentMethodStep } from "@/components/checkout/payment-method-step";
import { OrderReviewStep } from "@/components/checkout/order-review-step";
import { sdk } from "@/lib/sdk";
import { cn, formatMoney } from "@/lib/utils";
import type { StoreCart } from "@/lib/types";

type CheckoutFormData = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
};

const STEPS = ["Shipping", "Delivery", "Payment", "Review"] as const;

function OrderSummarySidebar({ cart }: { cart: StoreCart }) {
  const items = cart.items ?? [];
  const currencyCode = cart.currency_code ?? "NGN";
  return (
    <aside className="h-fit rounded-xl border border-stone-200 bg-white p-6 lg:sticky lg:top-24">
      <h2 className="font-display text-lg font-semibold text-brand-950">
        Order summary
        <span className="ml-2 text-sm font-normal text-stone-500">
          ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
        </span>
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 flex-1 truncate text-stone-700">
              {item.title}
              {item.quantity > 1 ? ` × ${item.quantity}` : ""}
            </span>
            <span className="shrink-0 tabular-nums text-stone-900">
              {formatMoney(item.unit_price ?? 0, currencyCode)}
            </span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm">
        <div className="flex justify-between text-stone-600">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">
            {cart.subtotal != null ? formatMoney(cart.subtotal, currencyCode) : "—"}
          </dd>
        </div>
        {cart.discount_total != null && cart.discount_total > 0 && (
          <div className="flex justify-between text-emerald-700">
            <dt>Discount</dt>
            <dd className="tabular-nums">
              −{formatMoney(cart.discount_total, currencyCode)}
            </dd>
          </div>
        )}
        {cart.shipping_total != null && (
          <div className="flex justify-between text-stone-600">
            <dt>Delivery</dt>
            <dd className="tabular-nums">
              {formatMoney(cart.shipping_total, currencyCode)}
            </dd>
          </div>
        )}
        {cart.tax_total != null && cart.tax_total > 0 && (
          <div className="flex justify-between text-stone-600">
            <dt>Tax</dt>
            <dd className="tabular-nums">
              {formatMoney(cart.tax_total, currencyCode)}
            </dd>
          </div>
        )}
      </dl>
      <div className="mt-4 flex justify-between border-t border-stone-200 pt-4">
        <span className="font-medium text-stone-900">Total</span>
        <span className="text-lg font-bold tabular-nums text-brand-950">
          {cart.total != null ? formatMoney(cart.total, currencyCode) : "—"}
        </span>
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
        <Lock aria-hidden="true" className="h-4 w-4" />
        Secure checkout
      </p>
    </aside>
  );
}

export default function CheckoutPage() {
  const { cart, isLoading, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const saveShipping = async (data: CheckoutFormData) => {
    if (!cart) return;
    setIsSaving(true);
    setOrderError(null);
    try {
      await sdk.store.cart.update(cart.id, {
        email: data.email,
        shipping_address: {
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone || null,
          address_1: data.address_1,
          address_2: data.address_2 || null,
          city: data.city,
          province: data.province || null,
          postal_code: data.postal_code || null,
          country_code: data.country_code,
        },
      });
      setStep(1);
    } catch {
      setOrderError("Could not save your delivery details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const placeOrder = async () => {
    if (!cart) return;
    const result = await sdk.store.cart.complete(cart.id);
    if (result.type === "order" && result.order) {
      clearCart();
      router.push(`/order-confirmation/${result.order.id}`);
      return;
    }
    throw new Error(
      result.type === "cart"
        ? result.error?.message ??
            "Your order could not be completed. Please try again."
        : "Your order could not be completed. Please try again.",
    );
  };

  return (
    <Container className="py-12 md:py-16">
      <h1 className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">
        Checkout
      </h1>

      {isLoading ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : !cart || (cart.items ?? []).length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-dashed border-brand-200 bg-cream px-6 py-16 text-center">
          <ShoppingBag aria-hidden="true" className="h-14 w-14 text-stone-300" />
          <h2 className="font-display text-xl font-semibold text-brand-900">
            Your cart is empty
          </h2>
          <p className="max-w-md text-stone-600">
            Add some items before heading to checkout.
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
            <ol className="mb-8 flex flex-wrap items-center gap-2">
              {STEPS.map((label, index) => {
                const isDone = index < step;
                const isCurrent = index === step;
                return (
                  <li
                    key={label}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                        isDone
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : isCurrent
                            ? "border-brand-800 bg-brand-800 text-white"
                            : "border-stone-300 text-stone-400",
                      )}
                    >
                      {isDone ? <Check aria-hidden="true" className="h-4 w-4" /> : index + 1}
                    </span>
                    <span
                      className={cn(
                        isCurrent ? "font-semibold text-brand-950" : "text-stone-500",
                      )}
                    >
                      {label}
                    </span>
                    {index < STEPS.length - 1 && (
                      <span className="mx-1 h-px w-4 bg-stone-300" aria-hidden="true" />
                    )}
                  </li>
                );
              })}
            </ol>

            {orderError && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
              >
                {orderError}
              </div>
            )}

            <section aria-label="Shipping information">
              <h2 className="mb-4 font-display text-xl font-semibold text-brand-950">
                1. Delivery details
              </h2>
              <ShippingInformationStep onSubmit={saveShipping} isSubmitting={isSaving} />
            </section>

            {step >= 1 && (
              <section aria-label="Delivery method" className="mt-10">
                <h2 className="mb-4 font-display text-xl font-semibold text-brand-950">
                  2. Delivery method
                </h2>
                <DeliveryMethodStep onContinue={() => setStep(2)} />
              </section>
            )}

            {step >= 2 && (
              <section aria-label="Payment" className="mt-10">
                <h2 className="mb-4 font-display text-xl font-semibold text-brand-950">
                  3. Payment method
                </h2>
                <PaymentMethodStep onContinue={() => setStep(3)} />
              </section>
            )}

            {step >= 3 && (
              <section aria-label="Review" className="mt-10">
                <h2 className="mb-4 font-display text-xl font-semibold text-brand-950">
                  4. Review & place order
                </h2>
                <OrderReviewStep onPlaceOrder={placeOrder} />
              </section>
            )}
          </div>

          <OrderSummarySidebar cart={cart} />
        </div>
      )}
    </Container>
  );
}