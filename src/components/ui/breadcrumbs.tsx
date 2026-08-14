import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/seo";

type BreadcrumbItem = {
  name: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [{ name: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1 text-sm text-stone-500">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li
              key={`${item.name}-${index}`}
              className="flex items-center gap-1"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex h-8 items-center gap-1 rounded-md px-1 text-stone-500 transition-colors hover:text-brand-800"
                >
                  {index === 0 && (
                    <Home aria-hidden="true" className="h-4 w-4" />
                  )}
                  {item.name}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "flex h-8 items-center rounded-md px-1",
                    isLast
                      ? "font-medium text-brand-900"
                      : "text-stone-500",
                  )}
                >
                  {index === 0 && (
                    <Home aria-hidden="true" className="h-4 w-4" />
                  )}
                  {item.name}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  aria-hidden="true"
                  className="h-4 w-4 text-stone-300"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}