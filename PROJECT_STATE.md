# PROJECT_STATE — 현재 상태

최종 갱신: 2026-08 · 버전 v0.3.0 (Customer Platform)

## 1. 완료

### 1단계 — 효율화형 AX
- 대시보드 (오늘의 실행 과제, KPI, 출고 추이, 재고 구성, 인사이트, 활동 이력)
- 재고·수요 관리 (필터/검색, 발주 신호, **발주 등록·상태 전진**)
- AI 추천·견적 (조건 입력 → 추천 → **견적 저장·이력**)
- 재구매 예측 (우선 관리 고객, **연락 기록**)
- 마진 가드 (할인 시뮬레이터, 하한선 경보, 개선 제안)
- 설치장비 관리 (교정 주기, 보증, **방문 예약 기록**)
- 산업계측 설계 (BOM·구축 비용 → **견적 전환**)
- 리포트 센터 (4종 리포트, 인쇄)
- 정책자금 성과 분석
- 기획의도 / 사용 방법 / 설정 / 온보딩

### 2단계 — 사업모델 전환형 AX (이번에 추가)
- **고객 플랫폼** `/customer`, `/customer/equipment`, `/customer/requests`, `/customer/services`
  - 계정 메뉴(회사·업종·거래 형태·첫 거래), 답변 도착 알림, 모바일 4탭
  - **햄버거 드로어** — 계정 / 메뉴 / 이 페이지 목차 / 화면 전환
  - **화면 전환 스위처** — [관리자 화면 | 고객 화면] 두 칸, 현재 위치를 채워 표시
  - 홈: 사용 흐름 3단계 안내, 확인이 필요한 답변, 요약 3종,
    다가오는 일정(교정·소모품 주기로 자동 계산), 요청 5종, 보내신 요청, 서비스 안내
  - 섹션마다 카드 밖 머리말(색 아이콘 + 제목 + 설명), 고객 화면 전용 큰 글자 체계
  - 내 장비: 검색·필터 4종, 장비별 운영 이력 타임라인
- **서비스 & 확장 로드맵** `/customer/services` — 이용 가능 3 / 준비 중 4 / 검토 중 4,
  각 항목마다 [준비된 것 / 구현 방식 / 고객 가치 / 수익 구조 / 선행 조건]
- **고객 요청** `/requests` — 내부 접수·처리 화면
- **Closed Loop 2종** — 교정 요청 / 소모품·추가 계측
- **AX 실증성과** `/evidence` — KPI → Result → Evidence 연결
- **대표 시연** `/presentation` — 10단계 스토리
- Surface Switcher (Business AX ↔ 고객 플랫폼)
- Device Preview (모바일 미리보기, 재귀 방지)

### 데이터 신뢰성
- 재고·매출 규모를 실제 회사 규모(재고 약 2.25억, 매출 약 4.6억)로 재조정
- 억 단위 거액 KPI → 운영 의사결정 중심 지표로 교체
- 정책자금 적합도 % 제거 → 상태값으로 교체
- Before/After → 도입 전 / 목표 / **실측(측정 준비 중)** 3단 구조
- DEMO / TARGET / ACTUAL 칩, AI PREVIEW 표기

### 설정
- 글자 크기 3단계, **테마 6종**(보조 강조색 clay·mist 포함), 모션(기본/줄임), 역할 미리보기 3종
- 데이터 모드(DEMO), 데이터 소스(Mock), AI 상태(PREVIEW), 저장 데이터 현황, 초기화

## 2. 현재 상태

- 총 22개 라우트, 빌드 통과
- 읽기: `data/repository.ts` → `data/mock/*`
- 쓰기: `lib/store-context.tsx` → localStorage (`jlab-ax-store-v1`)
- 설정: `lib/settings-context.tsx` → localStorage (`jlab-ax-settings-v1`)
- 저장 대상: 발주(PurchaseOrder) / 견적(SavedQuote) / 활동(ActivityLog) / **고객 요청(CustomerRequest)**

## 3. 다음 단계

0. **확장 서비스 실행 판단** — `/customer/services`의 "준비 중" 4종 중
   무엇을 먼저 열지 결정한다. 소모품 정기 배송이 가장 가깝다(주기 데이터가 이미 있음).
1. **실데이터 연동** — 판매·재고 시스템에서 품목/거래처/설치장비 가져오기
2. **Supabase 전환** — 아래 4개 테이블부터
3. **실제 계정·인증** — 고객 플랫폼 로그인, 고객사별 데이터 분리
4. **Before/After 실측** — 요청 접수~완료 시간, 견적 작성 시간 기록 시작
5. 3단계 검토 항목(원격 계측·리포트·예지보전)은 실증 이후 판단

## 4. Known Issues

- 고객 플랫폼은 데모 고객사(한성정밀화학, `c-01`) 1곳으로 고정되어 있다. 실제 인증 붙기 전까지 계정 전환이 없다.
- `DEMO_TODAY`(2026-08-20)를 기준으로 D-day를 계산한다. 실데이터 연동 시 `new Date()`로 교체해야 한다.
- 고객 요청 시드 2건은 store가 비어 있을 때만 들어간다. 초기화하면 다시 시드 상태로 돌아간다.
- localStorage 기반이므로 브라우저·기기 간 데이터가 공유되지 않는다.
- 모바일에서 넓은 표는 카드 내부 가로 스크롤로 처리한다(의도된 동작).
- 탑바 시계는 1100px 이상에서, 날짜는 1500px 이상에서 노출된다. 그 아래에서는
  사이드바가 폭을 가져가 탑바가 밀리므로 의도적으로 숨긴다(의도된 동작).

## 5. Supabase 전환 시 작업

| 테이블 | 대응 타입 | 비고 |
| --- | --- | --- |
| `inventory_items` | `InventoryItem` | 읽기 — repository 교체 |
| `customers` | `Customer` | 읽기 |
| `installed_equipment` | `InstalledEquipment` | 읽기 |
| `purchase_orders` | `PurchaseOrder` | 쓰기 — store 교체 |
| `saved_quotes` | `SavedQuote` | 쓰기 |
| `customer_requests` | `CustomerRequest` | 쓰기 · 고객/내부 양쪽에서 접근 |
| `activity_logs` | `ActivityLog` | 쓰기 |

교체 순서: `repository.ts` 구현부 → `store-context.tsx` 구현부 → 타입은 그대로.
화면 코드는 수정하지 않는 것을 목표로 설계했다.

## 6. 실제 데이터 교체 필요 항목

- [ ] `data/mock/inventory.ts` — 품목·단가·재고 수량
- [ ] `data/mock/customers.ts` — 거래처·구매 이력
- [ ] `data/mock/installed.ts` — 설치 장비 대장·시리얼·교정 이력
- [ ] `data/mock/margin.ts` — 실제 매입 원가·판매 단가
- [ ] `data/mock/dashboard.ts` — KPI 및 인사이트
- [ ] `data/mock/reports.ts` — 리포트 수치
- [ ] `data/mock/design.ts`, `recommend.ts` — 상품 DB 및 추천 로직
- [ ] `data/mock/customer-portal.ts` — 고객 계정, 시드 요청
- [ ] 기획의도 사진 3장 (Current Problem / Improved Workflow / Growth) — 16:9
