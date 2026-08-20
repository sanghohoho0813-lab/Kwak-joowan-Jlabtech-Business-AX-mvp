/**
 * JLAB TECH AX MVP — 도메인 타입 정의
 *
 * 이후 Supabase 연동 시 이 타입들을 테이블 스키마와 1:1로 맞추는 것을 전제로 설계했다.
 * (mock 데이터와 실제 데이터 소스는 repository.ts 를 통해서만 접근한다)
 */

export type InventoryCategory =
  | "센서류"
  | "측정 장비"
  | "분석 장비"
  | "데이터로거"
  | "액세서리";

export type InventoryStatus = "정상" | "주의" | "부족" | "과잉";

export interface InventoryItem {
  id: string;
  name: string;
  model: string;
  category: InventoryCategory;
  stockQty: number;
  unitPriceManwon: number;
  stockValueEok: number;
  turnoverRate: number; // 연 재고 회전율
  status: InventoryStatus;
  forecastDemand30: number; // 30일 예측 수요 (수량)
  reorderPoint: number; // 발주점
  needsOrder: boolean;
  monthlyTrend: number[]; // 최근 6개월 출고 수량
}

export interface DemandTrendPoint {
  date: string; // MM.DD
  actual: number | null; // 실제 수요 (억)
  forecast: number | null; // 예측 수요 (억)
}

export interface CompositionSlice {
  name: string;
  value: number; // %
  color: string;
}

export type InsightLevel = "warning" | "info" | "success";

export interface Insight {
  id: string;
  level: InsightLevel;
  title: string;
  description: string;
  timeAgo: string;
}

export type RepurchaseLikelihood = "높음" | "중간" | "낮음";
export type CustomerPriority = "즉시 연락" | "이번 주" | "이번 달" | "관찰";

export interface Customer {
  id: string;
  company: string;
  segment: "제조 공장" | "연구소" | "환경 관리" | "현장 운영" | "공공기관";
  region: string;
  lastPurchaseDate: string; // ISO
  lastPurchaseItem: string;
  expectedRepurchaseDate: string; // ISO
  likelihood: RepurchaseLikelihood;
  priority: CustomerPriority;
  interestItems: string[];
  nextAction: string;
  avgCycleMonths: number;
  annualPurchaseManwon: number;
}

export interface RecommendInput {
  industry: string;
  purpose: string;
  environment: string;
  budget: string;
}

export interface RecommendedProduct {
  itemId: string;
  name: string;
  model: string;
  priceManwon: number;
  matchScore: number; // 0~100
  reasons: string[];
  accessories: { name: string; priceManwon: number }[];
}

export interface QuoteLine {
  label: string;
  amountManwon: number;
  note?: string;
}

export interface DashboardKpis {
  totalStockValueEok: number;
  totalStockDeltaPct: number;
  forecastDemand30Eok: number;
  forecastDemandDeltaPct: number;
  revenueOpportunityEok: number;
  revenueOpportunityDeltaPct: number;
  repurchaseAlerts: number;
  repurchaseAlertsUrgent: number;
}
