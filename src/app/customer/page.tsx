"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Wrench,
  CalendarCheck,
  Inbox,
  Package,
  ChevronRight,
  MapPin,
  ArrowRight,
  MessageCircle,
  CalendarClock,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { RequestDialog, REQUEST_TYPES } from "@/components/customer/request-dialog";
import { RequestStatusBadge } from "@/components/customer/status-badge";
import { useStore } from "@/lib/store-context";
import { repo } from "@/data/repository";
import { demoCustomer } from "@/data/mock/customer-portal";
import { cn, formatDate, dday, daysLeft, addMonths } from "@/lib/utils";
import type { RequestType, EquipmentStatus, InstalledEquipment } from "@/data/types";

const equipmentTone: Record<EquipmentStatus, "success" | "warning" | "danger" | "neutral"> = {
  "정상 가동": "success",
  "교정 필요": "warning",
  "점검 요청": "danger",
  "보증 만료": "neutral",
};

interface ScheduleEvent {
  key: string;
  date: string;
  kind: "정기 교정" | "소모품 교체";
  equipment: InstalledEquipment;
  detail: string;
}

/** 교정 예정일과 소모품 교체 예상일을 하나의 일정으로 합친다 */
function buildSchedule(equipment: InstalledEquipment[]): ScheduleEvent[] {
  const events: ScheduleEvent[] = [];
  for (const e of equipment) {
    events.push({
      key: `${e.id}-cal`,
      date: e.nextCalibrationDate,
      kind: "정기 교정",
      equipment: e,
      detail: `${e.itemName} ${e.model}`,
    });
    if (e.consumableCycleMonths && e.lastConsumableDate) {
      events.push({
        key: `${e.id}-con`,
        date: addMonths(e.lastConsumableDate, e.consumableCycleMonths),
        kind: "소모품 교체",
        equipment: e,
        detail: e.consumable ?? "정기 교체 소모품",
      });
    }
  }
  return events
    .filter((ev) => daysLeft(ev.date) >= -30)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

export default function CustomerHomePage() {
  const { requests } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<RequestType>("교정 요청");

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

  const schedule = useMemo(() => buildSchedule(myEquipment), [myEquipment]);

  const calibrationSoon = myEquipment.filter((e) => {
    const d = daysLeft(e.nextCalibrationDate);
    return d >= 0 && d <= 60;
  });
  const openRequests = myRequests.filter((r) => r.status !== "완료");
  const needsAttention = myRequests.filter((r) => r.response && r.status !== "완료");
  const consumableItems = myEquipment.filter((e) => e.consumableCycleMonths);

  const openDialog = (t: RequestType) => {
    setDialogType(t);
    setDialogOpen(true);
  };

  const summary = [
    {
      icon: Wrench,
      label: "관리 중 장비",
      value: `${myEquipment.length}대`,
      tone: "bg-pine-50 text-pine-700",
      href: "/customer/equipment",
    },
    {
      icon: CalendarCheck,
      label: "60일 내 교정 예정",
      value: `${calibrationSoon.length}대`,
      tone: "bg-sand-100 text-sand-600",
      href: "/customer/equipment",
    },
    {
      icon: Inbox,
      label: "진행 중 요청",
      value: `${openRequests.length}건`,
      tone: "bg-sage-100 text-sage-600",
      href: "/customer/requests",
    },
    {
      icon: Package,
      label: "정기 교체 소모품",
      value: `${consumableItems.length}종`,
      tone: "bg-mist-100 text-mist-600",
      href: "/customer/services",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 인사 */}
      <Reveal>
        <h1 className="text-xl font-bold tracking-tight text-pine-900 md:text-2xl">
          {demoCustomer.company} {demoCustomer.contactName} 담당자님
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-inkmuted md:text-base">
          제이랩테크와 함께 관리 중인 계측장비 현황입니다.
          <br className="hidden sm:block" /> 교정·소모품·추가 계측이 필요하시면 아래에서 바로
          요청하실 수 있습니다.
        </p>
      </Reveal>

      {/* 확인이 필요한 요청 — 답변이 도착한 건 */}
      {needsAttention.length > 0 ? (
        <Reveal delay={0.02} className="scroll-mt-20" id="sec-attention">
          <Link href="/customer/requests" className="block">
            <Card className="border-sand-400/60 bg-sand-100/40 hover:-translate-y-0.5 hover:shadow-card-hover">
              <CardContent className="flex items-start gap-3 p-4 md:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand-500 text-white">
                  <MessageCircle size={18} strokeWidth={1.9} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-pine-900">
                    확인이 필요한 답변 {needsAttention.length}건
                  </p>
                  <p className="clamp-2 mt-0.5 text-2xs leading-relaxed text-inkbody">
                    {needsAttention[0].response}
                  </p>
                </div>
                <ChevronRight size={17} className="mt-1 shrink-0 text-sand-600" />
              </CardContent>
            </Card>
          </Link>
        </Reveal>
      ) : null}

      {/* 핵심 요약 */}
      <Stagger className="grid scroll-mt-20 grid-cols-2 gap-3 lg:grid-cols-4" id="sec-summary">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <StaggerItem key={s.label}>
              <Link href={s.href} className="block h-full">
                <Card className="h-full hover:-translate-y-0.5 hover:shadow-card-hover">
                  <CardContent className="flex h-full flex-col justify-between gap-3 p-4">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        s.tone,
                      )}
                    >
                      <Icon size={18} strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0">
                      <p className="clamp-2 text-2xs leading-snug text-inkmuted">{s.label}</p>
                      <p className="num mt-0.5 text-xl font-bold text-pine-900">{s.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* 다가오는 일정 */}
      <Reveal delay={0.06} className="scroll-mt-20" id="sec-schedule">
        <Card>
          <CardContent className="p-5 md:p-6">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <CalendarClock size={17} className="shrink-0 text-pine-700" />
              <p className="text-base font-bold text-pine-900">다가오는 일정</p>
              <Badge tone="outline" className="ml-auto">
                장비 주기 기준 자동 계산
              </Badge>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-inkmuted">
              등록된 교정 주기와 소모품 교체 주기로 계산한 예정일입니다.
            </p>

            {schedule.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line py-8 text-center text-sm text-inkmuted">
                예정된 일정이 없습니다.
              </p>
            ) : (
              <ol className="relative space-y-3 border-l border-line pl-5">
                {schedule.slice(0, 5).map((ev) => {
                  const left = daysLeft(ev.date);
                  const urgent = left >= 0 && left <= 30;
                  const past = left < 0;
                  return (
                    <li key={ev.key} className="relative">
                      <span
                        className={cn(
                          "absolute -left-[1.6875rem] top-2 h-2.5 w-2.5 rounded-full border-2 border-ivory-50",
                          past
                            ? "bg-red-500"
                            : urgent
                              ? "bg-clay-500"
                              : ev.kind === "소모품 교체"
                                ? "bg-mist-500"
                                : "bg-pine-600",
                        )}
                      />
                      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5 rounded-xl border border-line/70 bg-ivory-100/60 p-3.5">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge tone={ev.kind === "정기 교정" ? "success" : "clay"}>
                              {ev.kind}
                            </Badge>
                            <span className="num text-2xs font-semibold text-inkbody">
                              {formatDate(ev.date)}
                            </span>
                            <span
                              className={cn(
                                "num text-2xs font-bold",
                                past
                                  ? "text-red-600"
                                  : urgent
                                    ? "text-clay-600"
                                    : "text-inkmuted",
                              )}
                            >
                              {dday(ev.date)}
                            </span>
                          </div>
                          <p className="clamp-1 mt-1 text-xs font-semibold text-pine-900">
                            {ev.detail}
                          </p>
                          <p className="clamp-1 mt-0.5 flex items-center gap-1 text-2xs text-inkmuted">
                            <MapPin size={10} className="shrink-0" />
                            {ev.equipment.site}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            openDialog(ev.kind === "정기 교정" ? "교정 요청" : "소모품 요청")
                          }
                          className="h-8 shrink-0 whitespace-nowrap rounded-lg border border-line bg-ivory-50 px-3 text-2xs font-semibold text-pine-700 transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50"
                        >
                          요청하기
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        </Card>
      </Reveal>

      {/* 빠른 요청 */}
      <Reveal delay={0.1} className="scroll-mt-20" id="sec-quick">
        <Card>
          <CardContent className="p-5 md:p-6">
            <p className="text-base font-bold text-pine-900">무엇을 도와드릴까요?</p>
            <p className="mt-1 text-xs text-inkmuted">
              요청을 보내시면 제이랩테크 담당자가 확인하고 진행 상황을 알려드립니다.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {REQUEST_TYPES.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.type}
                    type="button"
                    onClick={() => openDialog(r.type)}
                    className="group flex min-h-[4.5rem] items-center gap-3 rounded-xl border border-line bg-ivory-100/60 p-4 text-left transition-all duration-base hover:-translate-y-0.5 hover:border-pine-100 hover:bg-pine-50/60 hover:shadow-card"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700 transition-colors duration-base group-hover:bg-pine-700 group-hover:text-white">
                      <Icon size={19} strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-pine-900">{r.type}</span>
                      <span className="clamp-1 block text-2xs text-inkmuted">{r.hint}</span>
                    </span>
                    <ArrowRight
                      size={16}
                      className="shrink-0 text-inkmuted transition-transform duration-base group-hover:translate-x-0.5 group-hover:text-pine-700"
                    />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* 최근 요청 */}
      <Reveal delay={0.14} className="scroll-mt-20" id="sec-recent">
        <Card>
          <CardContent className="p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-base font-bold text-pine-900">최근 요청</p>
              <Link
                href="/customer/requests"
                className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap text-xs font-semibold text-pine-700 transition-colors duration-fast hover:text-pine-600"
              >
                전체 보기 <ChevronRight size={14} />
              </Link>
            </div>
            {myRequests.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line py-8 text-center text-sm text-inkmuted">
                아직 보내신 요청이 없습니다.
              </p>
            ) : (
              <div className="space-y-2.5">
                {myRequests.slice(0, 3).map((r) => (
                  <Link
                    key={r.id}
                    href="/customer/requests"
                    className="block rounded-xl border border-line/70 bg-ivory-100/60 p-4 transition-colors duration-fast hover:border-pine-100"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="clamp-2 min-w-0 flex-1 text-sm font-bold text-pine-900">
                        {r.title}
                      </p>
                      <RequestStatusBadge status={r.status} />
                    </div>
                    <p className="clamp-1 mt-1 text-2xs text-inkmuted">
                      {r.requestType} · {formatDate(r.createdAt)} 접수
                    </p>
                    {r.response ? (
                      <p className="clamp-2 mt-2 rounded-lg bg-pine-50/70 p-2.5 text-2xs leading-relaxed text-pine-900">
                        {r.response}
                      </p>
                    ) : null}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Reveal>

      {/* 관리 중 장비 */}
      <Reveal delay={0.18} className="scroll-mt-20" id="sec-equipment">
        <Card>
          <CardContent className="p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-base font-bold text-pine-900">관리 중 장비</p>
              <Link
                href="/customer/equipment"
                className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap text-xs font-semibold text-pine-700 transition-colors duration-fast hover:text-pine-600"
              >
                전체 보기 <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-2.5">
              {myEquipment.slice(0, 3).map((e) => (
                <Link
                  key={e.id}
                  href="/customer/equipment"
                  className="flex items-center gap-3 rounded-xl border border-line/70 bg-ivory-100/60 p-4 transition-all duration-base hover:-translate-y-0.5 hover:border-pine-100 hover:shadow-card"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                    <Wrench size={19} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="clamp-1 text-sm font-bold text-pine-900">
                      {e.itemName} {e.model}
                    </p>
                    <p className="clamp-1 mt-0.5 flex items-center gap-1 text-2xs text-inkmuted">
                      <MapPin size={11} className="shrink-0" />
                      {e.site}
                    </p>
                    <p className="num clamp-1 mt-0.5 text-2xs text-inkmuted">
                      다음 교정 {formatDate(e.nextCalibrationDate)} ·{" "}
                      {dday(e.nextCalibrationDate)}
                    </p>
                  </div>
                  <Badge tone={equipmentTone[e.status]}>{e.status}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* 서비스 확장 안내 */}
      <Reveal delay={0.22} className="scroll-mt-20" id="sec-services">
        <Link href="/customer/services" className="block">
          <Card className="border-pine-100 bg-pine-50/50 hover:-translate-y-0.5 hover:shadow-card-hover">
            <CardContent className="flex items-start gap-3.5 p-5 md:p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-800 text-sand-400">
                <LayoutGrid size={19} strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-bold text-pine-900">
                    제이랩테크가 준비하고 있는 서비스
                  </p>
                  <Badge tone="clay">
                    <Sparkles size={11} className="mr-1" />
                    준비 중 4 · 검토 중 4
                  </Badge>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-inkbody">
                  소모품 정기 배송, 연간 관리 계약, 성적서 디지털 발급, 계측기 단기 임대까지
                  — 지금 쌓이는 장비·요청 데이터 위에서 어떻게 이어지는지 정리했습니다.
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-pine-700">
                  서비스 전체 보기
                  <ArrowRight size={14} />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </Reveal>

      <RequestDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialType={dialogType}
        equipmentOptions={myEquipment}
      />
    </div>
  );
}
