"use client";

/**
 * 고객 플랫폼 전체 메뉴 드로어.
 *
 * 구조는 단순하게 — [계정] [기본 메뉴 3개] [서비스 하나만 따로] [화면 전환].
 * 페이지 안 목차는 두지 않는다. 항목이 많아질수록 무엇이 메뉴인지 흐려진다.
 * 서비스는 성격이 다른 곳이라 색을 달리해 한 묶음으로 분리한다.
 */

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Home,
  Wrench,
  Inbox,
  LayoutGrid,
  ChevronRight,
  Check,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCustomer } from "@/lib/use-customer";
import { useStore } from "@/lib/store-context";
import { repo } from "@/data/repository";
import { SurfaceSwitcher } from "@/components/layout/surface-switcher";
import { DataChip } from "@/components/ui/status-chip";
import { AccountAvatar } from "@/components/customer/account-avatar";

/** 기본 메뉴 3개 — 서비스는 여기 넣지 않는다 */
export const customerNav = [
  { href: "/customer", label: "홈", icon: Home, hint: "현황과 다가오는 일정" },
  { href: "/customer/equipment", label: "내 장비", icon: Wrench, hint: "교정 시점과 이력" },
  { href: "/customer/requests", label: "요청 내역", icon: Inbox, hint: "진행 상황과 답변" },
];

export function CustomerDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const me = useCustomer();
  const { requests } = useStore();

  const myEquipment = repo.getInstalledEquipment().filter((e) => e.customerId === me.id);
  const openRequests = requests.filter((r) => r.customerId === me.id && r.status !== "완료");
  const catalog = repo.getServiceCatalog();
  const preparing = catalog.filter((s) => s.stage === "준비 중").length;

  const counts: Record<string, string> = {
    "/customer/equipment": `${myEquipment.length}대`,
    "/customer/requests": `${openRequests.length}건 진행 중`,
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-pine-950/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.aside
            key="drawer"
            className="fixed inset-y-0 right-0 z-50 flex w-[21rem] max-w-[88vw] flex-col bg-white shadow-card-hover"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            aria-label="전체 메뉴"
          >
            {/* 계정 */}
            <div className="border-b border-line bg-pine-900 p-5 text-white">
              <div className="flex items-start gap-3">
                <AccountAvatar
                  id={me.id}
                  company={me.company}
                  className="h-11 w-11 text-lg ring-2 ring-white/20"
                />
                <div className="min-w-0 flex-1">
                  <p className="clamp-1 text-base font-bold">{me.company}</p>
                  <p className="clamp-1 text-sm text-white/70">
                    {me.contactName} 담당자님 · {me.contractType}
                  </p>
                  <span className="mt-2 inline-block">
                    <DataChip />
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-white/70 transition-colors duration-fast hover:bg-white/10 hover:text-white"
                  aria-label="메뉴 닫기"
                >
                  <X size={17} />
                </button>
              </div>

              {/* 고객사 전환 — 시연용 */}
              <p className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/60">
                <ArrowLeftRight size={12} />
                다른 고객사 예시로 보기
              </p>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {me.all.map((c) => {
                  const active = c.id === me.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => me.switchTo(c.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2.5 text-center transition-colors duration-fast",
                        active
                          ? "border-sand-400 bg-white/10"
                          : "border-white/15 hover:bg-white/10",
                      )}
                      aria-pressed={active}
                    >
                      <span className="relative">
                        <AccountAvatar id={c.id} company={c.company} className="h-8 w-8 text-xs" />
                        {active ? (
                          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sand-400 text-pine-950">
                            <Check size={10} strokeWidth={3} />
                          </span>
                        ) : null}
                      </span>
                      <span className="clamp-1 w-full text-[0.6875rem] font-semibold leading-tight">
                        {c.company}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* 기본 메뉴 */}
              <p className="px-1 text-xs font-bold uppercase tracking-wider text-inkmuted">
                메뉴
              </p>
              <nav className="mt-2 space-y-1">
                {customerNav.map((n) => {
                  const active =
                    n.href === "/customer" ? pathname === n.href : pathname.startsWith(n.href);
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-fast",
                        active ? "bg-pine-50" : "hover:bg-cloud",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          active ? "bg-pine-700 text-white" : "bg-cloud text-inkbody",
                        )}
                      >
                        <Icon size={18} strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-base text-inkstrong",
                            active ? "font-bold" : "font-semibold",
                          )}
                        >
                          {n.label}
                        </span>
                        <span className="clamp-1 block text-sm text-inkmuted">{n.hint}</span>
                      </span>
                      {counts[n.href] ? (
                        <span className="num shrink-0 whitespace-nowrap rounded-full bg-cloud px-2.5 py-1 text-xs font-bold text-inkbody">
                          {counts[n.href]}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>

              {/* 서비스 — 따로 한 묶음 */}
              <p className="mt-6 px-1 text-xs font-bold uppercase tracking-wider text-inkmuted">
                서비스
              </p>
              <Link
                href="/customer/services"
                onClick={onClose}
                className={cn(
                  "mt-2 block rounded-2xl border p-4 transition-colors duration-fast",
                  pathname.startsWith("/customer/services")
                    ? "border-clay-500 bg-clay-100/70"
                    : "border-clay-400/50 bg-clay-100/40 hover:bg-clay-100/70",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-clay-500 text-white">
                    <LayoutGrid size={20} strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-inkstrong">
                      제이랩테크 서비스
                    </span>
                    <span className="block text-sm text-inkbody">
                      이용 가능 {catalog.length - preparing - catalog.filter((s) => s.stage === "검토 중").length}종 · 준비 중 {preparing}종 · 검토 중{" "}
                      {catalog.filter((s) => s.stage === "검토 중").length}종
                    </span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-clay-600" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-inkbody">
                  지금 되는 것과 앞으로 열릴 것을 한곳에 정리했습니다. 관심 있는 서비스에 표시를
                  남기실 수 있습니다.
                </p>
              </Link>
            </div>

            {/* 화면 전환 */}
            <div className="border-t border-line bg-cloud p-4">
              <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-inkmuted">
                화면 전환
              </p>
              <SurfaceSwitcher current="customer" expanded />
              <p className="mt-2.5 px-1 text-xs leading-relaxed text-inkmuted">
                시연용 전환입니다. 실제 운영 시 고객은 고객 화면만 사용합니다.
              </p>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
