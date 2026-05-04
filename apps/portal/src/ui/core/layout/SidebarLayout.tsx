"use client";

import React, { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { Button } from "@heroui/react";
import { IconMenu2 } from "@tabler/icons-react";

import { Sidebar } from "@/ui/core/layout/Sidebar";
import { UniversalBackButton } from "@/ui/core/layout/UniversalBackButton";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isDevelopmentReportRoute = pathname.startsWith("/reports/development/");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isDevelopmentReportRoute) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex flex-1 flex-col lg:ml-0">
        <header className="flex items-center justify-between border-b border-divider bg-background p-4 lg:hidden">
          <Button isIconOnly variant="ghost" size="sm" onPress={toggleSidebar}>
            <IconMenu2 size={20} />
          </Button>
          <h1 className="font-semibold text-foreground">5 Tool Performance</h1>
          <div className="w-8" />
        </header>

        <main className="flex-1 overflow-auto bg-[url(/light-bg.svg)] bg-cover bg-repeat dark:bg-[url(/dark-bg.svg)]">
          <div className="p-6">
            <div className="mb-4">
              <UniversalBackButton />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
