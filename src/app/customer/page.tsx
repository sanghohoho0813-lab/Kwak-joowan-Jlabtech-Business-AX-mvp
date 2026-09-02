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
  Package,
  RefreshCcw,
  Ruler,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { RequestDialog, REQUEST_TYPES } from "@/components/customer/request-dialog";
import { RequestStatusBadge } from "@/components/customer/status-badge";
import { SectionHeader, SectionAction } from "@/components/customer/section-header";
import { PlatformJourney } from "@/components/customer/platform-journey";
import { PlatformUpdates } from "@/components/customer/platform-updates";
import { AccountAvatar } from "@/components/customer/account-avatar";
import { useStore } from "@/lib/store-context";
import { useCustomer } from "@/lib/use-customer";
import { repo } from "@/data/repository";
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

/**
 * 요청 유형마다 색을 달리한다.
 * 다섯 개가 전부 초록이면 구분이 안 되고, 화면 전체가 한 톤으로 가라앉는다.
 */
const requestTone: Record<
  RequestType,
  { icon: LucideIcon; chip: string; hover: string }
> = {
  "교정 요청": {
    icon: CalendarCheck,
    chip: "bg-pine-700 text-white",
    hover: "hover:border-pine-600 hover:bg-pine-50",
  },
  "소모품 요청": {
    icon: Package,
    chip: "bg-clay-500 text-white",
    hover: "hover:border-clay-500 hover:bg-clay-100/60",
  },
  "재구매 요청": {
    icon: RefreshCcw,
    chip: "bg-mist-600 text-white",
    hover: "hover:border-mist-600 hover:bg-mist-100",
  },
  "추가 계측 상담": {
    icon: Ruler,
    chip: "bg-sand-600 text-white",
    hover: "hover:border-sand-600 hover:bg-sand-100",
  },
  "장비 문의": {
    icon: MessageSquare,
    chip: "bg-sage-600 text-white",
    hover: "hover:border-sage-600 hover:bg-sage-100",
  },
};

