import { Skeleton } from "@/components/ui/skeleton";

export function CategoryCardSkeleton() {
  return (
    <div className="relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl border border-stone-200 bg-linear-to-br from-brand-50 to-brand-100 p-6">
      <Skeleton className="absolute -right-4 -top-4 h-40 w-40 rounded-full bg-white/50" />
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/3" />
      <Skeleton className="mt-6 h-4 w-24" />
    </div>
  );
}