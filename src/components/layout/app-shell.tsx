"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SettingsProvider } from "@/lib/settings-context";
import { StoreProvider } from "@/lib/store-context";
import { ToastProvider } from "@/components/ui/toast";
import { DrawerProvider } from "./drawer-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { OnboardingModal } from "./onboarding-modal";

/**
 * 세 가지 Surface 를 하나의 Provider 트리 아래에서 운영한다.
 * - Business AX : 사이드바 + 탑바 (기본)
 * - 고객 플랫폼  : /customer/* — 자체 셸을 쓰므로 관리자 크롬을 붙이지 않는다
 * - 대표 시연    : /presentation — 전체 화면을 쓴다
 *
 * Provider 는 공유하므로 고객 플랫폼에서 만든 요청이 Business AX 에 그대로 보인다.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare =
    pathname?.startsWith("/customer") || pathname?.startsWith("/presentation");

  return (
    <SettingsProvider>
      <StoreProvider>
        <ToastProvider>
          <DrawerProvider>
            {bare ? (
              children
            ) : (
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
            )}
          </DrawerProvider>
        </ToastProvider>
      </StoreProvider>
    </SettingsProvider>
  );
}
