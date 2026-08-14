import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <RouteStub
      title="Checkout"
      description="Secure checkout — coming in a later phase of the build."
    />
  );
}