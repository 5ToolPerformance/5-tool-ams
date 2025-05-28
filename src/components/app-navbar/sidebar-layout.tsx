"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@heroui/react";
import { IconMenu2 } from "@tabler/icons-react";

import Sidebar from "./sidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
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

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:ml-0">
        {/* Mobile header with menu toggle */}
        <header className="flex items-center justify-between border-b border-divider bg-background p-4 lg:hidden">
          <Button isIconOnly variant="ghost" size="sm" onPress={toggleSidebar}>
            <IconMenu2 size={20} />
          </Button>
          <h1 className="font-semibold text-foreground">5 Tool Performance</h1>
          <div className="w-8" /> {/* Spacer for centering */}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-[url(/light-bg.svg)] bg-cover bg-repeat dark:bg-[url(/dark-bg.svg)]">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
