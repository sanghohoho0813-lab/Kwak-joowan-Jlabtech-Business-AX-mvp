"use client";

/**
 * 고객 플랫폼 셸.
 *
 * Business AX(내부 관리 화면)와 같은 브랜드를 쓰되, 정보 밀도를 크게 낮추고
 * 모바일을 우선한다. 좌측 관리자 사이드바를 복제하지 않는다.
 *
 * 헤더 왼쪽은 "제이랩테크 고객 플랫폼"이라는 서비스 이름만 쓴다.
 * 어느 회사로 들어와 있는지는 오른쪽 계정 칩이 말한다. 둘을 겹쳐 두면
 * 브랜드 밑에 고객사 이름이 붙어 "이게 뭐지?"가 된다.
 */

import { type ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ruler,
  Bell,
  Menu,
  ChevronDown,
  Building2,
  MapPin,
  FileText,
  CalendarDays,
  Check,
  ArrowLeftRight,
  LayoutGrid,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import { useCustomer } from "@/lib/use-customer";
import { useStore } from "@/lib/store-context";
import { SurfaceSwitcher } from "@/components/layout/surface-switcher";
import { CustomerDrawer, customerNav } from "@/components/customer/customer-drawer";
import { AccountAvatar } from "@/components/customer/account-avatar";

/** 계정 정보 + 고객사 전환 팝오버 */
function AccountMenu() {
  const me = useCustomer();
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
    { icon: Building2, label: "업종", value: me.segment },
    { icon: MapPin, label: "지역", value: me.region },
    { icon: FileText, label: "거래 형태", value: me.contractType },
    { icon: CalendarDays, label: "첫 거래", value: formatDate(me.since) },
  ];

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-xl border border-line bg-white pl-1.5 pr-2.5 shadow-sm transition-colors duration-fast hover:border-pine-200 hover:bg-pine-50"
        aria-label="내 계정"
        aria-expanded={open}
      >
        <AccountAvatar id={me.id} company={me.company} className="h-7 w-7 text-xs" />
        <span className="hidden max-w-[9rem] truncate text-sm font-bold text-inkstrong min-[1100px]:block">
          {me.company}
        </span>
        <ChevronDown size={14} className="hidden shrink-0 text-inkmuted md:block" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-12 z-50 w-[19rem] rounded-2xl border border-line bg-white p-4 shadow-card-hover"
          >
            <div className="flex items-center gap-3">
              <AccountAvatar id={me.id} company={me.company} className="h-11 w-11 text-lg" />
              <div className="min-w-0">
                <p className="clamp-1 text-base font-bold text-inkstrong">{me.company}</p>
                <p className="clamp-1 text-sm text-inkmuted">담당자 {me.contactName}님</p>
              </div>
            </div>
            <div className="mt-3 space-y-2 border-t border-line pt-3">
              {rows.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.label} className="flex items-center gap-2">
                    <Icon size={14} className="shrink-0 text-inkmuted" />
                    <span className="shrink-0 text-sm text-inkmuted">{r.label}</span>
                    <span className="clamp-1 ml-auto text-sm font-bold text-inkstrong">
                      {r.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 다른 고객사로 보기 — 시연용 */}
            <div className="mt-3 border-t border-line pt-3">
              <p className="flex items-center gap-1.5 px-0.5 text-xs font-bold uppercase tracking-wider text-inkmuted">
                <ArrowLeftRight size={12} />
                다른 고객사 예시로 보기
              </p>
              <ul className="mt-2 space-y-1">
                {me.all.map((c) => {
                  const active = c.id === me.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => {
                          me.switchTo(c.id);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors duration-fast",
                          active ? "bg-pine-50" : "hover:bg-cloud",
                        )}
                      >
                        <AccountAvatar id={c.id} company={c.company} className="h-8 w-8 text-xs" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-inkstrong">
                            {c.company}
                          </span>
                          <span className="block truncate text-xs text-inkmuted">
                            {c.segment} · {c.region}
                          </span>
                        </span>
                        {active ? <Check size={16} className="shrink-0 text-pine-700" /> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="mt-3 rounded-lg bg-cloud p-3 text-xs leading-relaxed text-inkmuted">
              시연용 계정입니다. 실제 운영 시에는 로그인한 고객사 정보가 들어오고 전환 기능은
              없습니다.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function CustomerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const me = useCustomer();
  const { requests } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* 답변이 도착했고 아직 끝나지 않은 요청 = 고객이 확인해야 할 건수 */
  const waiting = requests.filter(
    (r) => r.customerId === me.id && r.response && r.status !== "완료",
  ).length;

  return (
    <div className="min-h-dvh bg-cloud text-inkstrong">
      {/* 상단 */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-4 md:gap-3 md:px-6">
          <Link href="/customer" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pine-900 text-sand-400">
              <Ruler size={18} strokeWidth={1.9} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-bold leading-tight text-inkstrong">
                제이랩테크
              </span>
              <span className="block truncate text-xs font-semibold leading-tight text-pine-700">
                고객 플랫폼
              </span>
            </span>
          </Link>

          {/* PC 내비 — 기본 3개만 */}
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {customerNav.map((n) => {
              const active =
                n.href === "/customer" ? pathname === n.href : pathname.startsWith(n.href);
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "flex h-11 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-base font-bold transition-colors duration-fast",
                    active
                      ? "bg-pine-700 text-white"
                      : "text-inkbody hover:bg-pine-50 hover:text-pine-700",
                  )}
                >
                  <Icon size={18} strokeWidth={1.9} />
                  <span className="hidden min-[900px]:inline">{n.label}</span>
                </Link>
              );
            })}
            {/* 서비스는 따로 — 색을 달리해 성격이 다른 곳임을 보인다 */}
            <Link
              href="/customer/services"
              className={cn(
                "ml-1 flex h-11 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-base font-bold transition-colors duration-fast",
                pathname.startsWith("/customer/services")
                  ? "bg-clay-500 text-white"
                  : "bg-clay-100 text-clay-600 hover:bg-clay-400/40",
              )}
            >
              <LayoutGrid size={18} strokeWidth={1.9} />
              <span className="hidden min-[900px]:inline">서비스</span>
            </Link>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 md:ml-3 md:gap-2">
            <span className="hidden md:block">
              <SurfaceSwitcher current="customer" />
            </span>

            <AccountMenu />

            {/* 알림 — 답변이 온 요청 */}
            <Link
              href="/customer/requests"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-inkstrong shadow-sm transition-colors duration-fast hover:border-pine-200 hover:bg-pine-50"
              aria-label={`확인이 필요한 요청 ${waiting}건`}
            >
              <Bell size={17} strokeWidth={1.9} />
              {waiting > 0 ? (
                <span className="attention-once absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay-500 px-1 text-[0.625rem] font-bold text-white">
                  {waiting}
                </span>
              ) : null}
            </Link>

            {/* 전체 메뉴 */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-inkstrong shadow-sm transition-colors duration-fast hover:border-pine-200 hover:bg-pine-50"
              aria-label="전체 메뉴 열기"
            >
              <Menu size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:px-6 md:pb-14 md:pt-8">
        {children}
      </main>

      {/* 모바일 하단 내비 — 3개 + 서비스 */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <div className="mx-auto grid h-[4.5rem] max-w-md grid-cols-4">
          {[...customerNav, { href: "/customer/services", label: "서비스", icon: null, hint: "" }].map(
            (n) => {
              const active =
                n.href === "/customer" ? pathname === n.href : pathname.startsWith(n.href);
              const isServices = n.href === "/customer/services";
              const Icon = n.icon;
              const badge = n.href === "/customer/requests" && waiting > 0;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 transition-colors duration-fast",
                    active
                      ? isServices
                        ? "text-clay-600"
                        : "text-pine-700"
                      : "text-inkmuted",
                  )}
                >
                  <span
                    className={cn(
                      "relative flex h-8 w-12 items-center justify-center rounded-full transition-colors duration-fast",
                      active && (isServices ? "bg-clay-100" : "bg-pine-50"),
                    )}
                  >
                    {Icon ? <Icon size={21} strokeWidth={active ? 2.3 : 1.9} /> : <LayoutGrid size={21} strokeWidth={active ? 2.3 : 1.9} />}
                    {badge ? (
                      <span className="absolute right-1.5 top-0 h-2 w-2 rounded-full bg-clay-500" />
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap text-sm leading-none",
                      active ? "font-bold" : "font-medium",
                    )}
                  >
                    {n.label}
                  </span>
                </Link>
              );
            },
          )}
        </div>
      </nav>

      <CustomerDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
