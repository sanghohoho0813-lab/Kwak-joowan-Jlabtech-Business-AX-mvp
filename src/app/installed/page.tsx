"use client";

import { useMemo, useState } from "react";
import {
  Wrench,
  CalendarCheck,
  ShieldOff,
  MapPin,
  CircleCheck,
  Link2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, HoverCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";
import { useStore } from "@/lib/store-context";
import { useToast } from "@/components/ui/toast";
import { repo } from "@/data/repository";
import { cn, formatDate, dday } from "@/lib/utils";
import type { EquipmentStatus } from "@/data/types";

const equipment = repo.getInstalledEquipment();

const statusTones: Record<EquipmentStatus, "success" | "warning" | "danger" | "neutral"> = {
  "정상 가동": "success",
  "교정 필요": "warning",
  "점검 요청": "danger",
  "보증 만료": "neutral",
};

const filters: ("전체" | EquipmentStatus)[] = [
  "전체",
  "정상 가동",
  "교정 필요",
  "점검 요청",
  "보증 만료",
];

/** 기준일로부터 남은 일수 */
function daysLeft(iso: string, base = new Date("2026-08-20")) {
  return Math.round((new Date(iso).getTime() - base.getTime()) / 86400000);
}

export default function InstalledPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("전체");
  const { logActivity, activities } = useStore();
  const toast = useToast();

  const sorted = useMemo(
    () =>
      [...equipment].sort(
        (a, b) =>
          new Date(a.nextCalibrationDate).getTime() -
          new Date(b.nextCalibrationDate).getTime(),
      ),
    [],
  );

  const filtered = useMemo(
    () => sorted.filter((e) => filter === "전체" || e.status === filter),
    [sorted, filter],
  );

  const calibrationSoon = sorted.filter((e) => {
    const d = daysLeft(e.nextCalibrationDate);
    return d >= 0 && d <= 30;
  });
  const warrantyExpiring = sorted.filter((e) => {
    const d = daysLeft(e.warrantyEndDate);
    return d <= 90;
  });
  const serviceRequests = sorted.filter((e) => e.status === "점검 요청");

  const bookedIds = new Set(
    activities.filter((a) => a.kind === "교정 예약").map((a) => a.detail.split("|")[0]),
  );

  const book = (id: string, customer: string, model: string, date: string) => {
    logActivity({
      kind: "교정 예약",
      title: `${customer} · ${model} 교정 방문 예약`,
      detail: `${id}|예정일 ${formatDate(date)}`,
    });
    toast("교정 방문이 예약되었습니다", `${customer} · ${model}`);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="설치장비 관리"
        description="고객 현장에 설치된 장비의 교정 주기와 보증 상태를 관리합니다. 이 데이터가 재구매 예측의 근거가 됩니다."
        badge="2단계 고도화"
      />

      {/* 요약 */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: Wrench,
            label: "총 설치 장비",
            value: `${equipment.length}대`,
            note: "8개 고객사 현장 기준",
            tone: "bg-pine-50 text-pine-700",
          },
          {
            icon: CalendarCheck,
            label: "30일 내 교정 대상",
            value: `${calibrationSoon.length}대`,
            note: "방문 일정 조율이 필요합니다",
            tone: "bg-sand-100 text-sand-600",
          },
          {
            icon: ShieldOff,
            label: "보증 만료 임박",
            value: `${warrantyExpiring.length}대`,
            note: "90일 내 보증 종료",
            tone: "bg-sage-100 text-sage-600",
          },
          {
            icon: CircleCheck,
            label: "점검 요청",
            value: `${serviceRequests.length}건`,
            note: "고객사에서 접수된 요청",
            tone: "bg-red-50 text-red-600",
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <StaggerItem key={kpi.label}>
              <HoverCard className="h-28">
                <CardContent className="flex h-full items-center gap-4 p-5">
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      kpi.tone,
                    )}
                  >
                    <Icon size={19} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="clamp-1 text-xs text-inkmuted">{kpi.label}</p>
                    <p className="num text-xl font-bold text-pine-900">{kpi.value}</p>
                    <p className="clamp-1 text-2xs text-inkmuted">{kpi.note}</p>
                  </div>
                </CardContent>
              </HoverCard>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* 교정 예정 */}
      <Reveal delay={0.08}>
        <Card>
          <CardHeader>
            <CardTitle>교정 예정 장비 (30일 내)</CardTitle>
            <Badge tone="warning">{calibrationSoon.length}건</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {calibrationSoon.map((e) => {
                const booked = bookedIds.has(e.id);
                return (
                  <div
                    key={e.id}
                    className="flex min-h-[9rem] flex-col justify-between rounded-xl border border-line bg-ivory-100/60 p-4 transition-all hover:-translate-y-0.5 hover:border-pine-100 hover:shadow-card"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="clamp-1 text-sm font-bold text-pine-900">
                            {e.customerName}
                          </p>
                          <p className="clamp-1 mt-0.5 flex items-center gap-1 text-2xs text-inkmuted">
                            <MapPin size={11} className="shrink-0" />
                            {e.site}
                          </p>
                        </div>
                        <Badge tone={statusTones[e.status]}>
                          {dday(e.nextCalibrationDate)}
                        </Badge>
                      </div>
                      <p className="clamp-1 mt-2.5 text-xs font-semibold text-inkbody">
                        {e.itemName} · {e.model}
                      </p>
                      <p className="clamp-1 text-2xs text-inkmuted">
                        교정 예정일 {formatDate(e.nextCalibrationDate)}
                        {e.consumable ? ` · 소모품 ${e.consumable}` : ""}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-line/60 pt-2.5">
                      <p className="clamp-1 text-2xs text-inkmuted">S/N {e.serial}</p>
                      <Button
                        size="sm"
                        variant={booked ? "secondary" : "primary"}
                        disabled={booked}
                        onClick={() =>
                          book(e.id, e.customerName, e.model, e.nextCalibrationDate)
                        }
                      >
                        {booked ? "예약 완료" : "방문 예약"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* 전체 장비 대장 */}
      <Reveal delay={0.12}>
        <Card>
          <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <CardTitle>설치 장비 대장</CardTitle>
            <div className="flex flex-wrap gap-1.5 sm:ml-auto">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "h-7 whitespace-nowrap rounded-full border px-3 text-2xs font-semibold transition-all",
                    filter === f
                      ? "border-pine-700 bg-pine-700 text-white shadow-sm"
                      : "border-line bg-ivory-100 text-inkmuted hover:border-pine-100 hover:text-pine-700",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[56rem] text-left text-xs">
                <thead>
                  <tr className="border-b border-line bg-ivory-100 text-2xs text-inkmuted">
                    <th className="px-4 py-3 font-medium">고객사 / 현장</th>
                    <th className="px-3 py-3 font-medium">장비</th>
                    <th className="px-3 py-3 font-medium">설치일</th>
                    <th className="px-3 py-3 font-medium">최근 교정</th>
                    <th className="px-3 py-3 font-medium">다음 교정</th>
                    <th className="px-3 py-3 font-medium">보증 만료</th>
                    <th className="px-4 py-3 text-center font-medium">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-line/60 bg-ivory-50 transition-colors last:border-0 hover:bg-pine-50/50"
                    >
                      <td className="max-w-[14rem] px-4 py-3">
                        <p className="clamp-1 font-semibold text-pine-900">
                          {e.customerName}
                        </p>
                        <p className="clamp-1 text-2xs text-inkmuted">{e.site}</p>
                      </td>
                      <td className="max-w-[11rem] px-3 py-3">
                        <p className="clamp-1 text-inkbody">{e.itemName}</p>
                        <p className="clamp-1 text-2xs text-inkmuted">{e.model}</p>
                      </td>
                      <td className="num whitespace-nowrap px-3 py-3 text-inkmuted">
                        {formatDate(e.installedDate)}
                      </td>
                      <td className="num whitespace-nowrap px-3 py-3 text-inkmuted">
                        {formatDate(e.lastCalibrationDate)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <p className="num font-semibold text-pine-900">
                          {formatDate(e.nextCalibrationDate)}
                        </p>
                        <p className="num text-2xs text-sand-600">
                          {dday(e.nextCalibrationDate)}
                        </p>
                      </td>
                      <td className="num whitespace-nowrap px-3 py-3 text-inkmuted">
                        {formatDate(e.warrantyEndDate)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge tone={statusTones[e.status]}>{e.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-xl bg-pine-50/60 p-3 text-2xs leading-relaxed text-inkbody">
              <Link2 size={13} className="mt-px shrink-0 text-pine-700" />
              <span>
                설치 장비의 교정 주기와 소모품 교체 주기는{" "}
                <strong className="font-semibold">재구매 예측</strong>의 입력값으로
                사용됩니다. 교정 방문 시 소모품을 함께 제안하면 방문 1회로 두 가지 매출이
                발생합니다.
              </span>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
