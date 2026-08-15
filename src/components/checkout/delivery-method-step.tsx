"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Truck } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { sdk } from "@/lib/sdk";
import { cn, formatMoney } from "@/lib/utils";

type DeliveryMethodStepProps = {
  onContinue: () => void;
};

export function DeliveryMethodStep({ onContinue }: DeliveryMethodStepProps) {
  const { cart, refreshCart } = useCart();
  const [pendingSelected, setPendingSelected] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartId = cart?.id ?? "";
  const cartShipping = cart?.shipping_methods?.[0];
  const currencyCode = cart?.currency_code ?? "NGN";
  const selected = pendingSelected ?? cartShipping?.id ?? null;

  const { data: shippingOptions = [], isLoading } = useQuery({
    queryKey: ["shipping-options", cartId],
    queryFn: async () => {
      if (!cartId) return [];
      const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
        cart_id: cartId,
      });
      return shipping_options;
    },
    enabled: Boolean(cartId),
    staleTime: 30 * 1000,
  });

  const handleSelect = async (optionId: string) => {
    if (!cartId) return;
    setPendingSelected(optionId);
    setError(null);
    setIsSaving(true);
    try {
      await sdk.store.cart.addShippingMethod(cartId, { option_id: optionId });
      await refreshCart();
    } catch {
      setPendingSelected(null);
      setError("Could not save that delivery method. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p className="text-sm text-stone-500">Loading delivery options...</p>
      ) : shippingOptions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-sm text-stone-600">
          No delivery options are available yet. Configure shipping options in
          the Medusa backend to continue.
        </div>
      ) : (
        <div role="radiogroup" aria-label="Delivery method" className="space-y-3">
          {shippingOptions.map((option) => {
            const isSelected = selected === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 rounded-xl border bg-white p-4 text-left transition",
                  isSelected
                    ? "border-brand-800 ring-2 ring-brand-800/20"
                    : "border-stone-200 hover:border-brand-300",
                )}
              >
                <span className="flex items-center gap-3">
                  <Truck
                    aria-hidden="true"
                    className={cn(
                      "h-6 w-6 shrink-0",
                      isSelected ? "text-brand-800" : "text-stone-400",
                    )}
                  />
                  <span>
                    <span className="block font-medium text-stone-900">
                      {option.name}
                    </span>
                    {option.type?.description && (
                      <span className="block text-sm text-stone-500">
                        {option.type.description}
                      </span>
                    )}
                  </span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-brand-950">
                  {formatMoney(option.amount, currencyCode)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <Button
        size="lg"
        onClick={onContinue}
        disabled={!cartShipping || isSaving}
        className="mt-6 w-full sm:w-auto"
      >
        Continue to payment
      </Button>
    </div>
  );
}