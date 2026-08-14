import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "Returns & refunds" };

export default function ReturnsPage() {
  return (
    <RouteStub
      title="Returns & refunds"
      description="How returns and refunds work — coming in a later phase of the build."
    />
  );
}