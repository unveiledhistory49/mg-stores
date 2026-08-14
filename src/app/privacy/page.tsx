import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <RouteStub
      title="Privacy policy"
      description="How we handle your data — coming in a later phase of the build."
    />
  );
}