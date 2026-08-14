import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "Deals" };

export default function DealsPage() {
  return (
    <RouteStub
      title="Today's deals"
      description="Hot deals and promotions — coming in a later phase of the build."
    />
  );
}