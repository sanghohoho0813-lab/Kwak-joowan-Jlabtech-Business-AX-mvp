import type { DashboardKpis, Insight } from "../types";

/**
 * DEMO DATA — 실제 실적이 아니다.
 * 억 단위 거액 대신 "오늘 무엇을 판단해야 하는가"를 보여주는 운영 지표로 구성했다.
 */
export const dashboardKpis: DashboardKpis = {
  totalStockValueManwon: 22530, // 약 2.25억원 (inventory 합계와 일치)
  forecastDemand30Manwon: 4020, // 9월 예측 출고 금액
  reorderItemCount: 4,
  repurchaseCustomerCount: 5,
  calibrationDueCount: 5,
  marginRiskCount: 3,
};

export const insights: Insight[] = [
  {
    id: "in-1",
    level: "warning",
    title: "재고 부족 전망",
    description:
      "온도 센서(TS-200) 재고 85개, 30일 예측 수요 46개. 발주점(40개) 아래로 내려갈 것으로 보입니다.",
    timeAgo: "10분 전",
  },
  {
    id: "in-2",
    level: "info",
    title: "수요 증가 추세",
    description: "온도 센서 출고량이 6개월 연속 증가했습니다. 발주 주기 단축을 검토하세요.",
    timeAgo: "1시간 전",
  },
  {
    id: "in-3",
    level: "success",
    title: "재구매 시점 도래",
    description: "한성정밀화학 외 2개 고객사의 소모품 재구매 예상 시점이 이번 주입니다.",
    timeAgo: "3시간 전",
  },
  {
    id: "in-4",
    level: "info",
    title: "과잉 재고 감지",
    description:
      "압력 센서(PS-150) 120개, 회전율 1.1회. 약 2,160만원이 묶여 있어 패키지 구성을 검토할 만합니다.",
    timeAgo: "어제",
  },
];

export const aiSummary = [
  {
    id: "ai-1",
    kind: "발주 추천",
    text: "온도 센서(TS-200) 재고가 발주점 아래로 내려갈 전망입니다. 60개 발주를 권장합니다.",
  },
  {
    id: "ai-2",
    kind: "재구매 제안",
    text: "그린워터솔루션의 pH 프로브 교체 주기가 도래했습니다. 정기 납품 계약을 제안해 보세요.",
  },
  {
    id: "ai-3",
    kind: "재고 최적화",
    text: "압력 센서(PS-150) 과잉 재고 해소를 위해 진동 센서와 패키지 구성을 검토하세요.",
  },
];
