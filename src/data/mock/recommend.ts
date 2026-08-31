import type { RecommendInput, RecommendedProduct, QuoteLine } from "../types";

/**
 * 규칙 기반 추천 엔진 (mock)
 * 실제 서비스에서는 이 함수만 LLM/추천 API 호출로 교체하면 된다.
 */

export const industryOptions = [
  "제조 공장",
  "수처리·환경",
  "연구소·시험기관",
  "플랜트·현장 운영",
  "공공·상하수도",
];

export const purposeOptions = [
  "설비 상태 모니터링",
  "수질 측정·분석",
  "온도·환경 관리",
  "가스·대기 측정",
  "데이터 수집·기록",
];

export const environmentOptions = [
  "실내 상시 계측",
  "옥외·현장 계측",
  "고온·다습 환경",
  "방폭·위험 구역",
];

export const budgetOptions = [
  "300만원 이하",
  "300만~1,000만원",
  "1,000만~3,000만원",
  "3,000만원 이상",
];

interface Rule {
  match: (input: RecommendInput) => boolean;
  products: RecommendedProduct[];
}

const P = {
  wm700: (score: number, reasons: string[]): RecommendedProduct => ({
    itemId: "wm-700",
    name: "다항목 수질 측정기",
    model: "WM-700",
    priceManwon: 320,
    matchScore: score,
    reasons,
    accessories: [
      { name: "pH 전극 프로브 PRB-PH20", priceManwon: 14 },
      { name: "교정 키트 CAL-KIT-A", priceManwon: 6 },
    ],
  }),
  an1000: (score: number, reasons: string[]): RecommendedProduct => ({
    itemId: "an-1000",
    name: "수질 분석기",
    model: "AN-1000",
    priceManwon: 680,
    matchScore: score,
    reasons,
    accessories: [
      { name: "시약 세트 (분기분)", priceManwon: 32 },
      { name: "교정 키트 CAL-KIT-A", priceManwon: 6 },
    ],
  }),
  vs300: (score: number, reasons: string[]): RecommendedProduct => ({
    itemId: "vs-300",
    name: "진동 센서",
    model: "VS-300",
    priceManwon: 42,
    matchScore: score,
    reasons,
    accessories: [
      { name: "설치 브래킷 세트", priceManwon: 4 },
      { name: "데이터로거 DL-500", priceManwon: 55 },
    ],
  }),
  ts200: (score: number, reasons: string[]): RecommendedProduct => ({
    itemId: "ts-200",
    name: "온도 센서",
    model: "TS-200",
    priceManwon: 28,
    matchScore: score,
    reasons,
    accessories: [
      { name: "고온용 실드 케이블", priceManwon: 3 },
      { name: "데이터로거 DL-500", priceManwon: 55 },
    ],
  }),
  gm400: (score: number, reasons: string[]): RecommendedProduct => ({
    itemId: "gm-400",
    name: "가스 측정기",
    model: "GM-400",
    priceManwon: 245,
    matchScore: score,
    reasons,
    accessories: [
      { name: "센서 카트리지 (연 1회 교체)", priceManwon: 22 },
      { name: "휴대용 보호 케이스", priceManwon: 8 },
    ],
  }),
  dl500: (score: number, reasons: string[]): RecommendedProduct => ({
    itemId: "dl-500",
    name: "데이터로거",
    model: "DL-500",
    priceManwon: 55,
    matchScore: score,
    reasons,
    accessories: [
      { name: "무선 통신 모듈", priceManwon: 12 },
      { name: "확장 채널 커넥터", priceManwon: 5 },
    ],
  }),
  th800: (score: number, reasons: string[]): RecommendedProduct => ({
    itemId: "th-800",
    name: "열화상 측정기",
    model: "TH-800",
    priceManwon: 580,
    matchScore: score,
    reasons,
    accessories: [
      { name: "교정 서비스 (연 1회)", priceManwon: 18 },
      { name: "전용 삼각대", priceManwon: 9 },
    ],
  }),
};