export default function CustomerHomePage() {
  const me = useCustomer();
  const { requests, interests } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<RequestType>("교정 요청");

  const myEquipment = useMemo(
    () => repo.getInstalledEquipment().filter((e) => e.customerId === me.id),
    [me.id],
  );
  const myRequests = useMemo(
    () =>
      requests
        .filter((r) => r.customerId === me.id)
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [requests, me.id],
  );

  const schedule = useMemo(() => buildSchedule(myEquipment), [myEquipment]);

  const calibrationSoon = myEquipment.filter((e) => {
    const d = daysLeft(e.nextCalibrationDate);
    return d >= 0 && d <= 60;
  });
  const openRequests = myRequests.filter((r) => r.status !== "완료");
  const needsAttention = myRequests.filter((r) => r.response && r.status !== "완료");
  const myInterests = interests.filter((i) => i.customerId === me.id).length;

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
      tone: "bg-pine-700 text-white",
      href: "/customer/equipment",
    },
    {
      icon: CalendarCheck,
      label: "곧 교정할 장비",
      value: calibrationSoon.length,
      unit: "대",
      tone: "bg-sand-600 text-white",
      href: "/customer/equipment",
    },
    {
      icon: Inbox,
      label: "진행 중인 요청",
      value: openRequests.length,
      unit: "건",
      tone: "bg-mist-600 text-white",
      href: "/customer/requests",
    },
  ];

  return (
    <div className="space-y-10">
      {/* 인사 — 딥그린 히어로. 첫 화면에 확실한 대비를 준다 */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-pine-900 p-6 text-white shadow-card-hover md:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-pine-700/60 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-sand-500/25 blur-2xl"
          />
          <div className="relative flex flex-wrap items-start gap-4">
            <AccountAvatar
              id={me.id}
              company={me.company}
              className="h-14 w-14 text-xl ring-4 ring-white/15"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-sand-400">
                {me.segment} · {me.region}
              </p>
              <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                {me.company} {me.contactName} 담당자님
              </h1>
              <p className="mt-2 text-base leading-relaxed text-white/80 md:text-lg">
                제이랩테크와 함께 관리 중인 계측장비 {myEquipment.length}대의 현황입니다.
              </p>
            </div>
          </div>

          {/* 사용 흐름 — 히어로 안에 3단계 */}
          <ol className="relative mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {howItWorks.map((h, i) => {
              const Icon = h.icon;
              return (
                <li
                  key={h.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3.5 backdrop-blur-sm"
                >
                  <span className="num flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sand-500 text-base font-bold text-pine-950">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-base font-bold">
                      <Icon size={16} strokeWidth={2} className="shrink-0 text-sand-400" />
                      {h.label}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-white/70">
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
          <Link href="/customer/requests" className="block">
            <div className="flex items-center gap-4 rounded-2xl border-2 border-clay-500 bg-white p-5 shadow-card transition-all duration-base hover:-translate-y-0.5 hover:shadow-card-hover md:p-6">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-clay-500 text-white">
                <MessageCircle size={26} strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-inkstrong">
                  확인하실 답변이 {needsAttention.length}건 있습니다
                </p>
                <p className="clamp-2 mt-1 text-base leading-relaxed text-inkbody">
                  {needsAttention[0].response}
                </p>
              </div>
              <ChevronRight size={24} className="shrink-0 text-clay-600" />
            </div>
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
                  <Card className="h-full border-transparent bg-white hover:-translate-y-0.5 hover:shadow-card-hover">
                    <CardContent className="flex h-full items-center gap-4 p-5">
                      <span
                        className={cn(
                          "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                          s.tone,
                        )}
                      >
                        <Icon size={24} strokeWidth={1.9} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-snug text-inkmuted">
                          {s.label}
                        </p>
                        <p className="num mt-1 text-3xl font-bold leading-none text-inkstrong">
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
        <Card className="border-transparent bg-white">
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
                  const isCal = ev.kind === "정기 교정";
                  return (
                    <li
                      key={ev.key}
                      className={cn(
                        "rounded-2xl border-l-4 bg-cloud p-4",
                        past
                          ? "border-red-500"
                          : urgent
                            ? "border-sand-600"
                            : isCal
                              ? "border-pine-600"
                              : "border-mist-500",
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
                                  : "text-inkstrong",
                            )}
                          >
                            {dday(ev.date)}
                          </span>
                          <span className="num mt-1.5 text-xs text-inkmuted">
                            {formatDate(ev.date).slice(5)}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <Badge size="md" tone={isCal ? "success" : "mist"}>
                            {ev.kind}
                          </Badge>
                          <p className="clamp-2 mt-1.5 text-base font-bold leading-snug text-inkstrong">
                            {ev.detail}
                          </p>
                          <p className="clamp-1 mt-1 flex items-center gap-1.5 text-sm text-inkmuted">
                            <MapPin size={13} className="shrink-0" />
                            {ev.equipment.site}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => openDialog(isCal ? "교정 요청" : "소모품 요청")}
                          className={cn(
                            "hidden h-12 shrink-0 self-center whitespace-nowrap rounded-xl px-6 text-base font-bold text-white shadow-sm transition-colors duration-fast sm:block",
                            isCal
                              ? "bg-pine-700 hover:bg-pine-600"
                              : "bg-mist-600 hover:bg-mist-500",
                          )}
                        >
                          요청하기
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => openDialog(isCal ? "교정 요청" : "소모품 요청")}
                        className={cn(
                          "mt-3 h-12 w-full whitespace-nowrap rounded-xl text-base font-bold text-white shadow-sm transition-colors duration-fast sm:hidden",
                          isCal ? "bg-pine-700 hover:bg-pine-600" : "bg-mist-600 hover:bg-mist-500",
                        )}
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

      {/* 요청하기 — 유형마다 다른 색 */}
      <Reveal delay={0.1} className="scroll-mt-24" id="sec-quick">
        <SectionHeader
          icon={Send}
          title="무엇을 도와드릴까요?"
          desc="누르시면 바로 요청이 접수되고, 담당자가 확인 후 알려드립니다."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REQUEST_TYPES.map((r) => {
            const tone = requestTone[r.type];
            const Icon = tone.icon;
            return (
              <button
                key={r.type}
                type="button"
                onClick={() => openDialog(r.type)}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl border-2 border-transparent bg-white p-5 text-left shadow-card transition-all duration-base hover:-translate-y-0.5 hover:shadow-card-hover",
                  tone.hover,
                )}
              >
                <span
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                    tone.chip,
                  )}
                >
                  <Icon size={24} strokeWidth={1.9} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-inkstrong md:text-lg">
                    {r.type}
                  </span>
                  <span className="clamp-2 mt-1 block text-sm leading-snug text-inkbody">
                    {r.hint}
                  </span>
                </span>
                <ArrowRight
                  size={20}
                  className="shrink-0 text-inkmuted transition-transform duration-base group-hover:translate-x-1 group-hover:text-inkstrong"
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
          <Card className="border-dashed bg-white">
            <CardContent className="py-12 text-center">
              <p className="text-base text-inkmuted">아직 보내신 요청이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {myRequests.slice(0, 3).map((r) => (
              <Link key={r.id} href="/customer/requests" className="block">
                <Card className="border-transparent bg-white hover:-translate-y-0.5 hover:shadow-card-hover">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="clamp-2 min-w-0 flex-1 text-base font-bold text-inkstrong">
                        {r.title}
                      </p>
                      <RequestStatusBadge status={r.status} size="md" />
                    </div>
                    <p className="clamp-1 mt-2 text-sm text-inkmuted">
                      {r.requestType} · {formatDate(r.createdAt)} 접수
                    </p>
                    {r.response ? (
                      <p className="clamp-2 mt-3 rounded-xl border-l-4 border-mist-500 bg-mist-100 p-3.5 text-sm leading-relaxed text-inkstrong">
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
        <PlatformJourney interestCount={myInterests} />
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
