import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
  title: "AMS API",
  description: "Standalone API surface for the AMS monorepo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
