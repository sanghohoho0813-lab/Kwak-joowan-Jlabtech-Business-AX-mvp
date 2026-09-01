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
  stockValueManwon: number;
  turnoverRate: number; // 연 재고 회전율
  status: InventoryStatus;
  forecastDemand30: number; // 30일 예측 수요 (수량)
  reorderPoint: number; // 발주점
  needsOrder: boolean;
  monthlyTrend: number[]; // 최근 6개월 출고 수량
}

export interface DemandTrendPoint {
  date: string; // 표시 라벨
  actual: number | null; // 실제 출고 금액 (만원)
  forecast: number | null; // 예측 출고 금액 (만원)
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
  /** 총 재고 가치 (만원) */
  totalStockValueManwon: number;
  /** 30일 예상 출고 금액 (만원) — 예측값이며 실적이 아니다 */
  forecastDemand30Manwon: number;
  /** 발주 판단이 필요한 품목 수 */
  reorderItemCount: number;
  /** 재구매 시점이 도래한 고객사 수 */
  repurchaseCustomerCount: number;
  /** 30일 내 교정 예정 장비 수 */
  calibrationDueCount: number;
  /** 마진 하한선 아래로 판매 중인 품목 수 */
  marginRiskCount: number;
}

/* ------------------------------------------------------------------ *
 * 2단계 고도화 — 마진 가드
 * ------------------------------------------------------------------ */

export type MarginStatus = "안전" | "주의" | "위험";

export interface MarginItem {
  itemId: string;
  name: string;
  model: string;
  category: InventoryCategory;
  costManwon: number; // 매입 원가
  listPriceManwon: number; // 정가
  avgSellingManwon: number; // 최근 실판매 평균가
  floorMarginPct: number; // 마진 하한선
  soldQty90: number; // 최근 90일 판매 수량
}

/* ------------------------------------------------------------------ *
 * 2단계 고도화 — 설치장비 관리
 * ------------------------------------------------------------------ */

export type EquipmentStatus = "정상 가동" | "교정 필요" | "점검 요청" | "보증 만료";

export interface InstalledEquipment {
  id: string;
  customerId: string;
  customerName: string;
  site: string; // 설치 현장
  itemName: string;
  model: string;
  serial: string;
  installedDate: string; // ISO
  lastCalibrationDate: string; // ISO
  nextCalibrationDate: string; // ISO
  warrantyEndDate: string; // ISO
  status: EquipmentStatus;
  consumable?: string; // 정기 교체 소모품
  /** 소모품 교체 주기(개월) — 정기 배송·재구매 예측의 근거가 된다 */
  consumableCycleMonths?: number;
  /** 마지막 소모품 교체일 — 다음 교체 시점 계산에 쓴다 */
  lastConsumableDate?: string; // ISO
}

/* ------------------------------------------------------------------ *
 * 2단계 고도화 — 산업계측 설계
 * ------------------------------------------------------------------ */

export interface DesignInput {
  industry: string;
  target: string; // 측정 대상
  pointCount: number; // 계측 포인트 수
  collection: string; // 데이터 수집 방식
  environment: string;
}

export interface BomLine {
  name: string;
  model: string;
  qty: number;
  unitPriceManwon: number;
  role: string; // 구성상의 역할
}

export interface DesignResult {
  title: string;
  summary: string;
  layers: { name: string; description: string }[]; // 계측 구성 계층
  bom: BomLine[];
  installWeeks: number;
  notes: string[];
}

/* ------------------------------------------------------------------ *
 * 2단계 고도화 — 리포트 센터
 * ------------------------------------------------------------------ */

export type ReportKind =
  | "월간 운영 리포트"
  | "재고 회전 리포트"
  | "고객 재구매 리포트"
  | "마진 분석 리포트";

export interface ReportMetric {
  label: string;
  value: string;
  deltaLabel?: string;
  positive?: boolean;
}

export interface ReportDefinition {
  id: string;
  kind: ReportKind;
  description: string;
  period: string;
  metrics: ReportMetric[];
  highlights: string[];
}

/* ------------------------------------------------------------------ *
 * 2단계 고도화 — 정책자금 성과 분석
 * ------------------------------------------------------------------ */

/** 도입 전 / 목표 / 실측 3단 구조 — 실측이 없으면 measured 를 비운다 */
export interface BeforeAfterMetric {
  label: string;
  /** 도입 전 상태 (대부분 "측정 전") */
  before: string;
  /** 운영 목표 (실적이 아니라 목표임을 명시) */
  target: string;
  /** 실제 측정값. 아직 없으면 undefined → "측정 준비 중" 으로 표시 */
  measured?: string;
  note: string;
}

export type ReadinessState = "충족" | "진행 중" | "예정";

export interface ReadinessItem {
  requirement: string;
  state: ReadinessState;
  evidence: string;
}

/** 선정 확률이 아니라 "지금 검토할 단계"를 나타내는 상태값 */
export type FundReviewState =
  | "우선 검토"
  | "조건 확인 필요"
  | "중장기 검토"
  | "현재 대상 아님";

export interface FundProgram {
  name: string;
  agency: string;
  state: FundReviewState;
  scaleLabel: string;
  reason: string;
  /** 이 후보를 뒷받침하는 플랫폼 내 근거 */
  basis: string;
}

/* ------------------------------------------------------------------ *
 * 상태 저장 레이어 (localStorage → 이후 Supabase 테이블)
 * ------------------------------------------------------------------ */

