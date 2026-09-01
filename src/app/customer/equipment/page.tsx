"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wrench,
  MapPin,
  ShieldCheck,
  CalendarCheck,
  Package,
  MessageSquare,
  Search,
  ChevronDown,
  FileCheck2,
  Repeat,
  CircleDot,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { RequestDialog } from "@/components/customer/request-dialog";
import { repo } from "@/data/repository";
import { demoCustomer } from "@/data/mock/customer-portal";
import { cn, formatDate, dday, daysLeft, addMonths } from "@/lib/utils";
import type { EquipmentStatus, InstalledEquipment, RequestType } from "@/data/types";

const equipmentTone: Record<EquipmentStatus, "success" | "warning" | "danger" | "neutral"> = {
  "정상 가동": "success",
  "교정 필요": "warning",
  "점검 요청": "danger",
  "보증 만료": "neutral",
};

const filters = ["전체", "교정 임박", "소모품 있음", "보증 중"] as const;
type Filter = (typeof filters)[number];

export default function CustomerEquipmentPage() {
  const myEquipment = useMemo(
    () => repo.getInstalledEquipment().filter((e) => e.customerId === demoCustomer.id),
    [],
  );

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("전체");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<RequestType>("교정 요청");
  const [target, setTarget] = useState<InstalledEquipment | null>(null);

  const request = (t: RequestType, e: InstalledEquipment) => {
    setType(t);
    setTarget(e);
    setOpen(true);
  };

  const matches = (e: InstalledEquipment) => {
    const q = query.trim().toLowerCase();
    if (
      q &&
      ![e.itemName, e.model, e.site, e.serial].some((v) => v.toLowerCase().includes(q))
    )
      return false;
    if (filter === "교정 임박") {
      const d = daysLeft(e.nextCalibrationDate);
      return d <= 60;
    }
    if (filter === "소모품 있음") return Boolean(e.consumableCycleMonths);
    if (filter === "보증 중") return daysLeft(e.warrantyEndDate) > 0;
    return true;
  };

  const visible = myEquipment.filter(matches);

  const filterCount = (f: Filter) =>
    f === "전체" ? myEquipment.length : myEquipment.filter((e) => {
      if (f === "교정 임박") return daysLeft(e.nextCalibrationDate) <= 60;
      if (f === "소모품 있음") return Boolean(e.consumableCycleMonths);
      return daysLeft(e.warrantyEndDate) > 0;
    }).length;

  return (
    <div className="space-y-5">
      <Reveal>
        <h1 className="text-xl font-bold tracking-tight text-pine-900 md:text-2xl">내 장비</h1>
        <p className="mt-2 text-sm leading-relaxed text-inkmuted md:text-base">
          제이랩테크를 통해 도입하신 장비입니다. 교정 시점과 보증 상태를 확인하고, 필요한
          요청을 바로 보내실 수 있습니다.
        </p>
      </Reveal>

      {/* 검색·필터 */}
      <Reveal delay={0.04}>
        <div className="space-y-2.5">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-inkmuted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="장비명·모델·설치 현장·시리얼로 검색"
              aria-label="장비 검색"
              className="h-11 w-full rounded-xl border border-line bg-ivory-50 pl-10 pr-3 text-sm text-inkbody placeholder:text-inkmuted/70 focus:border-pine-600/50 focus:outline-none focus:ring-2 focus:ring-pine-600/15"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "h-9 whitespace-nowrap rounded-full border px-4 text-xs font-semibold transition-colors duration-fast",
                  filter === f
                    ? "border-pine-700 bg-pine-700 text-white"
                    : "border-line bg-ivory-50 text-inkmuted hover:border-pine-100 hover:text-pine-700",
                )}
              >
                {f} <span className="num ml-1.5 opacity-70">{filterCount(f)}</span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {visible.length === 0 ? (
        <Reveal delay={0.08}>
          <Card className="border-dashed">
            <CardContent className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-pine-900">조건에 맞는 장비가 없습니다</p>
              <p className="mt-1.5 text-xs text-inkmuted">
                검색어나 필터를 바꿔 보세요.
              </p>
            </CardContent>
          </Card>
        </Reveal>
      ) : (
        <Stagger className="space-y-4">
          {visible.map((e) => {
            const warrantyLeft = daysLeft(e.warrantyEndDate);
            const calLeft = daysLeft(e.nextCalibrationDate);
            const isOpen = expanded === e.id;
            const nextConsumable =
              e.consumableCycleMonths && e.lastConsumableDate
                ? addMonths(e.lastConsumableDate, e.consumableCycleMonths)
                : null;

            return (
              <StaggerItem key={e.id}>
                <Card className={cn(isOpen && "shadow-card-hover")}>
                  <CardContent className="p-5 md:p-6">
                    {/* 헤더 */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                          <Wrench size={21} strokeWidth={1.9} />
                        </span>
                        <div className="min-w-0">
                          <p className="clamp-2 text-base font-bold leading-snug text-pine-900">
                            {e.itemName} <span className="text-inkmuted">{e.model}</span>
                          </p>
                          <p className="clamp-1 mt-1 flex items-center gap-1.5 text-xs text-inkmuted">
                            <MapPin size={12} className="shrink-0" />
                            {e.site}
                          </p>
                        </div>
                      </div>
                      <Badge tone={equipmentTone[e.status]}>{e.status}</Badge>
                    </div>

                    {/* 상세 정보 */}
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-ivory-100/70 p-4 sm:grid-cols-4">
                      {[
                        { label: "설치일", value: formatDate(e.installedDate) },
                        { label: "시리얼", value: e.serial },
                        { label: "마지막 교정", value: formatDate(e.lastCalibrationDate) },
                        {
                          label: "보증",
                          value:
                            warrantyLeft > 0
                              ? `${formatDate(e.warrantyEndDate)}까지`
                              : "보증 종료",
                        },
                      ].map((d) => (
                        <div key={d.label} className="min-w-0">
                          <p className="text-2xs text-inkmuted">{d.label}</p>
                          <p className="num clamp-1 mt-0.5 text-xs font-semibold text-inkbody">
                            {d.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* 다음 교정 */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-sand-400/40 bg-sand-100/40 p-3.5">
                      <CalendarCheck size={17} className="shrink-0 text-sand-600" />
                      <p className="num min-w-0 flex-1 text-xs font-semibold text-inkbody">
                        다음 교정 예정 {formatDate(e.nextCalibrationDate)}
                        <span className="ml-2 font-bold text-sand-600">
                          {dday(e.nextCalibrationDate)}
                        </span>
                      </p>
                      {calLeft >= 0 && calLeft <= 30 ? (
                        <Badge tone="warning">일정 조율 필요</Badge>
                      ) : null}
                    </div>

                    {e.consumable ? (
                      <p className="mt-2 flex items-center gap-2 text-2xs text-inkmuted">
                        <Package size={13} className="shrink-0 text-pine-600" />
                        정기 교체 소모품 · {e.consumable}
                        {nextConsumable ? (
                          <span className="num font-semibold text-inkbody">
                            다음 {formatDate(nextConsumable)} ({dday(nextConsumable)})
                          </span>
                        ) : null}
                      </p>
                    ) : null}

                    {/* 행동 */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="md" onClick={() => request("교정 요청", e)}>
                        <CalendarCheck size={15} />
                        교정 요청
                      </Button>
                      <Button
                        size="md"
                        variant="secondary"
                        onClick={() => request("소모품 요청", e)}
                      >
                        <Package size={15} />
                        소모품 요청
                      </Button>
                      <Button
                        size="md"
                        variant="outline"
                        onClick={() => request("장비 문의", e)}
                      >
                        <MessageSquare size={15} />
                        장비 문의
                      </Button>
                    </div>

                    {/* 이력 펼치기 */}
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : e.id)}
                      aria-expanded={isOpen}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-line py-2.5 text-xs font-semibold text-inkmuted transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50/50 hover:text-pine-700"
                    >
                      장비 이력 {isOpen ? "접기" : "보기"}
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform duration-base",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 space-y-4 border-t border-line pt-4">
                            <div>
                              <p className="text-xs font-bold text-pine-900">운영 이력</p>
                              <ol className="mt-2.5 space-y-2.5 border-l border-line pl-4">
                                {[
                                  { label: "설치 완료", date: e.installedDate, done: true },
                                  {
                                    label: "마지막 교정",
                                    date: e.lastCalibrationDate,
                                    done: true,
                                  },
                                  ...(e.lastConsumableDate
                                    ? [
                                        {
                                          label: "마지막 소모품 교체",
                                          date: e.lastConsumableDate,
                                          done: true,
                                        },
                                      ]
                                    : []),
                                  ...(nextConsumable
                                    ? [
                                        {
                                          label: "소모품 교체 예정",
                                          date: nextConsumable,
                                          done: false,
                                        },
                                      ]
                                    : []),
                                  {
                                    label: "다음 교정 예정",
                                    date: e.nextCalibrationDate,
                                    done: false,
                                  },
                                  {
                                    label:
                                      warrantyLeft > 0 ? "보증 만료 예정" : "보증 만료",
                                    date: e.warrantyEndDate,
                                    done: warrantyLeft <= 0,
                                  },
                                ]
                                  .sort((a, b) => +new Date(a.date) - +new Date(b.date))
                                  .map((h) => (
                                    <li key={h.label} className="relative">
                                      <CircleDot
                                        size={11}
                                        className={cn(
                                          "absolute -left-[1.34rem] top-0.5 bg-ivory-50",
                                          h.done ? "text-pine-600" : "text-inkmuted/50",
                                        )}
                                      />
                                      <div className="flex flex-wrap items-baseline gap-x-2">
                                        <span
                                          className={cn(
                                            "text-xs font-semibold",
                                            h.done ? "text-inkbody" : "text-inkmuted",
                                          )}
                                        >
                                          {h.label}
                                        </span>
                                        <span className="num text-2xs text-inkmuted">
                                          {formatDate(h.date)}
                                        </span>
                                      </div>
                                    </li>
                                  ))}
                              </ol>
                            </div>

                            {/* 준비 중인 항목 — 되는 척하지 않는다 */}
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                              {[
                                {
                                  icon: FileCheck2,
                                  title: "교정성적서 내려받기",
                                  body: "교정 이력에 성적서 파일을 연결하는 작업이 남아 있습니다.",
                                },
                                {
                                  icon: Repeat,
                                  title: "소모품 정기 배송 신청",
                                  body: "교체 주기는 이미 등록되어 있어 출고 연결만 남았습니다.",
                                },
                              ].map((f) => {
                                const Icon = f.icon;
                                return (
                                  <Link
                                    key={f.title}
                                    href="/customer/services"
                                    className="flex items-start gap-2.5 rounded-xl border border-dashed border-line bg-ivory-100/50 p-3.5 transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50/40"
                                  >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ivory-200 text-inkmuted">
                                      <Icon size={15} strokeWidth={1.8} />
                                    </span>
                                    <span className="min-w-0">
                                      <span className="flex flex-wrap items-center gap-1.5">
                                        <span className="text-2xs font-bold text-inkbody">
                                          {f.title}
                                        </span>
                                        <Badge tone="warning">준비 중</Badge>
                                      </span>
                                      <span className="mt-0.5 block text-[0.5625rem] leading-relaxed text-inkmuted">
                                        {f.body}
                                      </span>
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}

      <Reveal delay={0.1}>
        <p className="flex items-start gap-2 rounded-xl bg-ivory-200/60 p-4 text-2xs leading-relaxed text-inkmuted">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-pine-600" />
          장비 정보는 제이랩테크 설치 대장과 연동되어 있습니다. 실제 운영 시에는 납품·설치
          완료 시점에 자동으로 등록됩니다.
        </p>
      </Reveal>

      <RequestDialog
        open={open}
        onClose={() => setOpen(false)}
        initialType={type}
        equipment={target}
        equipmentOptions={myEquipment}
      />
    </div>
  );
}
