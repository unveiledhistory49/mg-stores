"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock, Package } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

type OrderReviewStepProps = {
  onPlaceOrder: () => Promise<void>;
};

export function OrderReviewStep({ onPlaceOrder }: OrderReviewStepProps) {
  const { cart, isMutating } = useCart();
  const [error, setError] = useState<string | null>(null);

  if (!cart) return null;

  const items = cart.items ?? [];
  const currencyCode = cart.currency_code ?? "NGN";
  const address = cart.shipping_address;
  const shippingMethod = cart.shipping_methods?.[0];
  const paymentSession = cart.payment_collection?.payment_sessions?.[0];

  const handleSubmit = async () => {
    setError(null);
    try {
      await onPlaceOrder();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not place your order.",
      );
    }
  };

  return (
    <div>
      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <h3 className="font-display text-lg font-semibold text-brand-950">
          Review your order
        </h3>

        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="64px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package aria-hidden="true" className="h-6 w-6 text-stone-300" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-900">{item.title}</p>
                {item.variant?.title ? (
                  <p className="text-xs text-stone-500">{item.variant.title}</p>
                ) : null}
                <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold tabular-nums text-stone-900">
                {formatMoney(item.unit_price ?? 0, currencyCode)}
              </span>
            </div>
          ))}
        </div>

        <dl className="mt-5 space-y-2 border-t border-stone-200 pt-4 text-sm">
          <div className="flex justify-between text-stone-600">
            <dt>Delivery to</dt>
            <dd className="max-w-[60%] text-right">
              {address
                ? [
                    address.first_name,
                    address.last_name,
                    address.address_1,
                    address.city,
                    address.province,
                    address.postal_code,
                  ]
                    .filter(Boolean)
                    .join(", ")
                : "—"}
            </dd>
          </div>
          <div className="flex justify-between text-stone-600">
            <dt>Delivery method</dt>
            <dd>{shippingMethod?.name ?? "—"}</dd>
          </div>
          <div className="flex justify-between text-stone-600">
            <dt>Payment method</dt>
            <dd>{paymentSession?.provider_id ?? "—"}</dd>
          </div>
        </dl>

        <div className="mt-5 space-y-2 border-t border-stone-200 pt-4">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span className="tabular-nums">
              {cart.subtotal != null ? formatMoney(cart.subtotal, currencyCode) : "—"}
            </span>
          </div>
          {cart.discount_total != null && cart.discount_total > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount</span>
              <span className="tabular-nums">
                −{formatMoney(cart.discount_total, currencyCode)}
              </span>
            </div>
          )}
          {cart.shipping_total != null && (
            <div className="flex justify-between text-stone-600">
              <span>Delivery</span>
              <span className="tabular-nums">
                {formatMoney(cart.shipping_total, currencyCode)}
              </span>
            </div>
          )}
          {cart.tax_total != null && cart.tax_total > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>Tax</span>
              <span className="tabular-nums">
                {formatMoney(cart.tax_total, currencyCode)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-stone-200 pt-3">
            <span className="font-medium text-stone-900">Total</span>
            <span className="text-lg font-bold tabular-nums text-brand-950">
              {cart.total != null ? formatMoney(cart.total, currencyCode) : "—"}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <Button
        size="lg"
        onClick={handleSubmit}
        disabled={isMutating}
        className="mt-6 w-full"
      >
        <Lock aria-hidden="true" className="h-4 w-4" />
        {isMutating ? "Placing order..." : `Place order`}
      </Button>
      <p className="mt-3 text-center text-xs text-stone-500">
        Secure checkout — Visa, Mastercard, Verve, Paystack
      </p>
    </div>
  );
}