export type OrderStatus = "발주 대기" | "발주 완료" | "입고 완료";

export interface PurchaseOrder {
  id: string;
  itemId: string;
  itemName: string;
  model: string;
  qty: number;
  amountManwon: number;
  status: OrderStatus;
  createdAt: string; // ISO
  memo?: string;
}

export interface SavedQuote {
  id: string;
  customerLabel: string;
  origin: "AI 추천" | "산업계측 설계";
  productSummary: string;
  totalManwon: number;
  createdAt: string; // ISO
}

export type ActivityKind =
  | "고객 연락"
  | "발주"
  | "견적"
  | "교정 예약"
  | "고객 요청"
  | "요청 처리"
  | "서비스 관심";

export interface ActivityLog {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  createdAt: string; // ISO
}

/* ------------------------------------------------------------------ *
 * 3단계 고도화 — 고객 플랫폼 (Customer Platform)
 *
 * 고객이 보낸 요청이 Business AX 로 넘어오고, 내부 처리 결과가 다시
 * 고객 화면에 반영되는 Closed Loop 의 중심 타입.
 * Supabase 전환 시 customer_requests 테이블과 1:1 대응한다.
 * ------------------------------------------------------------------ */

export type RequestType =
  | "교정 요청"
  | "소모품 요청"
  | "재구매 요청"
  | "추가 계측 상담"
  | "장비 문의";

/** 접수 → 완료 까지의 처리 단계 (순서 있음) */
export const REQUEST_STATUS_FLOW = [
  "접수",
  "검토 중",
  "일정·견적 제안",
  "처리 중",
  "완료",
] as const;

export type RequestStatus = (typeof REQUEST_STATUS_FLOW)[number];

export interface CustomerRequest {
  id: string;
  customerId: string;
  customerName: string;
  requestType: RequestType;
  equipmentId?: string;
  equipmentName?: string;
  title: string;
  detail: string;
  status: RequestStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  /** 제이랩테크가 남긴 답변 또는 다음 단계 안내 */
  response?: string;
  /** 견적으로 이어진 경우 SavedQuote.id */
  quoteId?: string;
}

/** 고객 플랫폼에 로그인했다고 가정하는 데모 고객사 */
export interface CustomerAccount {
  id: string;
  company: string;
  contactName: string;
  segment: string;
  region: string;
  /** 현재 거래 형태 — 연간 계약 전환이 확장 과제 중 하나다 */
  contractType: string;
  /** 첫 거래 시점 */
  since: string; // ISO
}

/* ------------------------------------------------------------------ *
 * 서비스 확장 로드맵
 *
 * 고객 플랫폼에서 "지금 되는 것"과 "준비 중인 것"을 같은 구조로 보여준다.
 * 준비 중·검토 중 항목은 동작하지 않는다. 대신 어떤 데이터가 이미 있고
 * 무엇이 더 필요한지를 함께 적어 과장 없이 확장 가능성만 전달한다.
 * ------------------------------------------------------------------ */

/** 이용 가능: 지금 동작 / 준비 중: 데이터는 있고 기능만 남음 / 검토 중: 실증·인증 선행 */
export type ServiceStage = "이용 가능" | "준비 중" | "검토 중";

/** 매출이 어떤 형태로 생기는지 — 건별인지 반복인지가 확장의 핵심이다 */
export type RevenueType = "건별 매출" | "반복 매출" | "자산 활용" | "유지·락인";

export interface ServiceOffering {
  id: string;
  /** 아이콘 키 — 화면 컴포넌트에서 Lucide 아이콘으로 매핑한다 */
  icon: string;
  title: string;
  summary: string;
  stage: ServiceStage;
  revenueType: RevenueType;
  /** 지금 이 플랫폼에 이미 준비되어 있는 것 */
  ready: string[];
  /** 어떤 순서로 구현되는가 */
  how: string[];
  /** 고객이 얻는 것 */
  customerGain: string[];
  /** 제이랩테크의 수익 구조 — 금액이 아니라 구조로 적는다 */
  revenueModel: string;
  /** 시작하기 전에 반드시 정리되어야 하는 것 */
  prerequisite: string;
  /** 적용 대상 규모 — 플랫폼 데이터에서 계산되는 값의 설명 */
  scopeNote?: string;
}

/* ------------------------------------------------------------------ *
 * 데이터·AI 상태 표기 — 화면에서 무엇이 데모이고 무엇이 실제인지 구분
 * ------------------------------------------------------------------ */

/** DEMO: 시연용 가상 데이터 / TARGET: 목표치 / ACTUAL: 실제 기록 */
export type DataKind = "DEMO" | "TARGET" | "ACTUAL";

/* ------------------------------------------------------------------ *
 * 서비스 관심 표시
 *
 * 준비 중·검토 중 서비스에 고객이 남기는 신호. 기능을 되는 척하는 것이 아니라
 * "나오면 쓰겠다"는 의사만 실제로 기록한다. 내부에서는 이것이 무엇을 먼저
 * 만들지 정하는 근거가 된다.
 * ------------------------------------------------------------------ */

export interface ServiceInterest {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceStage: ServiceStage;
  customerId: string;
  customerName: string;
  createdAt: string; // ISO
}

/** 플랫폼 변경 이력 — 이 화면이 계속 자란다는 것을 보여준다 */
export interface PlatformUpdate {
  version: string;
  date: string; // ISO (예정 항목은 분기 표기)
  title: string;
  body: string;
  state: "적용됨" | "다음 예정" | "검토 중";
}
