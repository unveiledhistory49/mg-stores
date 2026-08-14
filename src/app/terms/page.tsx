import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <RouteStub
      title="Terms of service"
      description="The terms that apply to your orders — coming in a later phase of the build."
    />
  );
}