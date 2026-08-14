import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <RouteStub
      title="Search products"
      description="Live search across the catalogue — coming in a later phase of the build."
    />
  );
}