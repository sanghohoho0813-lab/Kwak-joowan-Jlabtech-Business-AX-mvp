"use client";

/**
 * 고객 플랫폼 셸.
 *
 * Business AX(내부 관리 화면)와 같은 브랜드를 쓰되, 정보 밀도를 크게 낮추고
 * 모바일을 우선한다. 좌측 관리자 사이드바를 복제하지 않는다.
 */

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench, Inbox, Ruler, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { demoCustomer } from "@/data/mock/customer-portal";
import { DataChip } from "@/components/ui/status-chip";

const nav = [
  { href: "/customer", label: "홈", icon: Home },
  { href: "/customer/equipment", label: "내 장비", icon: Wrench },
  { href: "/customer/requests", label: "요청 내역", icon: Inbox },
];

export function CustomerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-ivory-300">
      {/* 상단 */}
      <header className="sticky top-0 z-30 border-b border-line bg-ivory-50/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4 md:px-6">
          <Link href="/customer" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pine-900 text-sand-400">
              <Ruler size={18} strokeWidth={1.9} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold leading-tight text-pine-900">
                제이랩테크 고객 플랫폼
              </span>
              <span className="block truncate text-2xs leading-tight text-inkmuted">
                {demoCustomer.company}
              </span>
            </span>
          </Link>

          {/* PC 내비 */}
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = pathname === n.href;
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition-colors duration-fast",
                    active
                      ? "bg-pine-700 text-white"
                      : "text-inkmuted hover:bg-pine-50 hover:text-pine-700",
                  )}
                >
                  <Icon size={16} strokeWidth={1.9} />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-3">
            <DataChip />
            {/* Demo 목적의 Surface Switcher */}
            <Link
              href="/"
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-line bg-ivory-50 px-2.5 text-xs font-semibold text-inkbody transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50 hover:text-pine-700"
              title="내부 관리 화면(Business AX)으로 이동 — 시연용"
            >
              <LayoutDashboard size={15} strokeWidth={1.9} />
              <span className="hidden whitespace-nowrap lg:inline">관리자 화면</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 md:px-6 md:pb-12">
        {children}
      </main>

      {/* 모바일 하단 내비 — 3개로 최소화 */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <div className="mx-auto grid h-16 max-w-md grid-cols-3">
          {nav.map((n) => {
            const active = pathname === n.href;
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-colors duration-fast",
                  active ? "text-pine-700" : "text-inkmuted",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-11 items-center justify-center rounded-full transition-colors duration-fast",
                    active && "bg-pine-50",
                  )}
                >
                  <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-2xs leading-none",
                    active ? "font-bold" : "font-medium",
                  )}
                >
                  {n.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
