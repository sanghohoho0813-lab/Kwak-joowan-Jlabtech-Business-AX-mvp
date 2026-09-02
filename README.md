# JLAB TECH AX MVP

**Industrial Measurement Business AX** — 산업·환경 계측 데이터를 기반으로 내부 운영과
고객 장비 운영지원을 함께 다루는 통합 AX MVP.

아이보리 & 딥그린 프리미엄 디자인을 기본 브랜드로 하며, 제이랩테크가
"계측기를 납품하는 회사"에서 "고객의 계측 장비 운영을 함께 관리하는 회사"로
확장되는 구조를 실제 화면과 기록으로 보여줍니다.

> **현재 v0.3.0** — 내부 Business AX(1단계)에 고객 플랫폼과 Closed Loop(2단계)를 더했습니다.
> 화면의 재고·고객 수치는 시연용 DEMO 데이터이며, 발주·견적·고객 요청 기록은 실제로 저장됩니다.

## 실행 방법

```bash
npm install
npm run dev     # http://localhost:3000

npm run build
npm run start
```

## 두 개의 Surface

### Business AX — 내부 운영

| 경로 | 설명 |
| --- | --- |
| `/` | 대시보드 — 오늘의 실행 과제, KPI, 출고 추이, 인사이트, 활동 이력 |
| `/requests` | **고객 요청** — 고객 플랫폼 접수분 처리 (상태 전진 시 고객 화면 반영) |
| `/inventory` | 재고·수요 관리 — 발주 등록·상태 관리 |
| `/recommend` | AI 추천·견적 — 견적 저장·이력 *(규칙 기반 Preview)* |
| `/repurchase` | 재구매 예측 — 연락 기록 |
| `/margin` | 마진 가드 — 할인 시뮬레이터, 하한선 경보 |
| `/installed` | 설치장비 관리 — 교정 주기, 방문 예약 |
| `/design` | 산업계측 설계 — BOM·구축 비용 → 견적 전환 *(규칙 기반 Preview)* |
| `/evidence` | **AX 실증성과** — 실제 기록만 집계, 근거까지 추적 |
| `/reports` | 리포트 센터 — 4종 리포트, 인쇄 |
| `/policy` | 정책자금 성과 분석 — 상태형 검토 단계, 기관별 브리핑 |
| `/intent` | 기획의도 — 왜 만들었는가 |
| `/presentation` | **대표 시연** — 10단계 스토리 |
| `/tutorial` | 사용 방법 — 스텝형 투어 |
| `/settings` | 설정 — 글자 크기, 테마 6종, 모션, 역할, 데이터 상태 |

### Customer Platform — 고객용

| 경로 | 설명 |
| --- | --- |
| `/customer` | 고객 홈 — 사용 흐름, 요약, 다가오는 일정, 요청, **성장 단계**, **업데이트 소식** |
| `/customer/equipment` | 내 장비 — 검색·필터, 교정 시점·보증, 운영 이력, 장비별 요청 |
| `/customer/requests` | 요청 내역 — 진행 단계, 제이랩테크 답변 |
| `/customer/services` | **서비스 허브** — 단계별 색 밴드 · 카드 → 상세 시트 · 관심 표시 |

두 Surface는 양쪽 상단의 **[관리자 화면 | 고객 화면] 스위처**로 오갑니다 (시연용).
두 칸이 항상 함께 보이고 현재 있는 쪽이 채워져 있어, 지금 위치와 이동 방향이 같이 읽힙니다.

고객 플랫폼 우상단의 **햄버거 버튼**은 [계정·고객사 전환 / 홈·내 장비·요청 내역 / 서비스 / 화면 전환]을 엽니다.
계정 칩과 드로어에서 **다른 고객사 예시로 보기**로 데모 고객사 3곳을 오갈 수 있습니다 (시연용).

## Closed Loop

```
고객 플랫폼            Business AX            직원 처리          고객 플랫폼
장비 확인       →     요청 접수       →     검토·제안·처리  →  상태 업데이트
교정·소모품 요청       재고·견적 판단         발주/견적 생성      완료 안내
                                  ↓
                  요청 데이터 → 재구매 예측 → 재고 수요 → 다음 제안
```

## 데이터 흐름

```
읽기: 화면 → data/repository.ts    → data/mock/*      (→ Supabase select)
쓰기: 화면 → lib/store-context.tsx → localStorage     (→ Supabase insert/update)
```

저장되는 것: 발주 · 견적 · 고객 요청 · **확장 서비스 관심 표시** · 활동 이력.
`/evidence`에서 이 기록만 집계하며, 각 수치를 누르면 근거가 되는 개별 기록을 볼 수 있습니다.

## 프로젝트 구조

```
src/
├── app/
│   ├── (Business AX 15개 라우트)
│   ├── customer/         # 고객 플랫폼 (자체 셸)
│   └── presentation/     # 대표 시연 (전체 화면)
├── components/
│   ├── layout/           # 사이드바, 탑바, 드로어, 시계, 기기 미리보기
│   ├── customer/         # 고객 셸, 요청 모달, 상태 배지
│   ├── intent/           # Closed Loop 다이어그램, 사진 자리표시자
│   ├── ui/               # Card, Badge, Button, Toast, StatusChip, Motion
│   └── charts/           # Recharts 기반 차트 (테마 변수 연동)
├── data/
│   ├── types.ts          # 도메인 타입 (Supabase 스키마 전제)
│   ├── mock/             # mock 데이터 + 규칙 기반 추천·설계 엔진
│   └── repository.ts     # 읽기 전용 접근 레이어
└── lib/
    ├── settings-context.tsx  # 글자 크기·테마·모션·역할
    ├── store-context.tsx     # 발주·견적·요청·활동 저장
    └── utils.ts
```

## 표기 원칙

| 구분 | 의미 |
| --- | --- |
| `DEMO DATA` | 시연용 가상 데이터 — 실제 실적이 아님 |
| `TARGET` | 목표치 — 아직 측정되지 않음 |
| `ACTUAL` | 이 플랫폼에 실제로 기록된 값 |
| `AI PREVIEW` | 규칙 기반 — 실제 LLM API 미연결 |
| `이용 가능` | 고객 플랫폼에서 지금 동작하는 서비스 |
| `준비 중` | 데이터는 이미 있고 기능 구현만 남은 서비스 |
| `검토 중` | 실증·검증이 선행되어야 하는 서비스 — 동작하지 않음 |

정책자금 선정 확률, 근거 없는 개선율, 임의 성과 수치는 표시하지 않습니다.

## 관련 문서

- [`PROJECT_SPEC.md`](./PROJECT_SPEC.md) — 목적, 범위, 디자인·데이터 원칙
- [`PROJECT_STATE.md`](./PROJECT_STATE.md) — 현재 상태, 다음 단계, Known Issues, Supabase 전환 계획
- [`DECISIONS.md`](./DECISIONS.md) — 주요 결정과 이유
