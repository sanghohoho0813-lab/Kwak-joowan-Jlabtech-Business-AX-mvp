"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Bell, Menu, X, BookOpen, Compass } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { useStore } from "@/lib/store-context";
import { pageTitles } from "./nav-config";
import { SidebarContent } from "./sidebar";
import { useDrawer } from "./drawer-context";
import { LiveClock } from "./live-clock";
import { DevicePreview } from "./device-preview";
import { SurfaceSwitcher } from "./surface-switcher";
import { StatusPill } from "@/components/ui/status-chip";

function TopbarInner() {
  const pathname = usePathname();
  const params = useSearchParams();
  const isPreview = params.get("preview") === "1";
  const { notifications } = useSettings();
  const { requests } = useStore();
  const { open, setOpen } = useDrawer();
  const title = pageTitles[pathname] ?? "JLAB TECH AX";
  const newRequests = requests.filter((r) => r.status === "접수").length;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-ivory-300/85 px-4 backdrop-blur-md md:h-16 md:gap-3 md:px-6">
        {/* 모바일 메뉴 버튼 */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-ivory-50 text-pine-800 transition-colors duration-fast hover:bg-pine-50 lg:hidden"
          aria-label="메뉴 열기"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="clamp-1 text-sm font-bold text-pine-900 md:text-base">{title}</h2>
          <p className="hidden truncate text-2xs text-inkmuted md:block">
            JLAB TECH AX 플랫폼 — 데이터 기반 운영 인사이트
          </p>
        </div>

        {/* 데이터·AI 상태 */}
        <StatusPill />

        {/* 화면 전환 — 관리자/고객 두 칸을 함께 보여준다 (시연용) */}
        <SurfaceSwitcher current="admin" />

        {/* 모바일 미리보기 */}
        <DevicePreview isPreview={isPreview} />

        {/* 사용 방법 */}
        <Link
          href="/tutorial"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-ivory-50 text-xs font-semibold text-inkbody transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50 hover:text-pine-700 sm:flex"
          aria-label="사용 방법"
          title="사용 방법"
        >
          <BookOpen size={15} strokeWidth={1.9} />
        </Link>

        {/* 기획의도 */}
        <Link
          href="/intent"
          className="shimmer relative flex h-9 shrink-0 items-center gap-1.5 overflow-hidden rounded-xl bg-pine-800 px-2.5 text-xs font-semibold text-white shadow-sm transition-colors duration-fast hover:bg-pine-700"
          aria-label="기획의도"
        >
          <Compass size={15} strokeWidth={1.9} className="shrink-0 text-sand-400" />
          <span className="hidden whitespace-nowrap min-[1400px]:inline">기획의도</span>
        </Link>

        {/* 현재 날짜·시각 */}
        <LiveClock />

        {/* 알림 */}
        <Link
          href="/requests"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-ivory-50 text-pine-800 transition-colors duration-fast hover:bg-pine-50"
          aria-label={`알림 ${newRequests}건`}
        >
          <Bell size={16} strokeWidth={1.75} />
          {notifications && newRequests > 0 ? (
            <span className="attention-once absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sand-500 px-1 text-[0.5625rem] font-bold text-white">
              {newRequests}
            </span>
          ) : null}
        </Link>
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
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-pine-900 shadow-sidebar lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors duration-fast hover:bg-white/10 hover:text-white"
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

export function Topbar() {
  return (
    <Suspense
      fallback={<div className="sticky top-0 z-30 h-14 border-b border-line bg-ivory-300/85 md:h-16" />}
    >
      <TopbarInner />
    </Suspense>
  );
}
