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
      <body>
        <Providers>
          <PortalLayoutChrome>{children}</PortalLayoutChrome>
          <Toaster richColors position="bottom-right" closeButton />
        </Providers>
      </body>
    </html>
  );
}
