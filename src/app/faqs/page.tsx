import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "FAQs" };

export default function FaqsPage() {
  return (
    <RouteStub
      title="Frequently asked questions"
      description="Answers to common questions — coming in a later phase of the build."
    />
  );
}