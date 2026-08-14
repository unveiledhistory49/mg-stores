import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductListing } from "@/components/product/product-listing";

export const metadata: Metadata = { title: "Search" };

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  return (
    <Suspense>
      <ProductListing
        title={q ? `Results for "${q}"` : "Search products"}
        description={
          q
            ? undefined
            : "Type a keyword above to search the catalogue."
        }
        searchQuery={q}
      />
    </Suspense>
  );
}