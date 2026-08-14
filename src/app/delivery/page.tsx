import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "Delivery information" };

export default function DeliveryPage() {
  return (
    <RouteStub
      title="Delivery information"
      description="Delivery timelines and fees across Nigeria — coming in a later phase of the build."
    />
  );
}