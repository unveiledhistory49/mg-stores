import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <RouteStub
      title="About MARKSONGLOBAL STORES"
      description="Our story — coming in a later phase of the build."
    />
  );
}