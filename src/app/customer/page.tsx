"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Wrench,
  CalendarCheck,
  Inbox,
  ChevronRight,
  MapPin,
  ArrowRight,
  MessageCircle,
  CalendarClock,
  Send,
  ListChecks,
  Route,
  Megaphone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { RequestDialog, REQUEST_TYPES } from "@/components/customer/request-dialog";
import { RequestStatusBadge } from "@/components/customer/status-badge";
import { SectionHeader, SectionAction } from "@/components/customer/section-header";
import { PlatformJourney } from "@/components/customer/platform-journey";
import { PlatformUpdates } from "@/components/customer/platform-updates";
import { useStore } from "@/lib/store-context";
import { repo } from "@/data/repository";
import { demoCustomer } from "@/data/mock/customer-portal";
import { cn, formatDate, dday, daysLeft, addMonths } from "@/lib/utils";
import type { RequestType, InstalledEquipment } from "@/data/types";

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

/** 이 화면을 처음 보는 사람에게 흐름을 먼저 알려준다 */
const howItWorks = [
  { icon: Wrench, label: "내 장비 확인", desc: "교정 시점이 언제인지 봅니다" },
  { icon: Send, label: "필요한 것 요청", desc: "버튼 하나로 보냅니다" },
  { icon: ListChecks, label: "진행 상황 확인", desc: "답변이 오면 알려드립니다" },
];

