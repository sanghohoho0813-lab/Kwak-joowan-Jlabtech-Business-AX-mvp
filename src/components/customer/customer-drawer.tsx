"use client";

/**
 * 고객 플랫폼 전체 메뉴 드로어.
 *
 * 화면 이동(메뉴)과 현재 페이지 안의 위치 이동(목차)을 한 곳에 모은다.
 * 페이지가 길어 스크롤로 찾아야 했던 것을 드로어에서 바로 짚어 갈 수 있게 하는 것이
 * 목적이라, 각 페이지마다 그 페이지의 섹션 목록을 따로 만든다.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Home,
  Wrench,
  Inbox,
  LayoutGrid,
  ListTree,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { demoCustomer } from "@/data/mock/customer-portal";
import { repo } from "@/data/repository";
import { useStore } from "@/lib/store-context";
import { SurfaceSwitcher } from "@/components/layout/surface-switcher";
import { DataChip } from "@/components/ui/status-chip";

export const customerNav = [
  { href: "/customer", label: "홈", icon: Home, hint: "현황과 다가오는 일정" },
  { href: "/customer/equipment", label: "내 장비", icon: Wrench, hint: "교정 시점과 이력" },
  { href: "/customer/requests", label: "요청 내역", icon: Inbox, hint: "진행 상황과 답변" },
  { href: "/customer/services", label: "서비스", icon: LayoutGrid, hint: "제공 중·준비 중" },
];

interface Section {
  id: string;
  label: string;
  note?: string;
}

export function CustomerDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { requests } = useStore();

  const myEquipment = useMemo(
    () => repo.getInstalledEquipment().filter((e) => e.customerId === demoCustomer.id),
    [],
  );
  const myRequests = useMemo(
    () =>
      requests
        .filter((r) => r.customerId === demoCustomer.id)
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [requests],
  );

  const counts: Record<string, string> = {
    "/customer/equipment": `${myEquipment.length}대`,
    "/customer/requests": `${myRequests.filter((r) => r.status !== "완료").length}건 진행 중`,
    "/customer/services": "11종",
  };

  /** 현재 페이지의 목차 */
  const sections: Section[] = useMemo(() => {
    if (pathname === "/customer") {
      const attention = myRequests.filter((r) => r.response && r.status !== "완료").length;
      return [
        ...(attention
          ? [{ id: "sec-attention", label: "확인이 필요한 답변", note: `${attention}건` }]
          : []),
        { id: "sec-summary", label: "한눈에 보기" },
        { id: "sec-schedule", label: "다가오는 일정" },
        { id: "sec-quick", label: "무엇을 도와드릴까요?" },
        { id: "sec-recent", label: "보내신 요청" },
        { id: "sec-journey", label: "앞으로 이렇게 넓어집니다" },
        { id: "sec-updates", label: "업데이트 소식" },
      ];
    }
    if (pathname === "/customer/equipment") {
      return [
        { id: "sec-search", label: "검색·필터" },
        ...myEquipment.map((e) => ({
          id: `eq-${e.id}`,
          label: `${e.itemName} ${e.model}`,
          note: e.status,
        })),
      ];
    }
    if (pathname === "/customer/requests") {
      return [
        { id: "sec-filter", label: "상태 필터" },
        ...myRequests.slice(0, 6).map((r) => ({
          id: `req-${r.id}`,
          label: r.title,
          note: r.status,
        })),
      ];
    }
    if (pathname === "/customer/services") {
      return [
        { id: "sec-story", label: "매출 구조가 바뀌는 방향" },
        { id: "stage-available", label: "이용 가능", note: "3종" },
        { id: "stage-preparing", label: "준비 중", note: "4종" },
        { id: "stage-review", label: "검토 중", note: "4종" },
        { id: "sec-updates", label: "이 플랫폼의 변화" },
        { id: "sec-notation", label: "표기에 대해" },
      ];
    }
    return [];
  }, [pathname, myEquipment, myRequests]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const goTo = (id: string) => {
    onClose();
    // 드로어가 닫히는 동안 기다렸다가 이동한다
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 180);
  };

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
            className="fixed inset-y-0 right-0 z-50 flex w-[21rem] max-w-[88vw] flex-col bg-ivory-50 shadow-card-hover"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            aria-label="전체 메뉴"
          >
            {/* 계정 */}
            <div className="flex items-start gap-2.5 border-b border-line bg-pine-900 p-5 text-white">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand-500 text-base font-bold text-pine-950">
                {demoCustomer.company.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="clamp-1 text-base font-bold">{demoCustomer.company}</p>
                <p className="clamp-1 text-sm text-white/70">
                  {demoCustomer.contactName} 담당자님 · {demoCustomer.contractType}
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
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* 메뉴 */}
              <p className="px-1 text-sm font-bold uppercase tracking-wider text-inkmuted">
                메뉴
              </p>
              <nav className="mt-2 space-y-1">
                {customerNav.map((n) => {
                  const active =
                    n.href === "/customer"
                      ? pathname === n.href
                      : pathname.startsWith(n.href);
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-fast",
                        active
                          ? "bg-pine-50 text-pine-900"
                          : "text-inkbody hover:bg-ivory-200/70",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          active ? "bg-pine-700 text-white" : "bg-ivory-200 text-inkmuted",
                        )}
                      >
                        <Icon size={18} strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-base",
                            active ? "font-bold" : "font-semibold",
                          )}
                        >
                          {n.label}
                        </span>
                        <span className="clamp-1 block text-sm text-inkmuted">{n.hint}</span>
                      </span>
                      {counts[n.href] ? (
                        <span className="num shrink-0 whitespace-nowrap rounded-full bg-ivory-200 px-2.5 py-1 text-xs font-bold text-inkmuted">
                          {counts[n.href]}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>

              {/* 이 페이지 목차 */}
              {sections.length > 0 ? (
                <>
                  <p className="mt-6 flex items-center gap-2 px-1 text-sm font-bold uppercase tracking-wider text-inkmuted">
                    <ListTree size={15} className="shrink-0 text-clay-600" />
                    이 페이지 목차
                  </p>
                  <ul className="mt-2 space-y-0.5 border-l border-line pl-3">
                    {sections.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => goTo(s.id)}
                          className="group flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left transition-colors duration-fast hover:bg-clay-100/60"
                        >
                          <span className="clamp-1 min-w-0 flex-1 text-base font-semibold text-inkbody group-hover:text-clay-600">
                            {s.label}
                          </span>
                          {s.note ? (
                            <span className="num shrink-0 whitespace-nowrap text-sm text-inkmuted">
                              {s.note}
                            </span>
                          ) : null}
                          <ChevronRight
                            size={15}
                            className="shrink-0 text-inkmuted/60 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:text-clay-600"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>

            {/* 화면 전환 */}
            <div className="border-t border-line bg-ivory-100/70 p-4">
              <p className="mb-2 px-1 text-sm font-bold uppercase tracking-wider text-inkmuted">
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
