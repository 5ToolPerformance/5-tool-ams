import { PortalLayoutChrome } from "@/ui/features/client-portal/PortalLayoutChrome";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PortalLayoutChrome>{children}</PortalLayoutChrome>;
}
