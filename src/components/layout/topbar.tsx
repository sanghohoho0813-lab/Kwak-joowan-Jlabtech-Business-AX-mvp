"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, Menu, X, CalendarDays } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { pageTitles } from "./nav-config";
import { SidebarContent } from "./sidebar";

export function Topbar() {
  const pathname = usePathname();
  const { notifications } = useSettings();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const title = pageTitles[pathname] ?? "JLAB TECH AX";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-ivory-300/85 px-4 backdrop-blur-md md:h-16 md:px-6">
        {/* 모바일 메뉴 버튼 */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-ivory-50 text-pine-800 transition-colors hover:bg-pine-50 lg:hidden"
          aria-label="메뉴 열기"
        >
          <Menu className="h-4.5 w-4.5" size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="clamp-1 text-sm font-bold text-pine-900 md:text-base">
            {title}
          </h2>
          <p className="hidden truncate text-2xs text-inkmuted md:block">
            JLAB TECH AX 플랫폼 — 데이터 기반 운영 인사이트
          </p>
        </div>

        {/* 기준일 */}
        <div className="hidden h-9 shrink-0 items-center gap-2 rounded-xl border border-line bg-ivory-50 px-3 text-xs font-medium text-inkbody sm:flex">
          <CalendarDays className="h-3.5 w-3.5 text-pine-700" />
          <span className="num whitespace-nowrap">2026.08.20 (목)</span>
        </div>

        {/* 알림 */}
        <button
          type="button"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-ivory-50 text-pine-800 transition-all hover:bg-pine-50 hover:shadow-sm"
          aria-label="알림"
        >
          <Bell size={16} strokeWidth={1.75} />
          {notifications ? (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sand-500 px-1 text-[0.5625rem] font-bold text-white animate-pulse-soft">
              3
            </span>
          ) : null}
        </button>
      </header>

      {/* 모바일 드로어 */}
      <AnimatePresence>
        {drawerOpen ? (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-pine-950/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-pine-900 shadow-sidebar lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="absolute right-3 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="메뉴 닫기"
              >
                <X size={16} />
              </button>
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
