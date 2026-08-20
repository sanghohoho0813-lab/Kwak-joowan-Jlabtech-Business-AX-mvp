# JLAB TECH AX MVP

**Industrial Measurement Business AX** — 산업·환경 계측 데이터 기반으로 재고 운영, 장비 추천, 재구매 기회를 관리하는 데모형 MVP.

아이보리 & 딥그린 프리미엄 디자인 컨셉으로, 제이랩테크가 "계측기 판매회사"에서 "계측 데이터 기반 AX 회사"로 확장되는 방향을 보여줍니다.

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

| 경로 | 설명 |
| --- | --- |
| `/` | 메인 대시보드 — KPI, 수요 예측 트렌드, 재고 구성, 알림·인사이트, AI 추천 요약 |
| `/inventory` | 재고·수요 관리 — 품목 테이블, 필터/검색, 발주 신호, 출고 추이 |
| `/recommend` | AI 제품추천·견적 — 고객 상황 입력 → 추천 카드 + 예상 견적 흐름 (규칙 기반 mock) |
| `/repurchase` | 재구매 예측 — 우선 관리 고객 카드, 고객별 재구매 예상일·다음 액션 |
| `/intent` | 기획의도 — 왜 이 시스템을 만들었는가 (10개 섹션) |
| `/tutorial` | 튜토리얼 — 스텝형 사용 안내 + 온보딩 다시 보기 |
| `/settings` | 설정 — 글자 크기 조정(동작·영속), 알림, 테마, 데이터 초기화, 버전 |

사이드바의 **마진 가드 / 설치장비 관리 / 산업계측 설계 / 리포트 센터 / 정책자금 성과 분석**은 고도화 예정 항목으로, 비활성(예정 배지) 상태로만 노출됩니다.

## 프로젝트 구조

```
src/
├── app/                  # 페이지 (App Router)
├── components/
│   ├── layout/           # 사이드바, 탑바, 모바일 내비, 온보딩, 앱 셸
│   ├── ui/               # Card, Badge, Button, Motion 등 디자인 시스템
│   └── charts/           # Recharts 기반 차트
├── data/
│   ├── types.ts          # 도메인 타입 (Supabase 스키마와 1:1 매핑 전제)
│   ├── mock/             # mock 데이터 + 규칙 기반 추천 엔진
│   └── repository.ts     # 데이터 접근 레이어 (Supabase 교체 지점)
└── lib/
    ├── settings-context.tsx  # 글자 크기 등 전역 설정 (localStorage 영속)
    └── utils.ts              # cn, 통화/날짜 포맷터
```

화면 컴포넌트는 `repository.ts`를 통해서만 데이터에 접근하므로, 이후 Supabase 연동 시 이 파일의 구현부만 교체하면 됩니다.
