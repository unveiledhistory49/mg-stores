"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { sdk } from "@/lib/sdk";
import { cn } from "@/lib/utils";

const PROVIDER_LABELS: Record<string, string> = {
  pp_system_default: "Pay on delivery",
  pp_system_manual: "Manual payment",
  pp_stripe_stripe: "Card",
  pp_stripe_ideal: "iDEAL",
};

function providerLabel(providerId: string): string {
  if (PROVIDER_LABELS[providerId]) return PROVIDER_LABELS[providerId];
  return providerId.replace(/^pp_/, "").replace(/_/g, " ");
}

type PaymentMethodStepProps = {
  onContinue: () => void;
};

export function PaymentMethodStep({ onContinue }: PaymentMethodStepProps) {
  const { cart, refreshCart } = useCart();
  const [pendingSelected, setPendingSelected] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const regionId = cart?.region_id ?? "";
  const cartId = cart?.id ?? "";

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["payment-providers", regionId],
    queryFn: async () => {
      if (!regionId) return [];
      const { payment_providers } =
        await sdk.store.payment.listPaymentProviders({ region_id: regionId });
      return payment_providers;
    },
    enabled: Boolean(regionId),
    staleTime: 30 * 1000,
  });

  const currentSession = cart?.payment_collection?.payment_sessions?.[0];
  const selected = pendingSelected ?? currentSession?.provider_id ?? null;

  const handleSelect = async (providerId: string) => {
    if (!cartId || !cart) return;
    setPendingSelected(providerId);
    setError(null);
    setIsSaving(true);
    try {
      await sdk.store.payment.initiatePaymentSession(cart, {
        provider_id: providerId,
      });
      await refreshCart();
    } catch {
      setPendingSelected(null);
      setError("Could not set up that payment method. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p className="text-sm text-stone-500">Loading payment options...</p>
      ) : providers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-sm text-stone-600">
          No payment methods are available yet. Enable a payment provider in the
          Medusa backend to continue.
        </div>
      ) : (
        <div role="radiogroup" aria-label="Payment method" className="space-y-3">
          {providers.map((provider) => {
            const isSelected = selected === provider.id;
            return (
              <button
                key={provider.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(provider.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border bg-white p-4 text-left transition",
                  isSelected
                    ? "border-brand-800 ring-2 ring-brand-800/20"
                    : "border-stone-200 hover:border-brand-300",
                )}
              >
                <CreditCard
                  aria-hidden="true"
                  className={cn(
                    "h-6 w-6 shrink-0",
                    isSelected ? "text-brand-800" : "text-stone-400",
                  )}
                />
                <span className="font-medium text-stone-900">
                  {providerLabel(provider.id)}
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
        disabled={!currentSession || isSaving}
        className="mt-6 w-full sm:w-auto"
      >
        Continue to review
      </Button>
    </div>
  );
}