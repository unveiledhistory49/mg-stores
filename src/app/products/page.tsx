import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "Shop everything" };

export default function ProductsPage() {
  return (
    <RouteStub
      title="Shop everything"
      description="Browse the full catalogue — coming in a later phase of the build."
    />
  );
}