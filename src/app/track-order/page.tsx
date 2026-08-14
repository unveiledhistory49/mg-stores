import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "Track order" };

export default function TrackOrderPage() {
  return (
    <RouteStub
      title="Track your order"
      description="Follow your delivery in real time — coming in a later phase of the build."
    />
  );
}