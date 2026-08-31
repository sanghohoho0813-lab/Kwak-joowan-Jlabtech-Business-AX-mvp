import type { CustomerAccount, CustomerRequest } from "../types";

/**
 * 고객 플랫폼 데모 계정.
 * 실제 서비스에서는 로그인 세션에서 가져온다. 지금은 기존 mock 고객사 중
 * 한 곳(한성정밀화학, c-01)에 로그인했다고 가정한다.
 */
export const demoCustomer: CustomerAccount = {
  id: "c-01",
  company: "한성정밀화학",
  contactName: "김현우",
  segment: "제조 공장",
  region: "울산",
};

/**
 * 데모 시작 시점에 이미 처리 중인 요청 몇 건.
 * 사용자가 새로 만든 요청은 store(localStorage)에 쌓이고, 화면에서는
 * 이 시드와 합쳐 최신순으로 보여준다.
 */
export const seedRequests: CustomerRequest[] = [
  {
    id: "req-seed-1",
    customerId: "c-01",
    customerName: "한성정밀화학",
    requestType: "교정 요청",
    equipmentId: "eq-02",
    equipmentName: "가스 측정기 GM-400",
    title: "가스 측정기 정기 교정 요청",
    detail: "울산 2공장 유틸리티동 설치분입니다. 11월 교정 예정일 전에 미리 일정을 잡고 싶습니다.",
    status: "일정·견적 제안",
    createdAt: "2026-08-12T09:20:00.000Z",
    updatedAt: "2026-08-14T02:10:00.000Z",
    response: "11월 6일(금) 오전 방문으로 제안드립니다. 일정 확정해 주시면 배정하겠습니다.",
  },
  {
    id: "req-seed-2",
    customerId: "c-01",
    customerName: "한성정밀화학",
    requestType: "소모품 요청",
    equipmentId: "eq-01",
    equipmentName: "수질 분석기 AN-1000",
    title: "pH 전극 프로브 교체분 요청",
    detail: "1공장 폐수처리동 분석기용 pH 프로브 4개 필요합니다.",
    status: "완료",
    createdAt: "2026-07-28T01:05:00.000Z",
    updatedAt: "2026-08-04T07:40:00.000Z",
    response: "8월 4일 출고 완료되었습니다. 다음 교체 예상 시점은 2027년 2월입니다.",
  },
];
