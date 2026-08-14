import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { CartProvider } from "@/components/providers/cart-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { RegionProvider } from "@/components/providers/region-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--mg-font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sans = Figtree({
  variable: "--mg-font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "MARKSONGLOBAL (MG) STORES | Everything You Need. One Store.",
    template: "%s | MG STORES",
  },
  description:
    "Shop groceries, provisions, household essentials and genuine electronics nationwide in Nigeria — delivered to your door.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <RegionProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </CartProvider>
          </RegionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}