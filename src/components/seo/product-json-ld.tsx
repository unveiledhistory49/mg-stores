import { productJsonLd } from "@/lib/seo";
import type { MedusaProduct } from "@/lib/types";

type ProductJsonLdProps = {
  product: MedusaProduct;
};

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
    />
  );
}