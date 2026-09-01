/**
 * 데이터 접근 레이어 (Repository)
 *
 * 현재는 mock 데이터를 반환하지만, 화면 컴포넌트는 반드시 이 파일을 통해서만
 * 데이터에 접근한다. 이후 Supabase 연동 시 이 파일의 구현부만
 * `supabase.from("...").select()` 호출로 교체하면 화면 코드는 그대로 재사용된다.
 *
 * 사용자의 행동으로 생성되는 데이터(발주·견적·활동 이력)는 이 파일이 아니라
 * `lib/store-context.tsx` 가 담당한다. (읽기 = repository, 쓰기 = store)
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
import { marginItems, marginPct } from "./mock/margin";
import { installedEquipment } from "./mock/installed";
import {
  designMeasurement,
  bomTotalManwon,
  designIndustryOptions,
  designTargetOptions,
  designCollectionOptions,
  designEnvironmentOptions,
} from "./mock/design";
import { reports } from "./mock/reports";
import { beforeAfter, readiness, fundPrograms, evidenceSummary } from "./mock/policy";
import { serviceCatalog, platformUpdates, platformStages } from "./mock/customer-portal";
import type {
  Customer,
  DesignInput,
  InstalledEquipment,
  InventoryItem,
  MarginItem,
  RecommendInput,
  RecommendedProduct,
  ServiceOffering,
  PlatformUpdate,
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

  // 마진 가드
  getMarginItems: (): MarginItem[] => marginItems,
  marginPct,

  // 설치장비 관리
  getInstalledEquipment: (): InstalledEquipment[] => installedEquipment,

  // 산업계측 설계
  getDesignOptions: () => ({
    designIndustryOptions,
    designTargetOptions,
    designCollectionOptions,
    designEnvironmentOptions,
  }),
  design: (input: DesignInput) => designMeasurement(input),
  bomTotalManwon,

  // 리포트 센터
  getReports: () => reports,

  // 정책자금 성과 분석
  getPolicyAnalysis: () => ({ beforeAfter, readiness, fundPrograms, evidenceSummary }),

  // 고객 플랫폼 — 서비스 확장 로드맵
  getServiceCatalog: (): ServiceOffering[] => serviceCatalog,
  getPlatformUpdates: (): PlatformUpdate[] => platformUpdates,
  getPlatformStages: () => platformStages,
};
