"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Minus, PackageCheck, Plus, ShieldCheck, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { useCart } from "@/components/providers/cart-provider";
import { useRegion } from "@/components/providers/region-provider";
import { ProductCard } from "@/components/product/product-card";
import { sdk } from "@/lib/sdk";
import { cn } from "@/lib/utils";
import type { MedusaProductVariant, StoreProduct } from "@/lib/types";

const RELATED_FIELDS =
  "id,title,handle,thumbnail,description,created_at,variants.id,variants.title,variants.sku,variants.inventory_quantity,variants.calculated_price";

type ProductDetailProps = {
  product: StoreProduct;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, isMutating } = useCart();
  const { region } = useRegion();
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {},
  );
  const [quantity, setQuantity] = useState(1);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const options = useMemo(() => product.options ?? [], [product]);
  const variants = useMemo(() => product.variants ?? [], [product]);
  const images = product.images?.filter((image) => image.url) ?? [];
  const gallery = images.length > 0 ? images : [];
  const [activeImage, setActiveImage] = useState(0);

  const availableValues = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const option of options) {
      map[option.id] = new Set();
    }
    for (const variant of variants) {
      for (const value of variant.options ?? []) {
        if (value.option?.id && map[value.option.id]) {
          map[value.option.id].add(value.value);
        }
      }
    }
    return map;
  }, [options, variants]);

  const selectedVariant = useMemo<MedusaProductVariant | null>(() => {
    if (options.length === 0) {
      return variants[0] ?? null;
    }
    return (
      variants.find((variant) =>
        (variant.options ?? []).every(
          (value) =>
            selectedValues[value.option?.id ?? ""] === value.value,
        ),
      ) ?? null
    );
  }, [options, variants, selectedValues]);

  const allSelected = options.every(
    (option) => selectedValues[option.id],
  );

  const current =
    selectedVariant?.calculated_price?.calculated_amount ?? null;
  const original =
    selectedVariant?.calculated_price?.original_amount ?? null;
  const currencyCode =
    selectedVariant?.calculated_price?.currency_code ?? "NGN";
  const discountPct =
    current != null && original != null && original > current
      ? Math.round(((original - current) / original) * 100)
      : null;

  const outOfStock =
    selectedVariant != null && selectedVariant.inventory_quantity === 0;
  const canAdd = Boolean(selectedVariant) && !outOfStock;

  const categoryId = product.categories?.[0]?.id;

  const related = useQuery({
    queryKey: ["products", "related", categoryId ?? "none", product.id],
    queryFn: async () => {
      if (!categoryId) return { products: [] as StoreProduct[] };
      const { products } = await sdk.store.product.list({
        limit: 4,
        category_id: categoryId,
        fields: RELATED_FIELDS,
        region_id: region?.id,
      });
      return { products };
    },
    enabled: Boolean(categoryId),
    staleTime: 5 * 60 * 1000,
  });
  const relatedProducts = (related.data?.products ?? []).filter(
    (item) => item.id !== product.id,
  );

  const selectValue = (optionId: string, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [optionId]: value }));
    setAddError(null);
  };

  const handleAdd = async () => {
    if (!selectedVariant) return;
    const ok = await addItem(selectedVariant.id, quantity);
    if (ok) {
      setAddSuccess(true);
      setAddError(null);
      window.setTimeout(() => setAddSuccess(false), 2000);
    } else {
      setAddError("Could not add this item to your cart. Please try again.");
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div>
        {gallery.length > 0 ? (
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
              <Image
                src={gallery[activeImage]?.url ?? product.thumbnail ?? ""}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={image.url}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={cn(
                      "relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-stone-100 transition",
                      index === activeImage
                        ? "border-brand-800"
                        : "border-transparent hover:border-stone-300",
                    )}
                  >
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : product.thumbnail ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 text-stone-400">
            No image available
          </div>
        )}
      </div>

      <div>
        <h1 className="font-display text-3xl font-bold text-brand-950">
          {product.title}
        </h1>

        <div className="mt-4 flex items-baseline gap-3">
          {current != null ? (
            <>
              <Price
                current={current}
                original={original}
                currencyCode={currencyCode}
                size="lg"
                className="font-display text-3xl font-bold text-brand-900"
              />
              {discountPct && (
                <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">
                  {discountPct}% off
                </span>
              )}
            </>
          ) : (
            <span className="text-stone-500">
              Select a variant to see the price
            </span>
          )}
        </div>

        {options.map((option) => {
          const values = [...(availableValues[option.id] ?? [])];
          return (
            <fieldset key={option.id} className="mt-6">
              <legend className="mb-2 text-sm font-medium text-stone-700">
                {option.title}
              </legend>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const selected = selectedValues[option.id] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => selectValue(option.id, value)}
                      aria-pressed={selected}
                      className={cn(
                        "h-10 rounded-lg border px-4 text-sm font-medium transition",
                        selected
                          ? "border-brand-800 bg-brand-800 text-white"
                          : "border-stone-300 bg-white text-stone-700 hover:border-brand-300",
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-stone-300">
              <button
                type="button"
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
                aria-label="Decrease quantity"
                className="flex h-12 w-12 items-center justify-center text-stone-600 transition hover:bg-stone-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                aria-label="Increase quantity"
                className="flex h-12 w-12 items-center justify-center text-stone-600 transition hover:bg-stone-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={handleAdd}
              disabled={!canAdd || isMutating}
              className="h-12 flex-1"
            >
              {addSuccess ? (
                <span className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4" /> Added
                </span>
              ) : outOfStock ? (
                "Out of stock"
              ) : options.length > 0 && !allSelected ? (
                "Select options"
              ) : (
                "Add to cart"
              )}
            </Button>
          </div>

          {addError && (
            <p className="text-sm text-red-600" role="alert">
              {addError}
            </p>
          )}
          {outOfStock && (
            <p className="text-sm text-red-600" role="alert">
              This option is currently out of stock.
            </p>
          )}
        </div>

        <div className="mt-8 space-y-3 rounded-xl border border-stone-200 bg-cream p-5 text-sm text-stone-700">
          <p className="flex items-center gap-3">
            <Truck className="h-5 w-5 shrink-0 text-brand-700" />
            Nationwide delivery across Nigeria
          </p>
          <p className="flex items-center gap-3">
            <PackageCheck className="h-5 w-5 shrink-0 text-brand-700" />
            Hassle-free returns within 14 days
          </p>
          <p className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-brand-700" />
            Authentic products, guaranteed
          </p>
        </div>

        {product.description && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-brand-900">
              Product details
            </h2>
            <p className="mt-2 whitespace-pre-line text-stone-700">
              {product.description}
            </p>
          </div>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-brand-950">
              You may also like
            </h2>
            <Link
              href={
                product.categories?.[0]
                  ? `/categories/${product.categories[0].handle}`
                  : "/products"
              }
              className="text-sm font-semibold text-brand-800 hover:text-brand-700"
            >
              View all
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}