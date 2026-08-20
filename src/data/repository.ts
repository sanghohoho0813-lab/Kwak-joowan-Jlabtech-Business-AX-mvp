/**
 * 데이터 접근 레이어 (Repository)
 *
 * 현재는 mock 데이터를 반환하지만, 화면 컴포넌트는 반드시 이 파일을 통해서만
 * 데이터에 접근한다. 이후 Supabase 연동 시 이 파일의 구현부만
 * `supabase.from("...").select()` 호출로 교체하면 화면 코드는 그대로 재사용된다.
 */

import { inventoryItems, demandTrend, composition } from "./mock/inventory";
import { customers } from "./mock/customers";
import { dashboardKpis, insights, aiSummary } from "./mock/dashboard";
import {
  recommendProducts,
  buildQuote,
  industryOptions,
  purposeOptions,
  environmentOptions,
  budgetOptions,
} from "./mock/recommend";
import type {
  Customer,
  InventoryItem,
  RecommendInput,
  RecommendedProduct,
} from "./types";

export const repo = {
  // 대시보드
  getDashboardKpis: () => dashboardKpis,
  getInsights: () => insights,
  getAiSummary: () => aiSummary,

  // 재고·수요
  getInventory: (): InventoryItem[] => inventoryItems,
  getDemandTrend: () => demandTrend,
  getComposition: () => composition,

  // 고객·재구매
  getCustomers: (): Customer[] => customers,

  // AI 추천·견적
  getRecommendOptions: () => ({
    industryOptions,
    purposeOptions,
    environmentOptions,
    budgetOptions,
  }),
  recommend: (input: RecommendInput): RecommendedProduct[] => recommendProducts(input),
  buildQuote,
};
