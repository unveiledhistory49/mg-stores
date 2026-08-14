import type {
  MedusaProduct,
  MedusaProductCategory,
} from "@/lib/types";

export const siteName = "MARKSONGLOBAL (MG) STORES";

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:8000";
}

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function productJsonLd(product: MedusaProduct): Record<string, unknown> {
  const variant = product.variants?.[0];
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    url: absoluteUrl(`/products/${product.handle}`),
  };
  const price = variant?.calculated_price?.calculated_amount;
  if (price != null) {
    offer.priceCurrency = variant?.calculated_price?.currency_code ?? "NGN";
    offer.price = price;
  }
  if (variant?.inventory_quantity === 0) {
    offer.availability = "https://schema.org/OutOfStock";
  } else {
    offer.availability = "https://schema.org/InStock";
  }

  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? product.title,
    brand: { "@type": "Brand", name: siteName },
    offers: offer,
  };
  if (product.thumbnail) {
    json.image = [product.thumbnail];
  }
  if (variant?.sku) {
    json.sku = variant.sku;
  }
  return json;
}

export function categoryJsonLd(
  category: MedusaProductCategory,
): Record<string, unknown> {
  const children = category.category_children ?? [];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.name,
    itemListElement: children.map((child, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: child.name,
      url: absoluteUrl(`/categories/${child.handle}`),
    })),
  };
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl(),
  };
}