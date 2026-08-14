import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = { title: "Your account" };

export default function AccountPage() {
  return (
    <RouteStub
      title="Your account"
      description="Sign in, order history and addresses — coming in a later phase of the build."
    />
  );
}