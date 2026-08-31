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
  LineChart,
  Radio,
  FileClock,
  Gauge,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { RequestDialog, REQUEST_TYPES } from "@/components/customer/request-dialog";
import { RequestStatusBadge } from "@/components/customer/status-badge";
import { useStore } from "@/lib/store-context";
import { repo } from "@/data/repository";
import { demoCustomer } from "@/data/mock/customer-portal";
import { cn, formatDate, dday, daysLeft } from "@/lib/utils";
import type { RequestType, EquipmentStatus } from "@/data/types";

const equipmentTone: Record<EquipmentStatus, "success" | "warning" | "danger" | "neutral"> = {
  "정상 가동": "success",
  "교정 필요": "warning",
  "점검 요청": "danger",
  "보증 만료": "neutral",
};

/** 3단계에서 검토 예정인 서비스 — 클릭 불가 */
const futureServices = [
  { icon: LineChart, title: "계측 데이터 리포트", body: "측정값 추이와 이상 구간을 정기 리포트로" },
  { icon: Radio, title: "원격 계측 모니터링", body: "현장 방문 없이 장비 상태 확인" },
  { icon: FileClock, title: "정기관리 계약", body: "교정·소모품을 연간 단위로 자동 관리" },
  { icon: Gauge, title: "예지보전 분석", body: "고장 전에 미리 신호를 잡아내는 분석" },
];

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

  const calibrationSoon = myEquipment.filter((e) => {
    const d = daysLeft(e.nextCalibrationDate);
    return d >= 0 && d <= 30;
  });
  const openRequests = myRequests.filter((r) => r.status !== "완료");
  const consumableItems = myEquipment.filter((e) => e.consumable);

  const openDialog = (t: RequestType) => {
    setDialogType(t);
    setDialogOpen(true);
  };

  const summary = [
    { icon: Wrench, label: "등록 장비", value: `${myEquipment.length}대`, tone: "bg-pine-50 text-pine-700" },
    {
      icon: CalendarCheck,
      label: "30일 내 교정 예정",
      value: `${calibrationSoon.length}대`,
      tone: "bg-sand-100 text-sand-600",
    },
    { icon: Inbox, label: "처리 중 요청", value: `${openRequests.length}건`, tone: "bg-sage-100 text-sage-600" },
    {
      icon: Package,
      label: "소모품 확인 필요",
      value: `${consumableItems.length}건`,
      tone: "bg-ivory-200 text-inkbody",
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

      {/* 핵심 요약 */}
      <Stagger className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <StaggerItem key={s.label}>
              <Card className="h-full">
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
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* 빠른 요청 */}
      <Reveal delay={0.06}>
        <Card>
          <CardContent className="p-5 md:p-6">
            <p className="text-base font-bold text-pine-900">무엇을 도와드릴까요?</p>
            <p className="mt-1 text-xs text-inkmuted">
              요청을 보내시면 제이랩테크 담당자가 확인하고 진행 상황을 알려드립니다.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {REQUEST_TYPES.slice(0, 4).map((r) => {
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
      <Reveal delay={0.1}>
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
                  <div
                    key={r.id}
                    className="rounded-xl border border-line/70 bg-ivory-100/60 p-4 transition-colors duration-fast hover:border-pine-100"
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Reveal>

      {/* 관리 중 장비 */}
      <Reveal delay={0.14}>
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

      {/* 앞으로 제공 예정 */}
      <Reveal delay={0.18}>
        <Card className="border-dashed">
          <CardContent className="p-5 md:p-6">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <p className="text-base font-bold text-pine-900">앞으로 준비 중인 서비스</p>
              <Badge tone="outline">3단계 검토</Badge>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-inkmuted">
              장비를 등록하고 요청을 주고받는 지금 구조 위에, 아래 서비스를 단계적으로
              검토하고 있습니다.
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {futureServices.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    aria-disabled
                    title="3단계에서 검토 예정인 서비스입니다"
                    className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-line bg-ivory-100/40 p-4 opacity-70"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ivory-200 text-inkmuted">
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <p className="clamp-1 text-sm font-semibold text-inkbody">{f.title}</p>
                      <p className="clamp-1 text-2xs text-inkmuted">{f.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
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
