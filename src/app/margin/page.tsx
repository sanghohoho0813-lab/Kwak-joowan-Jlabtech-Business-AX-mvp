"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, ShieldAlert, TrendingDown, Sparkles, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, HoverCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";
import { repo } from "@/data/repository";
import { cn, formatManwon } from "@/lib/utils";
import type { MarginStatus } from "@/data/types";

const items = repo.getMarginItems();
const marginPct = repo.marginPct;

function statusOf(actualPct: number, floorPct: number): MarginStatus {
  if (actualPct < floorPct) return "위험";
  if (actualPct < floorPct + 3) return "주의";
  return "안전";
}

const statusTones: Record<MarginStatus, "success" | "warning" | "danger"> = {
  안전: "success",
  주의: "warning",
  위험: "danger",
};

export default function MarginPage() {
  const rows = useMemo(
    () =>
      items
        .map((item) => {
          const actual = marginPct(item.avgSellingManwon, item.costManwon);
          const list = marginPct(item.listPriceManwon, item.costManwon);
          const discountPct =
            ((item.listPriceManwon - item.avgSellingManwon) / item.listPriceManwon) * 100;
          // 하한선 복원 시 회복 가능한 금액 (최근 90일 기준)
          const floorPrice = item.costManwon / (1 - item.floorMarginPct / 100);
          const recoverable =
            actual < item.floorMarginPct
              ? (floorPrice - item.avgSellingManwon) * item.soldQty90
              : 0;
          return {
            ...item,
            actual,
            list,
            discountPct,
            recoverable,
            status: statusOf(actual, item.floorMarginPct),
          };
        })
        .sort((a, b) => a.actual - a.floorMarginPct - (b.actual - b.floorMarginPct)),
    [],
  );

  const riskRows = rows.filter((r) => r.status === "위험");
  const avgMargin =
    rows.reduce((sum, r) => sum + r.actual * r.soldQty90, 0) /
    rows.reduce((sum, r) => sum + r.soldQty90, 0);
  const totalDiscountLoss = rows.reduce(
    (sum, r) => sum + (r.listPriceManwon - r.avgSellingManwon) * r.soldQty90,
    0,
  );
  const totalRecoverable = rows.reduce((sum, r) => sum + r.recoverable, 0);

  // 할인 시뮬레이터
  const [selectedId, setSelectedId] = useState(rows[0]?.itemId ?? "");
  const [discount, setDiscount] = useState(10);
  const selected = rows.find((r) => r.itemId === selectedId) ?? rows[0];
  const simPrice = selected ? selected.listPriceManwon * (1 - discount / 100) : 0;
  const simMargin = selected ? marginPct(simPrice, selected.costManwon) : 0;
  const simStatus = selected ? statusOf(simMargin, selected.floorMarginPct) : "안전";
  // 하한선을 지키는 최대 할인율
  const maxDiscount = selected
    ? Math.max(
        0,
        (1 - selected.costManwon / (1 - selected.floorMarginPct / 100) / selected.listPriceManwon) *
          100,
      )
    : 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="마진 가드"
        description="품목별 원가와 실판매가를 비교해 마진 하한선을 지킵니다. 매출이 늘어도 마진이 새면 남는 것이 없습니다."
        badge="2단계 고도화"
      />

      {/* 요약 */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
          <HoverCard className="h-28">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                <ShieldCheck size={19} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="clamp-1 text-xs text-inkmuted">평균 마진율</p>
                <p className="num text-xl font-bold text-pine-900">
                  {avgMargin.toFixed(1)}%
                </p>
                <p className="clamp-1 text-2xs text-inkmuted">최근 90일 판매량 가중 평균</p>
              </div>
            </CardContent>
          </HoverCard>
        </StaggerItem>
        <StaggerItem>
          <HoverCard className="h-28">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <ShieldAlert size={19} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="clamp-1 text-xs text-inkmuted">마진 위험 품목</p>
                <p className="num text-xl font-bold text-pine-900">
                  {riskRows.length}개 품목
                </p>
                <p className="clamp-1 text-2xs text-inkmuted">하한선 아래로 판매 중</p>
              </div>
            </CardContent>
          </HoverCard>
        </StaggerItem>
        <StaggerItem>
          <HoverCard className="h-28">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sand-100 text-sand-600">
                <TrendingDown size={19} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="clamp-1 text-xs text-inkmuted">할인 손실 (90일)</p>
                <p className="num text-xl font-bold text-pine-900">
                  {formatManwon(Math.round(totalDiscountLoss))}
                </p>
                <p className="clamp-1 text-2xs text-inkmuted">정가 대비 실판매 차액</p>
              </div>
            </CardContent>
          </HoverCard>
        </StaggerItem>
        <StaggerItem>
          <HoverCard className="h-28">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-sage-600">
                <Sparkles size={19} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="clamp-1 text-xs text-inkmuted">회복 가능 금액</p>
                <p className="num text-xl font-bold text-pine-900">
                  {formatManwon(Math.round(totalRecoverable))}
                </p>
                <p className="clamp-1 text-2xs text-inkmuted">하한선 복원 시 추정</p>
              </div>
            </CardContent>
          </HoverCard>
        </StaggerItem>
      </Stagger>

      {/* 할인 시뮬레이터 */}
      <Reveal delay={0.08}>
        <Card>
          <CardHeader>
            <CardTitle>할인 시뮬레이터</CardTitle>
            <Badge tone="outline">견적 전 확인용</Badge>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* 입력 */}
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold text-pine-900">품목 선택</p>
                <div className="flex flex-wrap gap-1.5">
                  {rows.slice(0, 6).map((r) => (
                    <button
                      key={r.itemId}
                      type="button"
                      onClick={() => setSelectedId(r.itemId)}
                      className={cn(
                        "h-8 whitespace-nowrap rounded-full border px-3 text-2xs font-semibold transition-all",
                        selectedId === r.itemId
                          ? "border-pine-700 bg-pine-700 text-white shadow-sm"
                          : "border-line bg-ivory-100 text-inkmuted hover:border-pine-100 hover:text-pine-700",
                      )}
                    >
                      {r.model}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-pine-900">할인율</p>
                  <p className="num text-sm font-bold text-pine-800">{discount}%</p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-pine-700"
                  aria-label="할인율"
                />
                <div className="mt-1.5 flex justify-between text-2xs text-inkmuted">
                  <span>0%</span>
                  <span className="num text-sand-600">
                    하한선 유지 최대 {maxDiscount.toFixed(0)}%
                  </span>
                  <span>40%</span>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-ivory-100 p-3 text-2xs leading-relaxed text-inkmuted">
                <Info size={13} className="mt-px shrink-0 text-sand-500" />
                <span>
                  할인율을 올리면 마진율이 어떻게 변하는지 미리 확인할 수 있습니다. 견적
                  제출 전 하한선 침범 여부를 확인하세요.
                </span>
              </div>
            </div>

            {/* 결과 */}
            {selected ? (
              <div
                className={cn(
                  "flex flex-col justify-between rounded-xl border p-5 transition-colors",
                  simStatus === "위험"
                    ? "border-red-200 bg-red-50/60"
                    : simStatus === "주의"
                      ? "border-sand-400/50 bg-sand-100/50"
                      : "border-pine-100 bg-pine-50/50",
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="clamp-1 text-sm font-bold text-pine-900">
                        {selected.name}
                      </p>
                      <p className="clamp-1 text-2xs text-inkmuted">{selected.model}</p>
                    </div>
                    <Badge tone={statusTones[simStatus]}>{simStatus}</Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { label: "정가", value: formatManwon(selected.listPriceManwon) },
                      { label: "원가", value: formatManwon(selected.costManwon) },
                      {
                        label: `할인가 (${discount}%)`,
                        value: formatManwon(Math.round(simPrice * 10) / 10),
                      },
                      {
                        label: "건당 마진",
                        value: formatManwon(
                          Math.round((simPrice - selected.costManwon) * 10) / 10,
                        ),
                      },
                    ].map((cell) => (
                      <div key={cell.label} className="min-w-0">
                        <p className="clamp-1 text-2xs text-inkmuted">{cell.label}</p>
                        <p className="num clamp-1 text-sm font-bold text-pine-900">
                          {cell.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-line/60 pt-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs font-semibold text-inkbody">예상 마진율</p>
                    <p
                      className={cn(
                        "num text-2xl font-bold",
                        simStatus === "위험" ? "text-red-600" : "text-pine-800",
                      )}
                    >
                      {simMargin.toFixed(1)}%
                    </p>
                  </div>
                  {/* 마진 바 */}
                  <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-ivory-300">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        simStatus === "위험"
                          ? "bg-red-500"
                          : simStatus === "주의"
                            ? "bg-sand-500"
                            : "bg-pine-600",
                      )}
                      style={{ width: `${Math.max(0, Math.min(100, simMargin * 2))}%` }}
                    />
                    <div
                      className="absolute top-0 h-full w-px bg-pine-900"
                      style={{ left: `${Math.min(100, selected.floorMarginPct * 2)}%` }}
                      title="마진 하한선"
                    />
                  </div>
                  <p className="num mt-1.5 text-2xs text-inkmuted">
                    하한선 {selected.floorMarginPct}%
                    {simMargin < selected.floorMarginPct
                      ? ` · ${(selected.floorMarginPct - simMargin).toFixed(1)}%p 부족`
                      : ` · ${(simMargin - selected.floorMarginPct).toFixed(1)}%p 여유`}
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </Reveal>

      {/* 품목별 마진 테이블 */}
      <Reveal delay={0.12}>
        <Card>
          <CardHeader>
            <CardTitle>품목별 마진 현황</CardTitle>
            <Badge tone="neutral">최근 90일 기준</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[52rem] text-left text-xs">
                <thead>
                  <tr className="border-b border-line bg-ivory-100 text-2xs text-inkmuted">
                    <th className="px-4 py-3 font-medium">제품명</th>
                    <th className="px-3 py-3 text-right font-medium">원가</th>
                    <th className="px-3 py-3 text-right font-medium">정가</th>
                    <th className="px-3 py-3 text-right font-medium">실판매 평균</th>
                    <th className="px-3 py-3 text-right font-medium">할인율</th>
                    <th className="px-3 py-3 text-right font-medium">마진율</th>
                    <th className="px-3 py-3 text-right font-medium">하한선</th>
                    <th className="px-4 py-3 text-center font-medium">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.itemId}
                      className="border-b border-line/60 bg-ivory-50 transition-colors last:border-0 hover:bg-pine-50/50"
                    >
                      <td className="max-w-[12rem] px-4 py-3">
                        <p className="clamp-1 font-semibold text-pine-900">{r.name}</p>
                        <p className="clamp-1 text-2xs text-inkmuted">{r.model}</p>
                      </td>
                      <td className="num whitespace-nowrap px-3 py-3 text-right text-inkmuted">
                        {formatManwon(r.costManwon)}
                      </td>
                      <td className="num whitespace-nowrap px-3 py-3 text-right">
                        {formatManwon(r.listPriceManwon)}
                      </td>
                      <td className="num whitespace-nowrap px-3 py-3 text-right font-semibold text-pine-900">
                        {formatManwon(r.avgSellingManwon)}
                      </td>
                      <td className="num whitespace-nowrap px-3 py-3 text-right text-sand-600">
                        {r.discountPct.toFixed(1)}%
                      </td>
                      <td
                        className={cn(
                          "num whitespace-nowrap px-3 py-3 text-right font-bold",
                          r.status === "위험" ? "text-red-600" : "text-pine-800",
                        )}
                      >
                        {r.actual.toFixed(1)}%
                      </td>
                      <td className="num whitespace-nowrap px-3 py-3 text-right text-inkmuted">
                        {r.floorMarginPct}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge tone={statusTones[r.status]}>{r.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-2xs text-inkmuted">
              마진율 = (판매가 − 원가) ÷ 판매가 · 하한선은 품목 카테고리별로 설정된
              최소 수익 기준입니다.
            </p>
          </CardContent>
        </Card>
      </Reveal>

      {/* 개선 제안 */}
      {riskRows.length > 0 ? (
        <Reveal delay={0.16}>
          <Card>
            <CardHeader>
              <CardTitle>마진 개선 제안</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {riskRows.map((r) => {
                  const targetPrice = r.costManwon / (1 - r.floorMarginPct / 100);
                  return (
                    <div
                      key={r.itemId}
                      className="flex min-h-[7rem] flex-col justify-between rounded-xl border border-line bg-ivory-100/60 p-4 transition-all hover:-translate-y-0.5 hover:border-pine-100 hover:shadow-card"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="clamp-1 text-sm font-bold text-pine-900">
                            {r.name} ({r.model})
                          </p>
                          <Badge tone="danger">
                            {(r.floorMarginPct - r.actual).toFixed(1)}%p 부족
                          </Badge>
                        </div>
                        <p className="clamp-2 mt-2 text-xs leading-relaxed text-inkbody">
                          실판매 평균 {formatManwon(r.avgSellingManwon)}을{" "}
                          {formatManwon(Math.round(targetPrice * 10) / 10)} 이상으로
                          조정하면 하한선을 회복합니다.
                        </p>
                      </div>
                      <p className="num mt-3 border-t border-line/60 pt-2.5 text-2xs text-inkmuted">
                        90일 기준 회복 가능 금액 약{" "}
                        <span className="font-bold text-pine-800">
                          {formatManwon(Math.round(r.recoverable))}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      ) : null}
    </div>
  );
}
