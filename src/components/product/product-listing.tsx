"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import { Container } from "@/components/ui/container";
import { useRegion } from "@/components/providers/region-provider";
import { sdk } from "@/lib/sdk";
import { cn } from "@/lib/utils";

const PRODUCT_FIELDS =
  "id,title,handle,thumbnail,description,created_at,variants.id,variants.title,variants.sku,variants.inventory_quantity,variants.calculated_price";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function orderParam(sort: SortValue): string | undefined {
  return sort === "newest" ? "-created_at" : undefined;
}

type ProductListingProps = {
  title: string;
  description?: string;
  categoryId?: string;
  searchQuery?: string;
};

export function ProductListing({
  title,
  description,
  categoryId,
  searchQuery,
}: ProductListingProps) {
  const { region } = useRegion();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlSort = searchParams.get("sort");
  const sort: SortValue =
    urlSort === "newest" || urlSort === "featured" ? urlSort : "featured";
  const [limit, setLimit] = useState(PAGE_SIZE);

  const setSort = (value: SortValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  };

  const query = useQuery({
    queryKey: [
      "products",
      "listing",
      categoryId ?? "all",
      searchQuery ?? "",
      sort,
      limit,
      region?.id ?? "none",
    ],
    queryFn: async () => {
      const { products, count } = await sdk.store.product.list({
        limit,
        offset: 0,
        order: orderParam(sort),
        category_id: categoryId,
        q: searchQuery,
        fields: PRODUCT_FIELDS,
        region_id: region?.id,
      });
      return { products, count };
    },
    staleTime: 5 * 60 * 1000,
  });

  const products = query.data?.products ?? [];
  const count = query.data?.count ?? 0;
  const hasMore = products.length < count;

  const resetSortAndLimit = () => {
    setSort("featured");
    setLimit(PAGE_SIZE);
  };

  return (
    <Container className="py-12 md:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-stone-600">{description}</p>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-stone-600">
          <span className="shrink-0">Sort</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortValue)}
            className="h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {query.isLoading ? (
        <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <li key={index}>
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-200 bg-cream px-6 py-16 text-center">
          <SearchX aria-hidden="true" className="mx-auto h-12 w-12 text-stone-300" />
          <h2 className="mt-4 font-display text-xl font-semibold text-brand-900">
            No products found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-stone-600">
            {searchQuery
              ? `Nothing matched "${searchQuery}". Try a different keyword.`
              : "Try removing filters or check back soon."}
          </p>
          {searchQuery && (
            <Link
              href="/products"
              className="mt-6 inline-flex h-12 items-center rounded-lg bg-brand-800 px-6 font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Browse all products
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-stone-500">
            Showing {products.length} of {count} products
          </p>
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setLimit(limit + PAGE_SIZE)}
                disabled={query.isFetching}
                className="h-12 rounded-lg border border-brand-800 px-8 font-semibold text-brand-800 transition-colors hover:bg-brand-50 disabled:opacity-60"
              >
                {query.isFetching ? "Loading..." : "Load more products"}
              </button>
            </div>
          )}
        </>
      )}

      {query.error && (
        <div className={cn("mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700")}>
          Could not load products. Check the Medusa backend connection.
          <button
            type="button"
            onClick={resetSortAndLimit}
            className="ml-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}
    </Container>
  );
}