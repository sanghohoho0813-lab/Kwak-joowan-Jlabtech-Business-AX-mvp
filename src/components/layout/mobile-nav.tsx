"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Boxes,
  Sparkles,
  RefreshCcw,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { useDrawer } from "./drawer-context";

const tabs: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "홈", icon: LayoutDashboard },
  { href: "/inventory", label: "재고", icon: Boxes },
  { href: "/recommend", label: "AI 추천", icon: Sparkles },
  { href: "/repurchase", label: "재구매", icon: RefreshCcw },
];

export function MobileNav() {
  const pathname = usePathname();
  const { setOpen } = useDrawer();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="mx-auto grid h-16 max-w-md grid-cols-5">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                active ? "text-pine-700" : "text-inkmuted hover:text-pine-700",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-10 items-center justify-center rounded-full transition-colors",
                  active && "bg-pine-50",
                )}
              >
                <Icon size={17} strokeWidth={active ? 2.2 : 1.75} />
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-[0.5625rem] leading-none",
                  active ? "font-bold" : "font-medium",
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* 전체 메뉴 — 확장 모듈 전체에 접근 */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-inkmuted transition-colors hover:text-pine-700"
        >
          <span className="flex h-7 w-10 items-center justify-center rounded-full">
            <LayoutGrid size={17} strokeWidth={1.75} />
          </span>
          <span className="whitespace-nowrap text-[0.5625rem] font-medium leading-none">
            전체 메뉴
          </span>
        </button>
      </div>
    </nav>
  );
}
