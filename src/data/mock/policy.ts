import type { BeforeAfterMetric, ReadinessItem, FundProgram } from "../types";

/**
 * 정책자금 성과 분석
 * 수치는 AX 플랫폼 도입 효과를 보수적으로 가정한 추정치이며,
 * 실제 데이터 연동(2단계) 이후 실측치로 대체된다.
 */

export const beforeAfter: BeforeAfterMetric[] = [
  {
    label: "재고 파악 소요 시간",
    before: "반나절 (수기 집계)",
    after: "즉시 (대시보드)",
    changeLabel: "의사결정 지연 해소",
    note: "품목별 재고·예측 수요를 상시 확인할 수 있게 되었습니다.",
  },
  {
    label: "견적 작성 소요 시간",
    before: "평균 2~3시간",
    after: "평균 20분 이내",
    changeLabel: "약 80% 단축(추정)",
    note: "추천·견적 흐름 자동화로 담당자별 품질 편차도 줄어듭니다.",
  },
  {
    label: "재고 회전율",
    before: "3.1회",
    after: "3.4회",
    changeLabel: "+0.3회",
    note: "과잉 재고 조기 감지로 묶인 자금이 줄어듭니다.",
  },
  {
    label: "기존 고객 재구매 대응",
    before: "고객 문의 후 대응",
    after: "예상 시점 사전 제안",
    changeLabel: "선제 영업 전환",
    note: "구매 주기·교정 주기 데이터를 근거로 먼저 접촉합니다.",
  },
  {
    label: "운영 데이터 축적",
    before: "담당자 개인 기록",
    after: "플랫폼 통합 기록",
    changeLabel: "자산화 시작",
    note: "발주·견적·고객 접촉 이력이 회사 자산으로 남습니다.",
  },
];

export const readiness: ReadinessItem[] = [
  {
    requirement: "데이터 기반 운영 체계 보유",
    state: "충족",
    evidence: "재고·수요·고객 데이터를 통합 관리하는 AX 플랫폼 운영 중",
  },
  {
    requirement: "AI·자동화 기술 적용",
    state: "충족",
    evidence: "수요 예측, 제품 추천·견적 자동화, 재구매 시점 예측 기능 구현",
  },
  {
    requirement: "정량 성과 지표 산출 가능",
    state: "충족",
    evidence: "리포트 센터에서 월간 운영·재고 회전·마진 분석 리포트 자동 생성",
  },
  {
    requirement: "실데이터 연동 및 축적",
    state: "진행 중",
    evidence: "현재 데모 데이터 기반. 판매·재고 시스템 연동은 다음 단계 과제",
  },
  {
    requirement: "사업 모델 전환 근거 제시",
    state: "진행 중",
    evidence: "장비 판매 → 계측 데이터 기반 운영 지원으로의 확장 로드맵 수립",
  },
  {
    requirement: "고객 대상 데이터 서비스 제공",
    state: "예정",
    evidence: "설치장비 상태·교정 이력을 고객에게 제공하는 포털은 3단계 계획",
  },
];

export const fundPrograms: FundProgram[] = [
  {
    name: "스마트공장 구축·고도화 지원사업",
    agency: "중소벤처기업부 / 스마트제조혁신추진단",
    fitPct: 88,
    scaleLabel: "최대 2억원 내외",
    reason:
      "제조 현장 계측 데이터 수집·분석 체계를 갖춘 점이 고도화 단계 요건에 부합합니다.",
  },
  {
    name: "중소기업 디지털 전환(DX) 지원",
    agency: "중소벤처기업진흥공단",
    fitPct: 84,
    scaleLabel: "기업당 수천만원 규모",
    reason: "수기 업무의 디지털 전환과 데이터 기반 의사결정 사례로 제시할 수 있습니다.",
  },
  {
    name: "사업전환 지원사업",
    agency: "중소벤처기업진흥공단",
    fitPct: 79,
    scaleLabel: "정책자금 융자 연계",
    reason:
      "장비 유통에서 계측 데이터 기반 서비스로 확장하는 방향이 사업전환 계획과 연결됩니다.",
  },
  {
    name: "기술개발(R&D) 지원사업",
    agency: "중소기업기술정보진흥원",
    fitPct: 66,
    scaleLabel: "과제별 상이",
    reason:
      "수요 예측·이상 감지 알고리즘 고도화를 과제화할 경우 지원 대상이 될 수 있습니다.",
  },
];

export const evidenceSummary = [
  "제이랩테크는 산업·환경 계측 장비 공급 과정에서 발생하는 재고, 판매, 고객 구매 주기 데이터를 통합 관리하는 AX 플랫폼을 구축했습니다.",
  "본 플랫폼은 수요 예측 기반 발주 판단, 고객 조건에 따른 장비 추천·견적 자동화, 설치장비 교정 주기와 연계한 재구매 시점 예측 기능을 제공합니다.",
  "이를 통해 재고 운영 효율과 기존 고객 대상 매출 기회를 동시에 개선하고 있으며, 운영 성과는 플랫폼 내 리포트로 정량 산출됩니다.",
  "향후 실제 판매·재고 시스템 연동을 통해 축적되는 데이터는 사업 고도화 성과의 근거 자료로 활용될 예정입니다.",
];
