import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { ProductListing } from "@/components/product/product-listing";
import { sdk } from "@/lib/sdk";
import type { StoreProductCategory } from "@/lib/types";

type CategoryPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { handle } = await params;
  const category = await resolveCategory(handle);
  return {
    title: category?.name ?? "Category",
    description: category?.description ?? undefined,
  };
}

async function resolveCategory(
  handle: string,
): Promise<StoreProductCategory | null> {
  const { product_categories } = await sdk.store.category.list({
    handle: [handle],
    include_ancestors_tree: true,
    include_descendants_tree: true,
    limit: 1,
  });
  return product_categories[0] ?? null;
}

function buildBreadcrumbItems(category: StoreProductCategory) {
  const items: { name: string; href?: string }[] = [];
  const chain: StoreProductCategory[] = [];
  let current: StoreProductCategory | null = category;
  while (current) {
    chain.unshift(current);
    current = current.parent_category ?? null;
  }
  for (const node of chain) {
    items.push({
      name: node.name,
      href:
        node.handle === category.handle
          ? undefined
          : `/categories/${node.handle}`,
    });
  }
  return items;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { handle } = await params;
  const category = await resolveCategory(handle);
  if (!category) notFound();

  return (
    <Container className="pt-8">
      <Breadcrumbs items={buildBreadcrumbItems(category)} />
      <Suspense>
        <ProductListing
          title={category.name}
          description={category.description ?? undefined}
          categoryId={category.id}
        />
      </Suspense>
    </Container>
  );
}