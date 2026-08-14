import type { StoreProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CategoryCard } from "@/components/product/category-card";
import { CategoryCardSkeleton } from "@/components/product/category-card-skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";

type CategoryGridProps = {
  categories: StoreProductCategory[];
  title?: string;
  eyebrow?: string;
};

export function CategoryGrid({
  categories,
  title = "Find everything you need",
  eyebrow = "Shop by category",
}: CategoryGridProps) {
  const gridClassName = cn(
    "grid gap-4 sm:gap-6",
    categories.length === 1 && "grid-cols-1",
    (categories.length === 2 || categories.length === 4) && "grid-cols-2",
    categories.length === 3 && "grid-cols-2 md:grid-cols-3",
    categories.length > 4 && "grid-cols-2 lg:grid-cols-4",
  );

  return (
    <section>
      <SectionHeader eyebrow={eyebrow} title={title} />
      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-200 bg-cream px-6 py-14 text-center">
          <p className="font-display text-lg font-medium text-brand-900">
            Categories are being set up. Check back soon.
          </p>
        </div>
      ) : (
        <ul className={gridClassName}>
          {categories.map((category) => (
            <li key={category.id}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function CategoryGridSkeleton() {
  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <Skeleton className="mb-2 h-3 w-24" />
          <Skeleton className="h-8 w-56 sm:h-9 sm:w-72" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}