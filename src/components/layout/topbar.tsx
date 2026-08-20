"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, X, BookOpen, Compass } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { pageTitles } from "./nav-config";
import { SidebarContent } from "./sidebar";
import { useDrawer } from "./drawer-context";
import { LiveClock } from "./live-clock";

export function Topbar() {
  const pathname = usePathname();
  const { notifications } = useSettings();
  const { open, setOpen } = useDrawer();
  const title = pageTitles[pathname] ?? "JLAB TECH AX";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-ivory-300/85 px-4 backdrop-blur-md md:h-16 md:px-6">
        {/* 모바일 메뉴 버튼 */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-ivory-50 text-pine-800 transition-colors hover:bg-pine-50 lg:hidden"
          aria-label="메뉴 열기"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="clamp-1 text-sm font-bold text-pine-900 md:text-base">
            {title}
          </h2>
          <p className="hidden truncate text-2xs text-inkmuted md:block">
            JLAB TECH AX 플랫폼 — 데이터 기반 운영 인사이트
          </p>
        </div>

        {/* 사용 방법 */}
        <Link
          href="/tutorial"
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-line bg-ivory-50 px-2.5 text-xs font-semibold text-inkbody transition-all hover:border-pine-100 hover:bg-pine-50 hover:text-pine-700 hover:shadow-sm sm:px-3"
          aria-label="사용 방법"
        >
          <BookOpen size={15} strokeWidth={1.9} className="shrink-0" />
          <span className="hidden whitespace-nowrap sm:inline">사용 방법</span>
        </Link>

        {/* 기획의도 — 은은한 광택으로 시선을 유도 */}
        <Link
          href="/intent"
          className="shimmer relative flex h-9 shrink-0 items-center gap-1.5 overflow-hidden rounded-xl bg-pine-800 px-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-pine-700 hover:shadow-md sm:px-3"
          aria-label="기획의도"
        >
          <Compass size={15} strokeWidth={1.9} className="shrink-0 text-sand-400" />
          <span className="hidden whitespace-nowrap sm:inline">기획의도</span>
        </Link>

        {/* 현재 날짜·시각 */}
        <LiveClock />

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
        {open ? (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-pine-950/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
                className="absolute right-3 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="메뉴 닫기"
              >
                <X size={16} />
              </button>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
