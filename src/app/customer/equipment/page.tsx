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
    if (filter === "교정 임박") return daysLeft(e.nextCalibrationDate) <= 60;
    if (filter === "소모품 있음") return Boolean(e.consumableCycleMonths);
    if (filter === "보증 중") return daysLeft(e.warrantyEndDate) > 0;
    return true;
  };

  const visible = myEquipment.filter(matches);

  const filterCount = (f: Filter) =>
    f === "전체"
      ? myEquipment.length
      : myEquipment.filter((e) => {
          if (f === "교정 임박") return daysLeft(e.nextCalibrationDate) <= 60;
          if (f === "소모품 있음") return Boolean(e.consumableCycleMonths);
          return daysLeft(e.warrantyEndDate) > 0;
        }).length;

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-pine-900 md:text-3xl">
          내 장비
        </h1>
        <p className="mt-3 text-base leading-relaxed text-inkbody md:text-lg">
          제이랩테크를 통해 도입하신 장비 {myEquipment.length}대입니다. 교정 시점을 확인하고
          필요한 요청을 바로 보내실 수 있습니다.
        </p>
      </Reveal>

      {/* 검색·필터 */}
      <Reveal delay={0.04} className="scroll-mt-24" id="sec-search">
        <div className="space-y-3">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-inkmuted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="장비 이름으로 찾기"
              aria-label="장비 검색"
              className="h-14 w-full rounded-2xl border border-line bg-ivory-50 pl-12 pr-4 text-base text-inkbody shadow-card placeholder:text-inkmuted/70 focus:border-pine-600/50 focus:outline-none focus:ring-2 focus:ring-pine-600/15"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "h-11 whitespace-nowrap rounded-full border px-5 text-sm font-bold transition-colors duration-fast",
                  filter === f
                    ? "border-pine-700 bg-pine-700 text-white shadow-sm"
                    : "border-line bg-ivory-50 text-inkbody hover:border-pine-200 hover:bg-pine-50",
                )}
              >
                {f}
                <span className="num ml-2 opacity-70">{filterCount(f)}</span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {visible.length === 0 ? (
        <Reveal delay={0.08}>
          <Card className="border-dashed">
            <CardContent className="px-6 py-14 text-center">
              <p className="text-lg font-bold text-pine-900">찾으시는 장비가 없습니다</p>
              <p className="mt-2 text-base text-inkmuted">검색어나 조건을 바꿔 보세요.</p>
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
              <StaggerItem key={e.id} id={`eq-${e.id}`} className="scroll-mt-24">
                <Card className={cn(isOpen && "shadow-card-hover")}>
                  <CardContent className="p-5 md:p-6">
                    {/* 이름 · 위치 · 상태 */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-4">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pine-50 text-pine-700">
                          <Wrench size={26} strokeWidth={1.9} />
                        </span>
                        <div className="min-w-0">
                          <p className="clamp-2 text-lg font-bold leading-snug text-pine-900 md:text-xl">
                            {e.itemName}{" "}
                            <span className="font-semibold text-inkmuted">{e.model}</span>
                          </p>
                          <p className="clamp-1 mt-1.5 flex items-center gap-1.5 text-base text-inkmuted">
                            <MapPin size={15} className="shrink-0" />
                            {e.site}
                          </p>
                        </div>
                      </div>
                      <Badge size="md" tone={equipmentTone[e.status]}>
                        {e.status}
                      </Badge>
                    </div>

                    {/* 다음 교정 — 이 카드에서 가장 중요한 정보 */}
                    <div
                      className={cn(
                        "mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border p-4",
                        calLeft >= 0 && calLeft <= 30
                          ? "border-sand-400/60 bg-sand-100/50"
                          : "border-line bg-ivory-100/70",
                      )}
                    >
                      <CalendarCheck
                        size={22}
                        className={cn(
                          "shrink-0",
                          calLeft >= 0 && calLeft <= 30 ? "text-sand-600" : "text-pine-600",
                        )}
                      />
                      <p className="min-w-0 flex-1 text-base font-semibold text-inkbody">
                        다음 교정{" "}
                        <span className="num font-bold text-pine-900">
                          {formatDate(e.nextCalibrationDate)}
                        </span>
                        <span
                          className={cn(
                            "num ml-2 font-bold",
                            calLeft >= 0 && calLeft <= 30 ? "text-sand-600" : "text-inkmuted",
                          )}
                        >
                          {dday(e.nextCalibrationDate)}
                        </span>
                      </p>
                      {calLeft >= 0 && calLeft <= 30 ? (
                        <Badge size="md" tone="warning">
                          일정 조율 필요
                        </Badge>
                      ) : null}
                    </div>

                    {e.consumable ? (
                      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-inkbody">
                        <Package size={17} className="shrink-0 text-mist-600" />
                        <span className="font-semibold">{e.consumable}</span>
                        {nextConsumable ? (
                          <span className="num text-inkmuted">
                            다음 교체 {formatDate(nextConsumable)} ({dday(nextConsumable)})
                          </span>
                        ) : null}
                      </p>
                    ) : null}

                    {/* 요청 버튼 */}
                    <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      <Button size="xl" onClick={() => request("교정 요청", e)}>
                        <CalendarCheck size={18} />
                        교정 요청
                      </Button>
                      <Button
                        size="xl"
                        variant="secondary"
                        onClick={() => request("소모품 요청", e)}
                      >
                        <Package size={18} />
                        소모품 요청
                      </Button>
                      <Button
                        size="xl"
                        variant="outline"
                        onClick={() => request("장비 문의", e)}
                      >
                        <MessageSquare size={18} />
                        문의하기
                      </Button>
                    </div>

                    {/* 자세히 */}
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : e.id)}
                      aria-expanded={isOpen}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-inkmuted transition-colors duration-fast hover:bg-ivory-200/70 hover:text-pine-700"
                    >
                      {isOpen ? "접기" : "설치 정보·이력 보기"}
                      <ChevronDown
                        size={17}
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
                          <div className="mt-2 space-y-5 border-t border-line pt-5">
                            {/* 설치 정보 */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl bg-ivory-100/70 p-4 sm:grid-cols-3">
                              {[
                                { label: "설치일", value: formatDate(e.installedDate) },
                                {
                                  label: "보증",
                                  value:
                                    warrantyLeft > 0
                                      ? `${formatDate(e.warrantyEndDate)}까지`
                                      : "보증 종료",
                                },
                                { label: "제품 번호", value: e.serial },
                              ].map((d) => (
                                <div key={d.label} className="min-w-0">
                                  <p className="text-sm text-inkmuted">{d.label}</p>
                                  <p className="num clamp-1 mt-1 text-base font-bold text-inkbody">
                                    {d.value}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* 이력 */}
                            <div>
                              <p className="text-base font-bold text-pine-900">운영 이력</p>
                              <ol className="mt-3 space-y-3 border-l-2 border-line pl-5">
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
                                    label: warrantyLeft > 0 ? "보증 만료 예정" : "보증 만료",
                                    date: e.warrantyEndDate,
                                    done: warrantyLeft <= 0,
                                  },
                                ]
                                  .sort((a, b) => +new Date(a.date) - +new Date(b.date))
                                  .map((h) => (
                                    <li key={h.label} className="relative">
                                      <CircleDot
                                        size={14}
                                        className={cn(
                                          "absolute -left-[1.72rem] top-0.5 bg-ivory-50",
                                          h.done ? "text-pine-600" : "text-inkmuted/50",
                                        )}
                                      />
                                      <div className="flex flex-wrap items-baseline gap-x-2.5">
                                        <span
                                          className={cn(
                                            "text-base font-semibold",
                                            h.done ? "text-inkbody" : "text-inkmuted",
                                          )}
                                        >
                                          {h.label}
                                        </span>
                                        <span className="num text-sm text-inkmuted">
                                          {formatDate(h.date)}
                                        </span>
                                      </div>
                                    </li>
                                  ))}
                              </ol>
                            </div>

                            {/* 준비 중 — 되는 척하지 않는다 */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {[
                                {
                                  icon: FileCheck2,
                                  title: "교정성적서 내려받기",
                                  body: "성적서 파일을 연결하는 작업이 남아 있습니다.",
                                },
                                {
                                  icon: Repeat,
                                  title: "소모품 정기 배송",
                                  body: "교체 주기는 이미 등록되어 있습니다.",
                                },
                              ].map((f) => {
                                const Icon = f.icon;
                                return (
                                  <Link
                                    key={f.title}
                                    href="/customer/services"
                                    className="flex items-start gap-3 rounded-2xl border border-dashed border-clay-400/50 bg-clay-100/40 p-4 transition-colors duration-fast hover:bg-clay-100/70"
                                  >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ivory-50 text-clay-600">
                                      <Icon size={18} strokeWidth={1.9} />
                                    </span>
                                    <span className="min-w-0">
                                      <span className="flex flex-wrap items-center gap-2">
                                        <span className="text-base font-bold text-pine-900">
                                          {f.title}
                                        </span>
                                        <Badge tone="clay">준비 중</Badge>
                                      </span>
                                      <span className="mt-1 block text-sm leading-snug text-inkmuted">
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
        <p className="flex items-start gap-2.5 rounded-2xl bg-ivory-200/60 p-4 text-sm leading-relaxed text-inkmuted">
          <ShieldCheck size={17} className="mt-0.5 shrink-0 text-pine-600" />
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
