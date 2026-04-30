import type { Metadata } from "next";

import { Toaster } from "sonner";

import Providers from "@/ui/core/layout/Providers";
import { PortalLayoutChrome } from "@/ui/features/client-portal/PortalLayoutChrome";

import "./globals.css";

export const metadata: Metadata = {
  title: "5 Tool Performance Portal",
  description: "Client portal for 5 Tool Performance",
};

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚾</text></svg>"
        />
      </head>
      <body className="min-h-screen w-screen">
        <Providers>
          <PortalLayoutChrome>{children}</PortalLayoutChrome>
          <Toaster richColors position="bottom-right" closeButton />
        </Providers>
      </body>
    </html>
  );
}
