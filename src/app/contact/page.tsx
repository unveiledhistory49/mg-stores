import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <RouteStub
      title="Contact us"
      description="Reach our customer service team — coming in a later phase of the build."
    />
  );
}