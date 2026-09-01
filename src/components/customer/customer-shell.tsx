"use client";

/**
 * 고객 플랫폼 셸.
 *
 * Business AX(내부 관리 화면)와 같은 브랜드를 쓰되, 정보 밀도를 크게 낮추고
 * 모바일을 우선한다. 좌측 관리자 사이드바를 복제하지 않는다.
 *
 * 상단에는 계정(어느 회사로 로그인했는지)과 알림(답변이 온 요청)을 둔다.
 * 고객이 "내 계정으로 들어와 있다"고 느끼게 하는 최소 장치다.
 */

import { type ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Wrench,
  Inbox,
  LayoutGrid,
  Ruler,
  LayoutDashboard,
  Bell,
  ChevronDown,
  Building2,
  MapPin,
  FileText,
  CalendarDays,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import { demoCustomer } from "@/data/mock/customer-portal";
import { useStore } from "@/lib/store-context";
import { DataChip } from "@/components/ui/status-chip";

const nav = [
  { href: "/customer", label: "홈", icon: Home },
  { href: "/customer/equipment", label: "내 장비", icon: Wrench },
  { href: "/customer/requests", label: "요청 내역", icon: Inbox },
  { href: "/customer/services", label: "서비스", icon: LayoutGrid },
];

/** 회사명 첫 글자로 만드는 계정 아바타 */
function AccountAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-pine-700 text-sm font-bold text-white",
        className,
      )}
      aria-hidden
    >
      {demoCustomer.company.slice(0, 1)}
    </span>
  );
}

/** 계정 정보 팝오버 — 지금 어떤 계약 형태로 거래 중인지까지 보여준다 */
function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const rows = [
    { icon: Building2, label: "업종", value: demoCustomer.segment },
    { icon: MapPin, label: "지역", value: demoCustomer.region },
    { icon: FileText, label: "거래 형태", value: demoCustomer.contractType },
    { icon: CalendarDays, label: "첫 거래", value: formatDate(demoCustomer.since) },
  ];

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 rounded-xl border border-line bg-ivory-50 pl-1.5 pr-2 transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50"
        aria-label="내 계정"
        aria-expanded={open}
      >
        <AccountAvatar className="h-6 w-6 text-2xs" />
        <span className="hidden max-w-[7rem] truncate text-xs font-semibold text-inkbody lg:block">
          {demoCustomer.contactName}님
        </span>
        <ChevronDown size={13} className="shrink-0 text-inkmuted" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-11 z-50 w-64 rounded-2xl border border-line bg-ivory-50 p-4 shadow-card-hover"
          >
            <div className="flex items-center gap-2.5">
              <AccountAvatar className="h-10 w-10 text-base" />
              <div className="min-w-0">
                <p className="clamp-1 text-sm font-bold text-pine-900">
                  {demoCustomer.company}
                </p>
                <p className="clamp-1 text-2xs text-inkmuted">
                  담당자 {demoCustomer.contactName}님
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2 border-t border-line pt-3">
              {rows.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.label} className="flex items-center gap-2">
                    <Icon size={13} className="shrink-0 text-inkmuted" />
                    <span className="shrink-0 text-2xs text-inkmuted">{r.label}</span>
                    <span className="clamp-1 ml-auto text-2xs font-semibold text-inkbody">
                      {r.value}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 rounded-lg bg-ivory-200/70 p-2.5 text-[0.5625rem] leading-relaxed text-inkmuted">
              시연용 계정입니다. 실제 운영 시에는 로그인한 고객사 정보가 들어옵니다.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function CustomerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { requests } = useStore();

  /* 답변이 도착했고 아직 끝나지 않은 요청 = 고객이 확인해야 할 건수 */
  const waiting = requests.filter(
    (r) => r.customerId === demoCustomer.id && r.response && r.status !== "완료",
  ).length;

  return (
    <div className="min-h-dvh bg-ivory-300">
      {/* 상단 */}
      <header className="sticky top-0 z-30 border-b border-line bg-ivory-50/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-2 px-4 md:gap-3 md:px-6">
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
              const active =
                n.href === "/customer"
                  ? pathname === n.href
                  : pathname.startsWith(n.href);
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "flex h-10 items-center gap-2 whitespace-nowrap rounded-xl px-3 text-sm font-semibold transition-colors duration-fast",
                    active
                      ? "bg-pine-700 text-white"
                      : "text-inkmuted hover:bg-pine-50 hover:text-pine-700",
                  )}
                >
                  <Icon size={16} strokeWidth={1.9} />
                  <span className="hidden min-[900px]:inline">{n.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 md:ml-3 md:gap-2">
            <span className="hidden min-[1180px]:block">
              <DataChip />
            </span>

            {/* 알림 — 답변이 온 요청 */}
            <Link
              href="/customer/requests"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-ivory-50 text-pine-800 transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50"
              aria-label={`확인이 필요한 요청 ${waiting}건`}
            >
              <Bell size={16} strokeWidth={1.75} />
              {waiting > 0 ? (
                <span className="attention-once absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sand-500 px-1 text-[0.5625rem] font-bold text-white">
                  {waiting}
                </span>
              ) : null}
            </Link>

            <AccountMenu />

            {/* Demo 목적의 Surface Switcher */}
            <Link
              href="/"
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-line bg-ivory-50 px-2.5 text-xs font-semibold text-inkbody transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50 hover:text-pine-700"
              title="내부 관리 화면(Business AX)으로 이동 — 시연용"
              aria-label="관리자 화면으로 이동"
            >
              <LayoutDashboard size={15} strokeWidth={1.9} />
              <span className="hidden whitespace-nowrap min-[1320px]:inline">관리자 화면</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 md:px-6 md:pb-12">
        {children}
      </main>

      {/* 모바일 하단 내비 */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <div className="mx-auto grid h-16 max-w-md grid-cols-4">
          {nav.map((n) => {
            const active =
              n.href === "/customer" ? pathname === n.href : pathname.startsWith(n.href);
            const Icon = n.icon;
            const badge = n.href === "/customer/requests" && waiting > 0;
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
                    "relative flex h-7 w-11 items-center justify-center rounded-full transition-colors duration-fast",
                    active && "bg-pine-50",
                  )}
                >
                  <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                  {badge ? (
                    <span className="absolute right-1.5 top-0 h-1.5 w-1.5 rounded-full bg-sand-500" />
                  ) : null}
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
