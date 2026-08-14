import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductJsonLd } from "@/components/seo/product-json-ld";
import { sdk } from "@/lib/sdk";
import type { MedusaProduct, StoreProductCategory } from "@/lib/types";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

const PRODUCT_FIELDS =
  "id,title,handle,thumbnail,description,created_at,images.url," +
  "categories.id,categories.handle,categories.name,categories.parent_category.id,categories.parent_category.handle,categories.parent_category.name," +
  "options.id,options.title,variants.id,variants.title,variants.sku,variants.inventory_quantity,variants.calculated_price,variants.options.id,variants.options.value,variants.options.option.id";

async function resolveProduct(handle: string): Promise<MedusaProduct | null> {
  const { products } = await sdk.store.product.list({
    handle: [handle],
    limit: 1,
    fields: PRODUCT_FIELDS,
  });
  return products[0] ?? null;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await resolveProduct(handle);
  if (!product) return {};
  const price = product.variants?.[0]?.calculated_price?.calculated_amount;
  return {
    title: product.title,
    description: product.description ?? undefined,
    ...(product.thumbnail
      ? {
          openGraph: {
            title: product.title,
            description: product.description ?? undefined,
            images: [product.thumbnail],
          },
        }
      : {}),
    ...(price != null
      ? {
          keywords: [product.title],
        }
      : {}),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await resolveProduct(handle);
  if (!product) notFound();

  const category = product.categories?.[0];
  const breadcrumbItems: { name: string; href?: string }[] = [
    { name: "Shop", href: "/products" },
  ];
  if (category) {
    const parents: { name: string; href: string }[] = [];
    let current: StoreProductCategory | null = category;
    while (current) {
      parents.unshift({
        name: current.name,
        href: `/categories/${current.handle}`,
      });
      current = current.parent_category ?? null;
    }
    breadcrumbItems.push(...parents);
  }
  breadcrumbItems.push({ name: product.title });

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={breadcrumbItems} className="mb-8" />
      <ProductDetail product={product} />
      <ProductJsonLd product={product} />
    </Container>
  );
}