"use client";

import type { ReactNode } from "react";
import { SettingsProvider } from "@/lib/settings-context";
import { StoreProvider } from "@/lib/store-context";
import { ToastProvider } from "@/components/ui/toast";
import { DrawerProvider } from "./drawer-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { OnboardingModal } from "./onboarding-modal";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <StoreProvider>
        <ToastProvider>
          <DrawerProvider>
            <div className="min-h-dvh">
              <Sidebar />
              <div className="lg:pl-64">
                <Topbar />
                <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-5 md:px-6 md:pt-6 lg:pb-10">
                  {children}
                </main>
              </div>
              <MobileNav />
              <OnboardingModal />
            </div>
          </DrawerProvider>
        </ToastProvider>
      </StoreProvider>
    </SettingsProvider>
  );
}
