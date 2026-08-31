import type { ReportDefinition } from "../types";

/** DEMO DATA — 실제 실적이 아니며, 데이터 연동 후 실측치로 대체된다. */
export const reports: ReportDefinition[] = [
  {
    id: "rp-ops",
    kind: "월간 운영 리포트",
    description: "재고·수요·고객·요청을 한 장으로 요약한 경영 보고용 리포트입니다.",
    period: "2026년 8월 (8.01 ~ 8.20)",
    metrics: [
      { label: "총 재고 가치", value: "2억 2,530만원" },
      { label: "30일 예상 출고", value: "4,020만원", deltaLabel: "예측값" },
      { label: "발주 필요 품목", value: "4개 품목", deltaLabel: "즉시 판단 필요", positive: false },
      { label: "재구매 대상 고객", value: "5개 고객사" },
    ],
    highlights: [
      "온도 센서(TS-200)의 출고량이 6개월 연속 증가해 발주 주기 단축을 검토할 시점입니다.",
      "재구매 예상 시점이 도래한 고객사가 5곳이며, 이 중 2곳은 소모품 교체 주기와 겹칩니다.",
      "압력 센서(PS-150) 과잉 재고에 약 2,160만원이 묶여 있어 패키지 구성 검토가 필요합니다.",
    ],
  },
  {
    id: "rp-turn",
    kind: "재고 회전 리포트",
    description: "품목별 재고 회전율과 자금이 묶인 구간을 분석합니다.",
    period: "2026년 3분기 기준",
    metrics: [
      { label: "평균 회전율", value: "3.1회" },
      { label: "과잉 재고 금액", value: "2,160만원", positive: false },
      { label: "회전율 최저", value: "PS-150 (1.1회)" },
      { label: "회전율 최고", value: "CAL-KIT-A (5.8회)" },
    ],
    highlights: [
      "액세서리 카테고리의 회전율이 가장 높아 정기 납품 계약으로 묶을 여지가 있습니다.",
      "분석 장비는 회전율이 낮지만 건당 마진이 높아 별도 기준으로 관리하는 것이 적절합니다.",
      "전체 재고 2억 2,530만원 중 약 10%가 회전율 1.5회 미만 품목에 묶여 있습니다.",
    ],
  },
  {
    id: "rp-repurchase",
    kind: "고객 재구매 리포트",
    description: "기존 고객의 구매 주기, 설치장비 교정 시점, 접수된 요청을 함께 봅니다.",
    period: "2026년 8월 기준",
    metrics: [
      { label: "관리 고객사", value: "8개사" },
      { label: "이번 달 재구매 예상", value: "5개사" },
      { label: "30일 내 교정 예정", value: "5대" },
      { label: "평균 구매 주기", value: "6.5개월" },
    ],
    highlights: [
      "한성정밀화학·그린워터솔루션은 소모품 교체 주기가 도래해 즉시 연락이 필요합니다.",
      "설치장비 교정 일정과 재구매 예상일이 겹치는 고객사가 3곳으로, 방문 시 동시 제안이 가능합니다.",
      "연구소 고객군은 구매 주기가 9개월 이상으로 길어 별도 관리 기준이 필요합니다.",
    ],
  },
  {
    id: "rp-margin",
    kind: "마진 분석 리포트",
    description: "품목별 마진 구조와 할인이 수익에 미치는 영향을 분석합니다.",
    period: "최근 90일",
    metrics: [
      { label: "평균 마진율", value: "28.6%", deltaLabel: "판매량 가중" },
      { label: "마진 위험 품목", value: "3개 품목", deltaLabel: "하한선 미달", positive: false },
      { label: "할인 손실 추정", value: "1,120만원", deltaLabel: "정가 대비 차액" },
      { label: "회복 가능 금액", value: "약 480만원", deltaLabel: "하한선 복원 시" },
    ],
    highlights: [
      "온도 센서(TS-200)는 판매량이 가장 많으면서 마진율이 하한선을 밑돌아, 회복 시 효과가 가장 큽니다.",
      "압력 센서(PS-150)는 할인 폭이 커 판매량 대비 수익 기여가 낮습니다.",
      "액세서리(교정 키트·pH 프로브)는 마진율이 40% 이상으로, 장비 판매 시 동반 제안 가치가 큽니다.",
    ],
  },
];
