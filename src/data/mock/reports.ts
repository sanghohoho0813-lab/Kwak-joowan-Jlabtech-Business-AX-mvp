import type { ReportDefinition } from "../types";

export const reports: ReportDefinition[] = [
  {
    id: "rp-ops",
    kind: "월간 운영 리포트",
    description: "재고·수요·고객·매출 기회를 한 장으로 요약한 경영 보고용 리포트입니다.",
    period: "2026년 8월 (8.01 ~ 8.20)",
    metrics: [
      { label: "총 재고 가치", value: "₩ 48.7억", deltaLabel: "전월 대비 +2.4%", positive: true },
      { label: "예측 수요 (30일)", value: "₩ 62.3억", deltaLabel: "전월 대비 +8.7%", positive: true },
      { label: "예상 매출 기회", value: "₩ 35.6억", deltaLabel: "전월 대비 +12.1%", positive: true },
      { label: "발주 필요 품목", value: "4개 품목", deltaLabel: "전월 대비 -1건", positive: true },
    ],
    highlights: [
      "온도 센서(TS-200)의 수요가 3개월 연속 증가해 발주 주기를 4주에서 3주로 단축할 필요가 있습니다.",
      "예상 매출 기회 35.6억 중 12.2억이 기존 고객 재구매에서 발생할 것으로 추정됩니다.",
      "압력 센서(PS-150) 과잉 재고가 유지되고 있어 패키지 구성 검토가 필요합니다.",
    ],
  },
  {
    id: "rp-turn",
    kind: "재고 회전 리포트",
    description: "품목별 재고 회전율과 자금 묶임 현황을 분석합니다.",
    period: "2026년 3분기 누적",
    metrics: [
      { label: "평균 회전율", value: "3.4회", deltaLabel: "전분기 대비 +0.3회", positive: true },
      { label: "과잉 재고 금액", value: "₩ 4.4억", deltaLabel: "전분기 대비 -0.6억", positive: true },
      { label: "회전율 최저 품목", value: "PS-150 (1.2회)" },
      { label: "회전율 최고 품목", value: "CAL-KIT-A (6.4회)" },
    ],
    highlights: [
      "액세서리 카테고리의 회전율이 가장 높아 정기 납품 계약 확대 여지가 있습니다.",
      "분석 장비는 회전율이 낮지만 건당 마진이 높아 별도 기준으로 관리하는 것이 적절합니다.",
      "과잉 재고 4.4억 중 약 2.1억은 패키지 판매로 6개월 내 해소 가능한 것으로 추정됩니다.",
    ],
  },
  {
    id: "rp-repurchase",
    kind: "고객 재구매 리포트",
    description: "기존 고객의 구매 주기와 재구매 기회를 정리합니다.",
    period: "2026년 8월 기준",
    metrics: [
      { label: "관리 고객사", value: "8개사" },
      { label: "이번 달 재구매 예상", value: "5개사", deltaLabel: "전월 대비 +2개사", positive: true },
      { label: "예상 재구매 금액", value: "₩ 1.22억", deltaLabel: "우선 관리 고객 기준" },
      { label: "평균 구매 주기", value: "6.5개월" },
    ],
    highlights: [
      "한성정밀화학·그린워터솔루션은 소모품 교체 주기가 도래해 즉시 연락이 필요합니다.",
      "설치장비 대장의 교정 일정과 재구매 예상일이 5개사에서 일치해, 방문 시 동시 제안이 가능합니다.",
      "연구소 고객군은 구매 주기가 9개월 이상으로 길어 별도 관리 기준이 필요합니다.",
    ],
  },
  {
    id: "rp-margin",
    kind: "마진 분석 리포트",
    description: "품목별 마진 구조와 할인으로 인한 수익 영향을 분석합니다.",
    period: "최근 90일",
    metrics: [
      { label: "평균 마진율", value: "27.4%", deltaLabel: "하한선 대비 +2.1%p", positive: true },
      { label: "마진 위험 품목", value: "2개 품목", deltaLabel: "즉시 조정 필요", positive: false },
      { label: "할인 손실 추정", value: "₩ 1.8억", deltaLabel: "정가 대비 실판매 차액" },
      { label: "개선 기회", value: "₩ 0.9억", deltaLabel: "하한선 복원 시 추정" },
    ],
    highlights: [
      "온도 센서(TS-200)의 실판매 마진율이 하한선을 밑돌아 단가 재협상이 필요합니다.",
      "압력 센서(PS-150)는 할인 폭이 커 판매량 대비 수익 기여가 낮습니다.",
      "액세서리 품목은 마진율이 높아 장비 판매 시 동반 제안을 늘리는 것이 유효합니다.",
    ],
  },
];
