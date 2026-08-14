"use client";

import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { DeliverySection } from "@/components/home/delivery-section";
import { WhyShop } from "@/components/home/why-shop";
import { CategoryGrid, CategoryGridSkeleton } from "@/components/home/category-grid";
import { ProductRow, ProductRowSkeleton } from "@/components/home/product-row";
import { useRegion } from "@/components/providers/region-provider";
import { sdk } from "@/lib/sdk";

const PRODUCT_FIELDS =
  "id,title,handle,thumbnail,description,created_at,variants.id,variants.title,variants.sku,variants.inventory_quantity,variants.calculated_price";

export function HomeContent() {
  const { region } = useRegion();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { product_categories } = await sdk.store.category.list({
        include_descendants_tree: true,
        limit: 100,
      });
      return product_categories;
    },
    staleTime: 10 * 60 * 1000,
  });

  const productsQuery = useQuery({
    queryKey: ["products", "featured", region?.id ?? "none"],
    queryFn: async () => {
      const { products } = await sdk.store.product.list({
        limit: 8,
        fields: PRODUCT_FIELDS,
        region_id: region?.id,
      });
      return products;
    },
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoriesQuery.data ?? [];
  const products = productsQuery.data ?? [];

  return (
    <>
      <Hero />
      <ValueProps />

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {categoriesQuery.isLoading ? (
            <CategoryGridSkeleton />
          ) : (
            <CategoryGrid categories={categories} />
          )}
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {productsQuery.isLoading ? (
            <ProductRowSkeleton columns={4} />
          ) : (
            <ProductRow
              eyebrow="Popular right now"
              title="Popular products"
              description="Everyday essentials and more, from our shelves to your door."
              products={products}
              viewAllHref="/products"
            />
          )}
        </div>
      </section>

      <DeliverySection />
      <WhyShop />
    </>
  );
}