"use client";

import Link from "next/link";
import {
  Package,
  TrendingUp,
  ShoppingCart,
  RefreshCcw,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  Repeat,
  Scale,
  Wrench,
  ShieldAlert,
  PhoneCall,
  Activity,
  Inbox,
} from "lucide-react";
import { Card, HoverCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { DataChip } from "@/components/ui/status-chip";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";
import { DemandTrendChart } from "@/components/charts/demand-trend-chart";
import { CompositionDonut } from "@/components/charts/composition-donut";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { useStore } from "@/lib/store-context";
import { useSettings } from "@/lib/settings-context";
import { repo } from "@/data/repository";
import { formatKrwCompact, formatNumber, formatDate, daysLeft } from "@/lib/utils";
import type { InsightLevel } from "@/data/types";

const kpis = repo.getDashboardKpis();
const trend = repo.getDemandTrend();
const composition = repo.getComposition();
const inventory = repo.getInventory();
const insights = repo.getInsights();
const aiSummary = repo.getAiSummary();
const equipment = repo.getInstalledEquipment();
const customers = repo.getCustomers();

const insightIcon: Record<InsightLevel, { icon: typeof Info; cls: string }> = {
  warning: { icon: AlertTriangle, cls: "bg-sand-100 text-sand-600" },
  info: { icon: Info, cls: "bg-sage-100 text-sage-600" },
  success: { icon: CheckCircle2, cls: "bg-pine-50 text-pine-700" },
};

const aiIcon: Record<string, typeof ShoppingCart> = {
  "발주 추천": ShoppingCart,
  "재구매 제안": Repeat,
  "재고 최적화": Scale,
};

/** 역할별로 먼저 봐야 할 과제 순서를 바꾼다 (Demo Role Preview) */
const roleOrder: Record<string, string[]> = {
  대표: ["고객 요청", "재구매", "마진", "발주", "교정"],
  "영업·견적": ["고객 요청", "재구매", "발주", "마진", "교정"],
  "재고·운영": ["발주", "교정", "고객 요청", "마진", "재구매"],
};

export default function DashboardPage() {
  const topItems = inventory.slice(0, 5);
  const { activities, orders, quotes, requests } = useStore();
  const { role } = useSettings();

  const openRequests = requests.filter((r) => r.status !== "완료");
  const newRequests = requests.filter((r) => r.status === "접수");

  const calibrationDue = equipment.filter((e) => {
    const d = daysLeft(e.nextCalibrationDate);
    return d >= 0 && d <= 30;
  }).length;

  const allTodos = [
    {
      key: "고객 요청",
      href: "/requests",
      icon: Inbox,
      label: "신규 고객 요청",
      count: newRequests.length,
      unit: "건",
      tone: "bg-pine-50 text-pine-700",
    },
    {
      key: "발주",
      href: "/inventory",
      icon: ShoppingCart,
      label: "발주 필요",
      count: kpis.reorderItemCount,
      unit: "개 품목",
      tone: "bg-red-50 text-red-600",
    },
    {
      key: "재구매",
      href: "/repurchase",
      icon: PhoneCall,
      label: "재구매 대상",
      count: customers.filter((c) => c.priority === "즉시 연락" || c.priority === "이번 주")
        .length,
      unit: "개 고객사",
      tone: "bg-sand-100 text-sand-600",
    },
    {
      key: "교정",
      href: "/installed",
      icon: Wrench,
      label: "교정 예정",
      count: calibrationDue,
      unit: "대",
      tone: "bg-sage-100 text-sage-600",
    },
    {
      key: "마진",
      href: "/margin",
      icon: ShieldAlert,
      label: "마진 위험",
      count: kpis.marginRiskCount,
      unit: "개 품목",
      tone: "bg-ivory-200 text-inkbody",
    },
  ];
  const order = roleOrder[role] ?? roleOrder["대표"];
  const todos = [...allTodos].sort(
    (a, b) => order.indexOf(a.key) - order.indexOf(b.key),
  );

  const kpiCards = [
    {
      icon: Package,
      label: "총 재고 가치",
      value: formatKrwCompact(kpis.totalStockValueManwon),
      note: "10개 품목 합계",
      spark: [20800, 21200, 21600, 21900, 22200, 22530],
      sparkColor: "var(--chart-1)",
    },
    {
      icon: TrendingUp,
      label: "30일 예상 출고",
      value: formatKrwCompact(kpis.forecastDemand30Manwon),
      note: "예측값 · 실적 아님",
      spark: [3410, 4050, 3870, 4180, 4020, 4310],
      sparkColor: "var(--chart-3)",
    },
    {
      icon: ShoppingCart,
      label: "발주 판단 필요",
      value: `${kpis.reorderItemCount}개 품목`,
      note: "예측 수요가 발주점 초과",
      spark: [2, 3, 3, 4, 4, 4],
      sparkColor: "var(--chart-1)",
    },
    {
      icon: RefreshCcw,
      label: "매출 기회",
      value: `${openRequests.length + kpis.repurchaseCustomerCount}건`,
      note: `고객 요청 ${openRequests.length}건 · 재구매 ${kpis.repurchaseCustomerCount}건`,
      spark: [4, 5, 6, 6, 7, 8],
      sparkColor: "var(--chart-3)",
    },
  ];

  return (
    <div className="space-y-5">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-pine-900 md:text-2xl">
            대시보드
          </h1>
          <DataChip />
        </div>
        <p className="clamp-2 mt-1.5 text-sm text-inkmuted">
          오늘 판단해야 할 일과 회사 운영 상태를 한 화면에서 확인하세요.
        </p>
      </Reveal>

      {/* 오늘의 실행 과제 — 각 모듈의 신호를 모아 다음 행동을 제시 */}
      <Reveal delay={0.04}>
        <Card className="border-pine-100 bg-pine-50/40">
          <CardContent className="p-4 md:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="clamp-1 text-sm font-bold text-pine-900">오늘의 실행 과제</p>
              <span className="shrink-0 whitespace-nowrap text-2xs text-inkmuted">
                {role} 기준 · 모듈별 신호 집계
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
              {todos.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.key}
                    href={t.href}
                    className="group flex h-20 items-center gap-3 rounded-xl border border-line bg-ivory-50 px-3.5 transition-all duration-base hover:-translate-y-0.5 hover:border-pine-100 hover:shadow-card"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${t.tone}`}
                    >
                      <Icon size={16} strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0">
                      <p className="clamp-1 text-2xs text-inkmuted">{t.label}</p>
                      <p className="num clamp-1 text-base font-bold text-pine-900">
                        {t.count}
                        <span className="ml-0.5 text-2xs font-medium text-inkmuted">
                          {t.unit}
                        </span>
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="ml-auto shrink-0 text-inkmuted transition-transform duration-base group-hover:translate-x-0.5 group-hover:text-pine-700"
                    />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* KPI 카드 */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <StaggerItem key={kpi.label}>
              <HoverCard className="h-36">
                <CardContent className="flex h-full flex-col justify-between p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="clamp-1 text-xs font-medium text-inkmuted">
                        {kpi.label}
                      </p>
                      <p className="num clamp-1 mt-1 text-xl font-bold tracking-tight text-pine-900">
                        {kpi.value}
                      </p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <p className="clamp-2 min-w-0 text-2xs text-inkmuted">{kpi.note}</p>
                    <div className="w-20 shrink-0">
                      <MiniSparkline data={kpi.spark} color={kpi.sparkColor} height={30} />
                    </div>
                  </div>
                </CardContent>
              </HoverCard>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* 트렌드 + 구성 비중 */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Reveal delay={0.1} className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>월 출고 금액 추이</CardTitle>
              <div className="flex shrink-0 items-center gap-3 text-2xs text-inkmuted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded bg-pine-700" /> 실제
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded border-t-2 border-dashed border-sand-500" />
                  예측
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <DemandTrendChart data={trend} />
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.14}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>재고 구성 비중</CardTitle>
            </CardHeader>
            <CardContent>
              <CompositionDonut
                data={composition}
                centerLabel="총 재고 가치"
                centerValue={formatKrwCompact(kpis.totalStockValueManwon)}
              />
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* 주요 재고 + 알림 인사이트 */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Reveal delay={0.1} className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>주요 재고 현황</CardTitle>
              <Link
                href="/inventory"
                className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap text-xs font-medium text-pine-700 transition-colors duration-fast hover:text-pine-600"
              >
                전체 보기 <ChevronRight size={13} />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] text-left text-xs">
                  <thead>
                    <tr className="border-b border-line text-2xs text-inkmuted">
                      <th className="pb-2.5 pr-3 font-medium">제품명</th>
                      <th className="pb-2.5 pr-3 font-medium">카테고리</th>
                      <th className="pb-2.5 pr-3 text-right font-medium">재고</th>
                      <th className="pb-2.5 pr-3 text-right font-medium">재고 가치</th>
                      <th className="pb-2.5 pr-3 text-right font-medium">회전율</th>
                      <th className="pb-2.5 text-right font-medium">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-line/60 transition-colors duration-fast last:border-0 hover:bg-pine-50/50"
                      >
                        <td className="max-w-[11rem] py-3 pr-3">
                          <p className="clamp-1 font-semibold text-pine-900">
                            {item.name} ({item.model})
                          </p>
                        </td>
                        <td className="whitespace-nowrap py-3 pr-3 text-inkmuted">
                          {item.category}
                        </td>
                        <td className="num whitespace-nowrap py-3 pr-3 text-right">
                          {formatNumber(item.stockQty)}
                        </td>
                        <td className="num whitespace-nowrap py-3 pr-3 text-right">
                          {formatKrwCompact(item.stockValueManwon)}
                        </td>
                        <td className="num whitespace-nowrap py-3 pr-3 text-right">
                          {item.turnoverRate.toFixed(1)}회
                        </td>
                        <td className="py-3 text-right">
                          <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.14}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>알림 &amp; 인사이트</CardTitle>
              <DataChip />
            </CardHeader>
            <CardContent className="space-y-2.5">
              {insights.map((insight) => {
                const { icon: Icon, cls } = insightIcon[insight.level];
                return (
                  <div
                    key={insight.id}
                    className="flex gap-3 rounded-xl border border-line/70 bg-ivory-100/60 p-3 transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50/40"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cls}`}
                    >
                      <Icon size={15} strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="clamp-1 text-xs font-bold text-pine-900">
                          {insight.title}
                        </p>
                        <span className="shrink-0 whitespace-nowrap text-2xs text-inkmuted">
                          {insight.timeAgo}
                        </span>
                      </div>
                      <p className="clamp-3 mt-0.5 text-2xs leading-relaxed text-inkmuted">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* AI 추천 요약 */}
      <Reveal delay={0.12}>
        <Card>
          <CardHeader>
            <CardTitle>AI 추천</CardTitle>
            <Link
              href="/recommend"
              className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap text-xs font-medium text-pine-700 transition-colors duration-fast hover:text-pine-600"
            >
              전체 보기 <ChevronRight size={13} />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {aiSummary.map((item) => {
                const Icon = aiIcon[item.kind] ?? Scale;
                return (
                  <Link
                    key={item.id}
                    href="/recommend"
                    className="group flex min-h-[6.5rem] flex-col gap-2.5 rounded-xl border border-line bg-ivory-100/60 p-4 transition-all duration-base hover:-translate-y-0.5 hover:border-pine-100 hover:bg-pine-50/50 hover:shadow-card"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-pine-800">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sand-100 text-sand-600">
                          <Icon size={14} strokeWidth={1.9} />
                        </span>
                        {item.kind}
                      </span>
                      <ChevronRight
                        size={14}
                        className="shrink-0 text-inkmuted transition-transform duration-base group-hover:translate-x-0.5 group-hover:text-pine-700"
                      />
                    </div>
                    <p className="clamp-3 text-xs leading-relaxed text-inkbody">
                      {item.text}
                    </p>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* 최근 활동 — 플랫폼에 기록된 실제 행동 이력 */}
      {activities.length > 0 ? (
        <Reveal delay={0.14}>
          <Card>
            <CardHeader>
              <CardTitle>최근 활동 이력</CardTitle>
              <div className="flex shrink-0 items-center gap-1.5">
                <Badge tone="outline">발주 {orders.length}</Badge>
                <Badge tone="outline">견적 {quotes.length}</Badge>
                <Badge tone="outline">요청 {requests.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {activities.slice(0, 6).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl border border-line/70 bg-ivory-100/60 p-3 transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50/40"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pine-50 text-pine-700">
                    <Activity size={14} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="clamp-1 text-xs font-bold text-pine-900">{a.title}</p>
                    <p className="clamp-1 text-2xs text-inkmuted">
                      {a.detail.includes("|") ? a.detail.split("|")[1] : a.detail}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge tone="neutral">{a.kind}</Badge>
                    <p className="num mt-1 whitespace-nowrap text-[0.5625rem] text-inkmuted">
                      {formatDate(a.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <Link
                href="/evidence"
                className="inline-flex items-center gap-1 pt-1 text-2xs font-semibold text-pine-700 underline-offset-4 transition-colors duration-fast hover:text-pine-600 hover:underline"
              >
                AX 실증성과에서 전체 기록 보기
                <ChevronRight size={12} />
              </Link>
            </CardContent>
          </Card>
        </Reveal>
      ) : null}
    </div>
  );
}
