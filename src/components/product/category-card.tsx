import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  CupSoda,
  Home,
  PlugZap,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Tag,
  Wheat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StoreProductCategory } from "@/lib/types";

const categoryIcons: Record<string, LucideIcon> = {
  groceries: ShoppingBasket,
  phones: Smartphone,
  electronics: Cpu,
  drinks: CupSoda,
  "personal care": Sparkles,
  home: Home,
  food: Wheat,
  electrical: PlugZap,
};

const defaultCategoryIcon: LucideIcon = Tag;

function categoryIconFor(name: string) {
  const key = name.trim().toLowerCase();
  const Icon = categoryIcons[key] ?? defaultCategoryIcon;
  return (
    <Icon
      aria-hidden="true"
      className="pointer-events-none absolute -right-4 -top-4 h-40 w-40 text-white/10 transition duration-300 group-hover:scale-105 group-hover:text-white/15"
    />
  );
}

type CategoryCardProps = {
  category: StoreProductCategory;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const productCount = category.products?.length;

  return (
    <Link
      href={`/categories/${category.handle}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl border border-stone-200 bg-linear-to-br from-brand-900 to-brand-800 p-6 transition duration-300 hover:-translate-y-1 hover:border-gold-400 hover:shadow-lg"
    >
      {categoryIconFor(category.name)}
      <p className="font-display text-2xl font-semibold text-white">
        {category.name}
      </p>
      {productCount !== undefined ? (
        <p className="mt-1 text-sm text-brand-100">
          {productCount === 1 ? "1 product" : `${productCount} products`}
        </p>
      ) : null}
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
        Shop now
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}