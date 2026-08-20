import type { DashboardKpis, Insight } from "../types";

export const dashboardKpis: DashboardKpis = {
  totalStockValueEok: 48.7,
  totalStockDeltaPct: 2.4,
  forecastDemand30Eok: 62.3,
  forecastDemandDeltaPct: 8.7,
  revenueOpportunityEok: 35.6,
  revenueOpportunityDeltaPct: 12.1,
  repurchaseAlerts: 12,
  repurchaseAlertsUrgent: 4,
};

export const insights: Insight[] = [
  {
    id: "in-1",
    level: "warning",
    title: "재고 부족 전망",
    description: "온도 센서(TS-200)의 재고가 7일 내 발주점 아래로 내려갈 것으로 예측됩니다.",
    timeAgo: "10분 전",
  },
  {
    id: "in-2",
    level: "info",
    title: "수요 급증 예측",
    description: "진동 센서의 30일 후 수요가 25% 증가할 것으로 예측됩니다.",
    timeAgo: "1시간 전",
  },
  {
    id: "in-3",
    level: "success",
    title: "재구매 시점 도래",
    description: "한성정밀화학 외 3개 고객사의 소모품 재구매 예상 시점이 이번 주입니다.",
    timeAgo: "3시간 전",
  },
  {
    id: "in-4",
    level: "info",
    title: "과잉 재고 감지",
    description: "압력 센서(PS-150)의 회전율이 1.2회로 낮습니다. 프로모션 또는 패키지 구성을 검토하세요.",
    timeAgo: "어제",
  },
];

export const aiSummary = [
  {
    id: "ai-1",
    kind: "발주 추천",
    text: "온도 센서(TS-200) 재고가 부족할 것으로 예측됩니다. 120개 발주를 권장합니다.",
  },
  {
    id: "ai-2",
    kind: "재구매 제안",
    text: "그린워터솔루션의 pH 프로브 소모 주기가 도래했습니다. 정기 납품 계약을 제안해 보세요.",
  },
  {
    id: "ai-3",
    kind: "재고 최적화",
    text: "압력 센서(PS-150) 과잉 재고 해소를 위해 진동 센서와 패키지 구성을 검토하세요.",
  },
];
