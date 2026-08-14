import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <RouteStub
      title="Your cart"
      description="Review your items and head to checkout — coming in a later phase of the build."
    />
  );
}