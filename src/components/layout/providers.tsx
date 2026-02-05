"use client";

import { useRouter } from "next/navigation";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { AttachmentViewerProvider } from "@/ui/features/attachments/AttachmentViewerProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <SessionProvider>
      <HeroUIProvider
        navigate={router.push}
        className="flex h-full w-full flex-col"
      >
        <NextThemesProvider attribute="class">
          <AttachmentViewerProvider>{children}</AttachmentViewerProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
}
