import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductListing } from "@/components/product/product-listing";

export const metadata: Metadata = { title: "Shop everything" };

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductListing
        title="Shop everything"
        description="Groceries, household essentials and electronics from MARKSONGLOBAL STORES."
      />
    </Suspense>
  );
}