export function recommendProducts(input: RecommendInput): RecommendedProduct[] {
  const results: RecommendedProduct[] = [];
  const isOutdoor = input.environment.includes("옥외") || input.environment.includes("현장");
  const isHarsh = input.environment.includes("고온") || input.environment.includes("방폭");

  if (input.purpose.includes("수질")) {
    results.push(
      P.wm700(96, [
        `${input.industry} 현장에서 가장 많이 도입되는 다항목 측정 모델입니다.`,
        "pH·탁도·용존산소를 1대로 측정해 초기 도입 비용을 줄일 수 있습니다.",
        isOutdoor ? "IP67 방수 등급으로 옥외·현장 계측에 적합합니다." : "실내 상시 계측 시 자동 기록 기능을 활용할 수 있습니다.",
      ]),
    );
    if (input.budget.includes("3,000만원 이상") || input.budget.includes("1,000만~3,000만원")) {
      results.push(
        P.an1000(88, [
          "정밀 분석이 필요한 경우 실험실급 정확도를 제공합니다.",
          "측정 데이터의 공인 성적서 발급 요구에 대응할 수 있습니다.",
        ]),
      );
    }
  }

  if (input.purpose.includes("설비")) {
    results.push(
      P.vs300(94, [
        "회전 설비 이상 징후를 조기에 감지하는 표준 구성입니다.",
        `${input.industry} 고객사 재구매율이 가장 높은 모델입니다.`,
        isHarsh ? "고온 환경용 하우징 옵션을 함께 제안합니다." : "표준 하우징으로 충분한 환경입니다.",
      ]),
      P.dl500(82, [
        "센서 데이터를 자동 수집·기록해 점검 인력 부담을 줄입니다.",
        "향후 예지보전 분석의 기반 데이터를 축적할 수 있습니다.",
      ]),
    );
  }

  if (input.purpose.includes("온도")) {
    results.push(
      P.ts200(93, [
        isHarsh
          ? "고온·다습 환경 검증(85℃/95%RH)을 통과한 모델입니다."
          : "설치가 간단하고 유지 비용이 낮은 표준 온도 센서입니다.",
        "다점 온도 관리 시 데이터로거와 조합해 배선 비용을 줄일 수 있습니다.",
      ]),
      P.th800(78, [
        "비접촉 방식으로 가동 중 설비의 온도 분포를 확인할 수 있습니다.",
        "전기 패널·베어링 과열 점검 용도로 함께 도입하는 사례가 많습니다.",
      ]),
    );
  }

  if (input.purpose.includes("가스")) {
    results.push(
      P.gm400(95, [
        input.environment.includes("방폭")
          ? "방폭 인증(Ex d IIC T6) 모델로 위험 구역에 바로 투입 가능합니다."
          : "복합 가스 4종을 동시 측정하는 현장 표준 모델입니다.",
        "센서 카트리지 정기 교체로 장기 운영 비용이 예측 가능합니다.",
      ]),
    );
  }

  if (input.purpose.includes("데이터")) {
    results.push(
      P.dl500(97, [
        "기존 보유 센서와 호환되는 범용 데이터로거입니다.",
        "수기 기록을 자동화해 기록 누락과 인력 부담을 줄입니다.",
        "향후 AX 플랫폼 연동 시 데이터 축적의 출발점이 됩니다.",
      ]),
    );
  }

  // fallback — 어떤 조건에도 안 걸리면 대표 모델 제안
  if (results.length === 0) {
    results.push(
      P.wm700(85, ["입력하신 조건에서 가장 범용적으로 활용 가능한 측정 장비입니다."]),
      P.dl500(80, ["측정 데이터 기록·관리 체계를 만드는 기본 구성입니다."]),
    );
  }

  return results.slice(0, 3).sort((a, b) => b.matchScore - a.matchScore);
}

export function buildQuote(products: RecommendedProduct[]): QuoteLine[] {
  const main = products.reduce((sum, p) => sum + p.priceManwon, 0);
  const acc = products.reduce(
    (sum, p) => sum + p.accessories.reduce((s, a) => s + a.priceManwon, 0),
    0,
  );
  const install = Math.max(30, Math.round(main * 0.05));
  const subtotal = main + acc + install;
  const discount = -Math.round(subtotal * 0.05);
  return [
    { label: "본체 장비", amountManwon: main, note: `${products.length}개 품목` },
    { label: "센서·소모품", amountManwon: acc, note: "함께 제안 품목" },
    { label: "설치·교정", amountManwon: install, note: "현장 설치 기준" },
    { label: "기존 고객 할인 (5%)", amountManwon: discount, note: "재구매 고객 적용" },
    { label: "예상 견적 합계", amountManwon: subtotal + discount },
  ];
}
