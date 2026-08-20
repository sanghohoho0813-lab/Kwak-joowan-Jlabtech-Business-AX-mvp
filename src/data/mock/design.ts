import type { DesignInput, DesignResult, BomLine } from "../types";

/**
 * 산업계측 설계 — 현장 조건으로부터 계측 구성(BOM)을 산출하는 규칙 엔진.
 * 실제 서비스에서는 이 함수를 설계 표준 DB 또는 LLM 기반 설계 도우미로 교체한다.
 */

export const designIndustryOptions = [
  "화학·정유 플랜트",
  "상하수도·정수장",
  "제철·금속",
  "연구소·시험동",
  "환경 측정망",
];

export const designTargetOptions = [
  "수질 (pH·탁도·용존산소)",
  "설비 진동·상태",
  "온도·항온 환경",
  "가스·대기질",
];

export const designCollectionOptions = ["유선 집중식", "무선 게이트웨이", "휴대 측정 병행"];

export const designEnvironmentOptions = [
  "실내 상시",
  "옥외 노출",
  "고온·다습",
  "방폭 구역",
];

const SENSOR_BY_TARGET: Record<string, { name: string; model: string; unit: number; role: string }> = {
  "수질 (pH·탁도·용존산소)": {
    name: "다항목 수질 측정기",
    model: "WM-700",
    unit: 486,
    role: "계측 포인트별 다항목 측정",
  },
  "설비 진동·상태": {
    name: "진동 센서",
    model: "VS-300",
    unit: 99,
    role: "회전 설비 이상 징후 감지",
  },
  "온도·항온 환경": {
    name: "온도 센서",
    model: "TS-200",
    unit: 97,
    role: "구역별 온도 상시 측정",
  },
  "가스·대기질": {
    name: "가스 측정기",
    model: "GM-400",
    unit: 375,
    role: "복합 가스 4종 동시 감지",
  },
};

const ACCESSORY_BY_TARGET: Record<string, { name: string; model: string; unit: number; role: string }> = {
  "수질 (pH·탁도·용존산소)": {
    name: "pH 전극 프로브",
    model: "PRB-PH20",
    unit: 14,
    role: "정기 교체 소모품 (4~6개월)",
  },
  "설비 진동·상태": {
    name: "설치 브래킷 세트",
    model: "BRK-STD",
    unit: 4,
    role: "센서 고정 및 진동 전달",
  },
  "온도·항온 환경": {
    name: "실드 케이블",
    model: "CBL-SH10",
    unit: 3,
    role: "노이즈 차단 배선",
  },
  "가스·대기질": {
    name: "센서 카트리지",
    model: "CTR-G4",
    unit: 32,
    role: "정기 교체 소모품 (12개월)",
  },
};

export function designMeasurement(input: DesignInput): DesignResult {
  const points = Math.max(1, input.pointCount);
  const sensor = SENSOR_BY_TARGET[input.target] ?? SENSOR_BY_TARGET["수질 (pH·탁도·용존산소)"];
  const accessory =
    ACCESSORY_BY_TARGET[input.target] ?? ACCESSORY_BY_TARGET["수질 (pH·탁도·용존산소)"];

  const isWireless = input.collection.includes("무선");
  const isHarsh = input.environment.includes("방폭") || input.environment.includes("고온");
  const isOutdoor = input.environment.includes("옥외");

  // 데이터로거 1대당 4포인트 수용
  const loggerQty = Math.ceil(points / 4);

  const bom: BomLine[] = [
    { name: sensor.name, model: sensor.model, qty: points, unitPriceManwon: sensor.unit, role: sensor.role },
    {
      name: "데이터로거",
      model: "DL-500",
      qty: loggerQty,
      unitPriceManwon: 80,
      role: `계측 포인트 ${points}개 수집 (1대당 4포인트)`,
    },
    {
      name: accessory.name,
      model: accessory.model,
      qty: points,
      unitPriceManwon: accessory.unit,
      role: accessory.role,
    },
  ];

  if (isWireless) {
    bom.push({
      name: "무선 게이트웨이",
      model: "GW-LTE1",
      qty: Math.max(1, Math.ceil(loggerQty / 3)),
      unitPriceManwon: 46,
      role: "현장 데이터 원격 전송 (LTE)",
    });
  }
  if (isHarsh) {
    bom.push({
      name: "특수 환경 하우징",
      model: "HSG-EX",
      qty: points,
      unitPriceManwon: 18,
      role: input.environment.includes("방폭")
        ? "방폭 구역 설치용 인증 하우징"
        : "고온·다습 환경 보호 하우징",
    });
  }
  if (isOutdoor) {
    bom.push({
      name: "옥외 설치 함체",
      model: "ENC-IP66",
      qty: loggerQty,
      unitPriceManwon: 22,
      role: "IP66 등급 옥외 수용 함체",
    });
  }

  const layers = [
    {
      name: "1. 계측 계층",
      description: `${sensor.name} ${points}개소 — ${sensor.role}`,
    },
    {
      name: "2. 수집 계층",
      description: `데이터로거 ${loggerQty}대로 ${points}개 포인트 신호를 통합 수집`,
    },
    {
      name: "3. 전송 계층",
      description: isWireless
        ? "무선 게이트웨이를 통해 현장 데이터를 원격 서버로 전송"
        : "유선 집중식 배선으로 관제실 수집 서버에 직접 연결",
    },
    {
      name: "4. 운영 계층",
      description: "수집된 계측 데이터를 AX 플랫폼에서 이상 감지·소모품 교체 주기 관리에 활용",
    },
  ];

  const notes = [
    `${input.industry} 기준 표준 구성이며, 현장 실측 후 포인트 위치는 조정될 수 있습니다.`,
    isHarsh
      ? "위험·고온 구역은 설치 전 안전 인증 확인이 필요합니다."
      : "표준 환경 기준으로 별도 인증 절차는 필요하지 않습니다.",
    `소모품(${accessory.name})은 정기 교체 대상으로, 설치 후 재구매 예측에 자동 반영됩니다.`,
  ];

  const installWeeks = points <= 8 ? 2 : points <= 20 ? 4 : 6;

  return {
    title: `${input.industry} · ${input.target.split(" ")[0]} 계측 구성 (${points}포인트)`,
    summary: `${input.collection} 방식으로 ${points}개 계측 포인트를 구성하고, 데이터로거 ${loggerQty}대로 통합 수집하는 표준 설계안입니다.`,
    layers,
    bom,
    installWeeks,
    notes,
  };
}

export function bomTotalManwon(bom: BomLine[]): number {
  return bom.reduce((sum, line) => sum + line.qty * line.unitPriceManwon, 0);
}
