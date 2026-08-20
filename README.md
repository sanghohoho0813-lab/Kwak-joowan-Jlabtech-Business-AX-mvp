# JLAB TECH AX MVP

**Industrial Measurement Business AX** — 산업·환경 계측 데이터 기반으로 재고 운영, 장비 추천, 재구매 기회를 관리하는 데모형 MVP.

아이보리 & 딥그린 프리미엄 디자인 컨셉으로, 제이랩테크가 "계측기 판매회사"에서 "계측 데이터 기반 AX 회사"로 확장되는 방향을 보여줍니다.

**현재 2단계** — 1단계의 핵심 3개 기능에 수익·자산 관리와 성과 분석 5개 모듈을 더해 총 9개 화면으로 확장했고, 발주·견적·고객 접촉이 실제로 기록되는 상태 저장 레이어를 도입했습니다.

## 실행 방법

```bash
npm install
npm run dev     # 개발 서버 (http://localhost:3000)

npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버
```

## 기술 스택

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (커스텀 디자인 토큰)
- shadcn/ui 스타일 컴포넌트 (자체 구현)
- Framer Motion (등장 모션 · 드로어 · 온보딩)
- Recharts (트렌드 · 도넛 · 스파크라인)
- Lucide Icons
- 상태 저장: mock data + localStorage

## 페이지 구성

### 운영 (1단계)

| 경로 | 설명 |
| --- | --- |
| `/` | 메인 대시보드 — 오늘의 실행 과제, KPI, 수요 예측 트렌드, 재고 구성, 인사이트, 활동 이력 |
| `/inventory` | 재고·수요 관리 — 품목 테이블, 필터/검색, **발주 등록·상태 관리** |
| `/recommend` | AI 제품추천·견적 — 고객 상황 입력 → 추천 카드 + **견적 저장·이력** |
| `/repurchase` | 재구매 예측 — 우선 관리 고객 카드, **연락 기록** |

### 수익·자산 관리 (2단계)

| 경로 | 설명 |
| --- | --- |
| `/margin` | 마진 가드 — 품목별 원가/판가 구조, **할인 시뮬레이터**, 하한선 경보, 개선 제안 |
| `/installed` | 설치장비 관리 — 고객 현장 장비 대장, 교정 주기·보증 상태, **방문 예약** |
| `/design` | 산업계측 설계 — 현장 조건 → 계측 구성·BOM·구축 비용, **견적 전환** |

### 분석·성과 (2단계)

| 경로 | 설명 |
| --- | --- |
| `/reports` | 리포트 센터 — 운영/재고 회전/재구매/마진 리포트 자동 생성, 인쇄·PDF |
| `/policy` | 정책자금 성과 분석 — 도입 전후 비교, 요건 점검, 사업 적합도, 근거 문단 초안 |

### 안내

| 경로 | 설명 |
| --- | --- |
| `/intent` | 기획의도 — 왜 이 시스템을 만들었는가 (10개 섹션) |
| `/tutorial` | 튜토리얼 — 스텝형 안내 + 확장 모듈 소개 + 온보딩 다시 보기 |
| `/settings` | 설정 — 글자 크기 조정(동작·영속), 알림, 테마, 저장 데이터 현황, 초기화 |

3단계 확장 예정 항목(**고객 데이터 포털 / 예지보전 분석**)은 사이드바에 비활성 목차로만 노출됩니다.

## 데이터 흐름 — 읽기와 쓰기의 분리

```
읽기:  화면 ──▶ data/repository.ts ──▶ data/mock/*        (→ 이후 Supabase select)
쓰기:  화면 ──▶ lib/store-context.tsx ──▶ localStorage    (→ 이후 Supabase insert/update)
```

- **읽기**는 전부 `repository.ts`를 거칩니다. 화면은 mock의 존재를 모릅니다.
- **쓰기**(발주 생성, 견적 저장, 고객 접촉·교정 예약 기록)는 `store-context.tsx`가 담당하며 localStorage에 영속됩니다. 새로고침해도 유지되고, 설정의 데이터 초기화로 지울 수 있습니다.
- 두 레이어 모두 인터페이스를 유지한 채 구현부만 Supabase 호출로 교체하면 화면 코드는 그대로 재사용됩니다.

## 프로젝트 구조

```
src/
├── app/                  # 12개 페이지 (App Router)
├── components/
│   ├── layout/           # 사이드바, 탑바, 모바일 내비, 드로어, 온보딩, 앱 셸
│   ├── ui/               # Card, Badge, Button, Toast, Motion 등 디자인 시스템
│   └── charts/           # Recharts 기반 차트
├── data/
│   ├── types.ts          # 도메인 타입 (Supabase 스키마와 1:1 매핑 전제)
│   ├── mock/             # mock 데이터 + 규칙 기반 추천/설계 엔진
│   └── repository.ts     # 읽기 전용 데이터 접근 레이어
└── lib/
    ├── settings-context.tsx  # 글자 크기 등 전역 설정 (localStorage)
    ├── store-context.tsx     # 발주·견적·활동 이력 저장 레이어 (localStorage)
    └── utils.ts              # cn, 통화/날짜 포맷터
```
