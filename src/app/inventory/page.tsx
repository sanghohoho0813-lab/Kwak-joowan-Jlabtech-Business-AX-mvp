"use client";

import { useMemo, useState } from "react";
import {
  Search,
  PackageSearch,
  AlertTriangle,
  TrendingDown,
  ShoppingCart,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, HoverCard } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { DemandTrendChart } from "@/components/charts/demand-trend-chart";
import { repo } from "@/data/repository";
import { cn, formatNumber } from "@/lib/utils";
import type { InventoryCategory, InventoryStatus } from "@/data/types";

const inventory = repo.getInventory();
const trend = repo.getDemandTrend();

const categories: ("전체" | InventoryCategory)[] = [
  "전체",
  "센서류",
  "측정 장비",
  "분석 장비",
  "데이터로거",
  "액세서리",
];

const statuses: ("전체" | InventoryStatus)[] = ["전체", "정상", "주의", "부족", "과잉"];

export default function InventoryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("전체");
  const [status, setStatus] = useState<(typeof statuses)[number]>("전체");

  const filtered = useMemo(
    () =>
      inventory.filter((item) => {
        if (category !== "전체" && item.category !== category) return false;
        if (status !== "전체" && item.status !== status) return false;
        if (query) {
          const q = query.toLowerCase();
          return (
            item.name.toLowerCase().includes(q) || item.model.toLowerCase().includes(q)
          );
        }
        return true;
      }),
    [query, category, status],
  );

  const needsOrder = inventory.filter((i) => i.needsOrder);
  const overstock = inventory.filter((i) => i.status === "과잉");
  const watchCount = inventory.filter((i) => i.status === "주의" || i.status === "부족").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="재고·수요 관리"
        description="현재 재고와 30일 예측 수요를 비교해 부족·과잉 신호를 미리 확인하세요. 재고는 곧 현금 흐름입니다."
      />

      {/* 요약 카드 */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StaggerItem>
          <HoverCard className="h-28">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <ShoppingCart size={19} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="clamp-1 text-xs text-inkmuted">발주 필요 품목</p>
                <p className="num text-xl font-bold text-pine-900">
                  {needsOrder.length}개 품목
                </p>
                <p className="clamp-1 text-2xs text-inkmuted">
                  예측 수요가 발주점을 초과했습니다
                </p>
              </div>
            </CardContent>
          </HoverCard>
        </StaggerItem>
        <StaggerItem>
          <HoverCard className="h-28">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sand-100 text-sand-600">
                <AlertTriangle size={19} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="clamp-1 text-xs text-inkmuted">주의·부족 재고</p>
                <p className="num text-xl font-bold text-pine-900">{watchCount}개 품목</p>
                <p className="clamp-1 text-2xs text-inkmuted">
                  7일 내 재고 부족 가능성이 있습니다
                </p>
              </div>
            </CardContent>
          </HoverCard>
        </StaggerItem>
        <StaggerItem>
          <HoverCard className="h-28">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-sage-600">
                <TrendingDown size={19} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="clamp-1 text-xs text-inkmuted">과잉 재고</p>
                <p className="num text-xl font-bold text-pine-900">
                  {overstock.length}개 품목
                </p>
                <p className="clamp-1 text-2xs text-inkmuted">
                  회전율이 낮아 자금이 묶여 있습니다
                </p>
              </div>
            </CardContent>
          </HoverCard>
        </StaggerItem>
      </Stagger>

      {/* 수요 트렌드 */}
      <Reveal delay={0.08}>
        <Card>
          <CardHeader>
            <CardTitle>전체 수요 예측 트렌드 (30일)</CardTitle>
          </CardHeader>
          <CardContent>
            <DemandTrendChart data={trend} />
          </CardContent>
        </Card>
      </Reveal>

      {/* 필터 + 테이블 */}
      <Reveal delay={0.12}>
        <Card>
          <CardHeader className="flex-col items-stretch gap-3 md:flex-row md:items-center">
            <CardTitle>품목별 재고 현황</CardTitle>
            <div className="relative md:ml-auto md:w-64">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-inkmuted"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="제품명 또는 모델명 검색"
                className="h-9 w-full rounded-xl border border-line bg-ivory-100 pl-8 pr-3 text-xs text-inkbody placeholder:text-inkmuted/70 focus:border-pine-600/50 focus:outline-none focus:ring-2 focus:ring-pine-600/15"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 카테고리 / 상태 필터 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={cn(
                      "h-7 whitespace-nowrap rounded-full border px-3 text-2xs font-semibold transition-all",
                      category === c
                        ? "border-pine-700 bg-pine-700 text-white shadow-sm"
                        : "border-line bg-ivory-100 text-inkmuted hover:border-pine-100 hover:text-pine-700",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <span className="hidden h-4 w-px bg-line sm:block" />
              <div className="flex flex-wrap gap-1.5">
                {statuses.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={cn(
                      "h-7 whitespace-nowrap rounded-full border px-3 text-2xs font-semibold transition-all",
                      status === s
                        ? "border-sand-500 bg-sand-500 text-white shadow-sm"
                        : "border-line bg-ivory-100 text-inkmuted hover:border-sand-400 hover:text-sand-600",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[46rem] text-left text-xs">
                <thead>
                  <tr className="border-b border-line bg-ivory-100 text-2xs text-inkmuted">
                    <th className="px-4 py-3 font-medium">제품명</th>
                    <th className="px-3 py-3 font-medium">카테고리</th>
                    <th className="px-3 py-3 text-right font-medium">재고 수량</th>
                    <th className="px-3 py-3 text-right font-medium">예측 수요(30일)</th>
                    <th className="px-3 py-3 text-right font-medium">회전율</th>
                    <th className="px-3 py-3 font-medium">출고 추이</th>
                    <th className="px-3 py-3 text-center font-medium">상태</th>
                    <th className="px-4 py-3 text-center font-medium">발주 신호</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-inkmuted">
                        <PackageSearch size={20} className="mx-auto mb-2 opacity-50" />
                        조건에 맞는 품목이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-line/60 bg-ivory-50 transition-colors last:border-0 hover:bg-pine-50/50"
                      >
                        <td className="max-w-[12rem] px-4 py-3">
                          <p className="clamp-1 font-semibold text-pine-900">{item.name}</p>
                          <p className="clamp-1 text-2xs text-inkmuted">{item.model}</p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-inkmuted">
                          {item.category}
                        </td>
                        <td className="num whitespace-nowrap px-3 py-3 text-right font-semibold text-pine-900">
                          {formatNumber(item.stockQty)}
                        </td>
                        <td className="num whitespace-nowrap px-3 py-3 text-right">
                          {formatNumber(item.forecastDemand30)}
                        </td>
                        <td className="num whitespace-nowrap px-3 py-3 text-right">
                          {item.turnoverRate.toFixed(1)}회
                        </td>
                        <td className="w-28 px-3 py-3">
                          <MiniSparkline
                            data={item.monthlyTrend}
                            color={item.status === "부족" ? "#B91C1C" : "#145C44"}
                            height={26}
                          />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.needsOrder ? (
                            <Badge tone="danger" className="animate-pulse-soft">
                              발주 필요
                            </Badge>
                          ) : (
                            <span className="text-2xs text-inkmuted">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-2xs text-inkmuted">
              총 {filtered.length}개 품목 · 예측 수요는 최근 6개월 출고 데이터를 기반으로
              산출됩니다.
            </p>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
