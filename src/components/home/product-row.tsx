import type { StoreProduct } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product/product-card";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import { buttonClasses } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";

type ProductRowProps = {
  eyebrow: string;
  title: string;
  description?: string;
  products: StoreProduct[];
  viewAllHref?: string;
  columns?: 3 | 4;
};

export function ProductRow({
  eyebrow,
  title,
  description,
  products,
  viewAllHref,
  columns = 4,
}: ProductRowProps) {
  const action = viewAllHref ? (
    <a
      href={viewAllHref}
      className={buttonClasses({ variant: "outline", size: "sm" })}
    >
      View all
    </a>
  ) : undefined;

  return (
    <section>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={action}
      />
      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-200 bg-cream px-6 py-14 text-center">
          <p className="font-display text-lg font-medium text-brand-900">
            Products are on their way. Check back soon.
          </p>
        </div>
      ) : (
        <ul
          className={cn(
            "grid grid-cols-2 gap-4 sm:gap-6",
            columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
          )}
        >
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

type ProductRowSkeletonProps = {
  columns?: 3 | 4;
};

export function ProductRowSkeleton({ columns = 4 }: ProductRowSkeletonProps) {
  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <Skeleton className="mb-2 h-3 w-24" />
          <Skeleton className="h-8 w-56 sm:h-9 sm:w-72" />
          <Skeleton className="mt-3 h-4 w-full max-w-md" />
        </div>
        <div className="shrink-0">
          <Skeleton className="h-11 w-32" />
        </div>
      </div>
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:gap-6",
          columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
        )}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}