export default function CustomerHomePage() {
  const { requests, interests } = useStore();
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

  const openDialog = (t: RequestType) => {
    setDialogType(t);
    setDialogOpen(true);
  };

  /* 숫자는 3개까지만 — 많을수록 무엇이 중요한지 흐려진다 */
  const summary = [
    {
      icon: Wrench,
      label: "관리 중인 장비",
      value: myEquipment.length,
      unit: "대",
      tone: "bg-pine-50 text-pine-700",
      href: "/customer/equipment",
    },
    {
      icon: CalendarCheck,
      label: "곧 교정할 장비",
      value: calibrationSoon.length,
      unit: "대",
      tone: "bg-sand-100 text-sand-600",
      href: "/customer/equipment",
    },
    {
      icon: Inbox,
      label: "진행 중인 요청",
      value: openRequests.length,
      unit: "건",
      tone: "bg-mist-100 text-mist-600",
      href: "/customer/requests",
    },
  ];

  return (
    <div className="space-y-10">
      {/* 인사 */}
      <Reveal>
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-pine-900 md:text-3xl">
          {demoCustomer.company} {demoCustomer.contactName} 담당자님
        </h1>
        <p className="mt-3 text-base leading-relaxed text-inkbody md:text-lg">
          제이랩테크와 함께 관리 중인 계측장비 현황입니다.
        </p>
      </Reveal>

      {/* 사용 흐름 — 3단계 */}
      <Reveal delay={0.02}>
        <div className="rounded-2xl border border-line bg-ivory-100/70 p-4 md:p-5">
          <p className="mb-3 text-sm font-bold text-inkmuted">이렇게 사용하시면 됩니다</p>
          <ol className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {howItWorks.map((h, i) => {
              const Icon = h.icon;
              return (
                <li
                  key={h.label}
                  className="flex items-center gap-3 rounded-xl bg-ivory-50 p-3.5"
                >
                  <span className="num flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pine-800 text-base font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-base font-bold text-pine-900">
                      <Icon size={16} strokeWidth={2} className="shrink-0 text-pine-600" />
                      {h.label}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-inkmuted">
                      {h.desc}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </Reveal>

      {/* 확인이 필요한 답변 */}
      {needsAttention.length > 0 ? (
        <Reveal delay={0.04} className="scroll-mt-24" id="sec-attention">
          <SectionHeader
            icon={MessageCircle}
            tone="clay"
            title="확인하실 답변이 있습니다"
            desc="제이랩테크가 보내드린 내용입니다."
          />
          <Link href="/customer/requests" className="block">
            <Card className="border-clay-400/60 bg-clay-100/50 hover:-translate-y-0.5 hover:shadow-card-hover">
              <CardContent className="flex items-center gap-4 p-5 md:p-6">
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-pine-900">
                    답변 {needsAttention.length}건이 도착했습니다
                  </p>
                  <p className="clamp-2 mt-1.5 text-sm leading-relaxed text-inkbody">
                    {needsAttention[0].response}
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clay-500 text-white">
                  <ChevronRight size={20} />
                </span>
              </CardContent>
            </Card>
          </Link>
        </Reveal>
      ) : null}

      {/* 현황 요약 */}
      <Reveal delay={0.06} className="scroll-mt-24" id="sec-summary">
        <SectionHeader icon={ListChecks} title="한눈에 보기" />
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {summary.map((s) => {
            const Icon = s.icon;
            return (
              <StaggerItem key={s.label}>
                <Link href={s.href} className="block h-full">
                  <Card className="h-full hover:-translate-y-0.5 hover:shadow-card-hover">
                    <CardContent className="flex h-full items-center gap-4 p-5">
                      <span
                        className={cn(
                          "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                          s.tone,
                        )}
                      >
                        <Icon size={24} strokeWidth={1.9} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-snug text-inkmuted">
                          {s.label}
                        </p>
                        <p className="num mt-1 text-3xl font-bold leading-none text-pine-900">
                          {s.value}
                          <span className="ml-1 text-base font-semibold text-inkmuted">
                            {s.unit}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Reveal>

      {/* 다가오는 일정 */}
      <Reveal delay={0.08} className="scroll-mt-24" id="sec-schedule">
        <SectionHeader
          icon={CalendarClock}
          tone="sand"
          title="다가오는 일정"
          desc="장비에 등록된 주기로 계산한 예정일입니다."
          action={
            <Link href="/customer/equipment">
              <SectionAction>
                전체 보기 <ChevronRight size={15} />
              </SectionAction>
            </Link>
          }
        />
        <Card>
          <CardContent className="p-4 md:p-5">
            {schedule.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line py-10 text-center text-base text-inkmuted">
                예정된 일정이 없습니다.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {schedule.slice(0, 4).map((ev) => {
                  const left = daysLeft(ev.date);
                  const urgent = left >= 0 && left <= 30;
                  const past = left < 0;
                  return (
                    <li
                      key={ev.key}
                      className={cn(
                        "rounded-2xl border p-4",
                        past
                          ? "border-red-200 bg-red-50/50"
                          : urgent
                            ? "border-sand-400/50 bg-sand-100/40"
                            : "border-line bg-ivory-100/60",
                      )}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* 남은 일수를 가장 크게 */}
                        <div className="flex w-[3.75rem] shrink-0 flex-col items-center">
                          <span
                            className={cn(
                              "num text-xl font-bold leading-none",
                              past
                                ? "text-red-600"
                                : urgent
                                  ? "text-sand-600"
                                  : "text-pine-800",
                            )}
                          >
                            {dday(ev.date)}
                          </span>
                          <span className="num mt-1.5 text-xs text-inkmuted">
                            {formatDate(ev.date).slice(5)}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <Badge
                            size="md"
                            tone={ev.kind === "정기 교정" ? "success" : "mist"}
                          >
                            {ev.kind}
                          </Badge>
                          <p className="clamp-2 mt-1.5 text-base font-bold leading-snug text-pine-900">
                            {ev.detail}
                          </p>
                          <p className="clamp-1 mt-1 flex items-center gap-1.5 text-sm text-inkmuted">
                            <MapPin size={13} className="shrink-0" />
                            {ev.equipment.site}
                          </p>
                        </div>

                        {/* 넓은 화면에서는 오른쪽에 붙인다 */}
                        <button
                          type="button"
                          onClick={() =>
                            openDialog(ev.kind === "정기 교정" ? "교정 요청" : "소모품 요청")
                          }
                          className="hidden h-12 shrink-0 self-center whitespace-nowrap rounded-xl bg-pine-700 px-6 text-base font-bold text-white shadow-sm transition-colors duration-fast hover:bg-pine-600 sm:block"
                        >
                          요청하기
                        </button>
                      </div>

                      {/* 좁은 화면에서는 아래에 꽉 차게 */}
                      <button
                        type="button"
                        onClick={() =>
                          openDialog(ev.kind === "정기 교정" ? "교정 요청" : "소모품 요청")
                        }
                        className="mt-3 h-12 w-full whitespace-nowrap rounded-xl bg-pine-700 text-base font-bold text-white shadow-sm transition-colors duration-fast hover:bg-pine-600 sm:hidden"
                      >
                        요청하기
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </Reveal>

      {/* 요청하기 */}
      <Reveal delay={0.1} className="scroll-mt-24" id="sec-quick">
        <SectionHeader
          icon={Send}
          title="무엇을 도와드릴까요?"
          desc="누르시면 바로 요청이 접수되고, 담당자가 확인 후 알려드립니다."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {REQUEST_TYPES.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.type}
                type="button"
                onClick={() => openDialog(r.type)}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-ivory-50 p-5 text-left shadow-card transition-all duration-base hover:-translate-y-0.5 hover:border-pine-200 hover:bg-pine-50/60 hover:shadow-card-hover"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pine-50 text-pine-700 transition-colors duration-base group-hover:bg-pine-700 group-hover:text-white">
                  <Icon size={24} strokeWidth={1.9} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-pine-900 md:text-lg">
                    {r.type}
                  </span>
                  <span className="clamp-2 mt-1 block text-sm leading-snug text-inkmuted">
                    {r.hint}
                  </span>
                </span>
                <ArrowRight
                  size={20}
                  className="shrink-0 text-inkmuted transition-transform duration-base group-hover:translate-x-1 group-hover:text-pine-700"
                />
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* 내 요청 */}
      <Reveal delay={0.12} className="scroll-mt-24" id="sec-recent">
        <SectionHeader
          icon={Inbox}
          tone="mist"
          title="보내신 요청"
          desc="어디까지 진행됐는지 확인하실 수 있습니다."
          action={
            <Link href="/customer/requests">
              <SectionAction>
                전체 보기 <ChevronRight size={15} />
              </SectionAction>
            </Link>
          }
        />
        {myRequests.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-base text-inkmuted">아직 보내신 요청이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {myRequests.slice(0, 3).map((r) => (
              <Link key={r.id} href="/customer/requests" className="block">
                <Card className="hover:-translate-y-0.5 hover:shadow-card-hover">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="clamp-2 min-w-0 flex-1 text-base font-bold text-pine-900">
                        {r.title}
                      </p>
                      <RequestStatusBadge status={r.status} size="md" />
                    </div>
                    <p className="clamp-1 mt-2 text-sm text-inkmuted">
                      {r.requestType} · {formatDate(r.createdAt)} 접수
                    </p>
                    {r.response ? (
                      <p className="clamp-2 mt-3 rounded-xl bg-pine-50/80 p-3.5 text-sm leading-relaxed text-pine-900">
                        {r.response}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Reveal>

      {/* 이 플랫폼이 가는 방향 */}
      <Reveal delay={0.14} className="scroll-mt-24" id="sec-journey">
        <SectionHeader
          icon={Route}
          tone="clay"
          title="앞으로 이렇게 넓어집니다"
          desc="지금 되는 것과 준비 중인 것을 단계로 정리했습니다."
          action={
            <Link href="/customer/services">
              <SectionAction>
                서비스 전체 보기 <ChevronRight size={15} />
              </SectionAction>
            </Link>
          }
        />
        <PlatformJourney
          interestCount={interests.filter((i) => i.customerId === demoCustomer.id).length}
        />
      </Reveal>

      {/* 업데이트 소식 */}
      <Reveal delay={0.16} className="scroll-mt-24" id="sec-updates">
        <SectionHeader
          icon={Megaphone}
          tone="mist"
          title="업데이트 소식"
          desc="이 화면에 새로 생긴 것과, 다음에 열릴 것입니다."
        />
        <PlatformUpdates limit={3} />
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
