"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { useCart } from "@/components/providers/cart-provider";
import type { MedusaProductVariant, StoreProduct } from "@/lib/types";

function firstVariantPrice(variant: MedusaProductVariant) {
  const current = variant.calculated_price?.calculated_amount ?? null;
  const original = variant.calculated_price?.original_amount ?? null;
  const currencyCode = variant.calculated_price?.currency_code ?? "NGN";
  return { current, original, currencyCode };
}

type ProductCardProps = {
  product: StoreProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isMutating } = useCart();
  const [addError, setAddError] = useState(false);

  const variants = product.variants ?? [];
  const singleVariant = variants.length === 1 ? variants[0] : null;
  const outOfStock = singleVariant?.inventory_quantity === 0;

  const { current, original, currencyCode } = singleVariant
    ? firstVariantPrice(singleVariant)
    : { current: null, original: null, currencyCode: "NGN" };

  const discountPct =
    current != null && original != null && original > current
      ? Math.round(((original - current) / original) * 100)
      : null;

  const handleAdd = async () => {
    if (!singleVariant) return;
    const ok = await addItem(singleVariant.id);
    setAddError(!ok);
  };

  const productHref = `/products/${product.handle}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
      <Link
        href={productHref}
        className="relative block aspect-[4/3] overflow-hidden bg-stone-100"
      >
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            loading="lazy"
            unoptimized
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package aria-hidden="true" className="h-12 w-12 text-stone-300" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          {discountPct != null && <Badge variant="sale">{discountPct}% off</Badge>}
          {outOfStock && <Badge variant="out">Out of stock</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href={productHref}
          className="line-clamp-2 min-h-10 text-sm font-medium text-stone-900 transition-colors hover:text-brand-800"
        >
          {product.title}
        </Link>
        {current != null ? (
          <Price
            current={current}
            original={original}
            currencyCode={currencyCode}
            size="sm"
          />
        ) : null}
        <div className="mt-auto pt-2">
          {singleVariant && !outOfStock ? (
            <>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={handleAdd}
                disabled={isMutating}
              >
                <ShoppingCart aria-hidden="true" className="h-4 w-4" />
                Add to cart
              </Button>
              {addError && (
                <p className="mt-2 text-xs text-red-700">
                  Couldn&apos;t add to cart. Please try again.
                </p>
              )}
            </>
          ) : variants.length > 1 ? (
            <Link
              href={productHref}
              className={buttonClasses({ variant: "primary", size: "sm" })}
            >
              View options
            </Link>
          ) : (
            <Button variant="primary" size="sm" className="w-full" disabled>
              Out of stock
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}