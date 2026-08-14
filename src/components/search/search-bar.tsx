"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

type SearchBarProps = {
  variant?: "header" | "overlay";
  open?: boolean;
  onClose?: () => void;
  className?: string;
};

export function SearchBar({
  variant = "header",
  open = false,
  onClose,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const mounted = useMounted();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (variant !== "overlay" || !open || !mounted) return;
    inputRef.current?.focus();
  }, [variant, open, mounted]);

  useEffect(() => {
    if (variant !== "overlay" || !open || !mounted) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [variant, open, mounted, onClose]);

  useEffect(() => {
    if (variant !== "overlay" || !open || !mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [variant, open, mounted]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    onClose?.();
  };

  if (variant === "overlay") {
    if (!mounted || !open) return null;
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-white",
          className,
        )}
      >
        <form
          role="search"
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-b border-stone-200 px-4 py-4"
        >
          <div className="relative w-full">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
            />
            <Input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              autoComplete="off"
              className="pl-12 pr-14 [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-stone-500 transition-colors hover:text-brand-800 focus-visible:outline-2"
            >
              <Search aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-2"
          >
            <X aria-hidden="true" className="h-6 w-6" />
          </button>
        </form>
        <p className="px-6 pt-3 text-sm text-stone-500">
          Search products by name — results appear on the search page.
        </p>
      </div>
    );
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("hidden md:block", className)}
    >
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products"
          aria-label="Search products"
          autoComplete="off"
          className="h-11 w-48 rounded-lg border border-stone-300 bg-white pl-10 pr-12 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20 [&::-webkit-search-cancel-button]:hidden md:w-64"
        />
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-lg text-stone-500 transition-colors hover:text-brand-800 focus-visible:outline-2"
        >
          <Search aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}