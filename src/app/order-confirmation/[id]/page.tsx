import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { sdk } from "@/lib/sdk";
import { formatMoney } from "@/lib/utils";

type OrderConfirmationPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Order confirmation" };
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { id } = await params;
  let order;
  try {
    const response = await sdk.store.order.retrieve(id, {
      fields: "id,display_id,email,currency_code,total,subtotal,shipping_total,tax_total,discount_total,status,created_at,*shipping_address,*shipping_methods,*items",
    });
    order = response.order;
  } catch {
    notFound();
  }

  const currencyCode = order.currency_code ?? "NGN";
  const address = order.shipping_address;
  const items = order.items ?? [];

  return (
    <Container className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle2 aria-hidden="true" className="h-14 w-14 text-emerald-600" />
          <h1 className="font-display text-3xl font-bold text-brand-950">
            Thank you for your order
          </h1>
          <p className="text-stone-600">
            Order{" "}
            <span className="font-semibold text-brand-950">
              #{order.display_id ?? id.slice(-8)}
            </span>{" "}
            has been placed. We&apos;ve emailed your confirmation to{" "}
            <span className="font-medium text-stone-900">{order.email}</span>.
          </p>
        </div>

        <div className="mt-10 rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-brand-950">
            Order summary
          </h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4">
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
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-stone-200 pt-4 text-sm">
            <div className="flex justify-between text-stone-600">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">
                {order.subtotal != null ? formatMoney(order.subtotal, currencyCode) : "—"}
              </dd>
            </div>
            {order.discount_total != null && order.discount_total > 0 && (
              <div className="flex justify-between text-emerald-700">
                <dt>Discount</dt>
                <dd className="tabular-nums">
                  −{formatMoney(order.discount_total, currencyCode)}
                </dd>
              </div>
            )}
            {order.shipping_total != null && (
              <div className="flex justify-between text-stone-600">
                <dt>Delivery</dt>
                <dd className="tabular-nums">
                  {formatMoney(order.shipping_total, currencyCode)}
                </dd>
              </div>
            )}
            {order.tax_total != null && order.tax_total > 0 && (
              <div className="flex justify-between text-stone-600">
                <dt>Tax</dt>
                <dd className="tabular-nums">
                  {formatMoney(order.tax_total, currencyCode)}
                </dd>
              </div>
            )}
            <div className="flex justify-between border-t border-stone-200 pt-3">
              <dt className="font-medium text-stone-900">Total</dt>
              <dd className="text-lg font-bold tabular-nums text-brand-950">
                {order.total != null ? formatMoney(order.total, currencyCode) : "—"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
              Delivery address
            </h3>
            <p className="mt-3 text-sm text-stone-800">
              {address
                ? [
                    address.first_name,
                    address.last_name,
                    address.address_1,
                    address.address_2,
                    address.city,
                    address.province,
                    address.postal_code,
                  ]
                    .filter(Boolean)
                    .join(", ")
                : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
              Status
            </h3>
            <p className="mt-3 text-sm capitalize text-stone-800">{order.status}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            href="/products"
            className={buttonClasses({ variant: "gold", size: "lg" })}
          >
            Continue shopping
          </Link>
          <p className="text-xs text-stone-500">
            Track your order anytime from the Track order page.
          </p>
        </div>
      </div>
    </Container>
  );
}