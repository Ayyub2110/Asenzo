"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import DemoReadOnlyBanner from "@/components/layout/DemoReadOnlyBanner";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto hide-scrollbar bg-background relative flex flex-col min-w-0">
        <DemoReadOnlyBanner />
        <Topbar />
        {children}
      </main>
    </div>
  );
}
