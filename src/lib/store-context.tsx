"use client";

/**
 * 운영 데이터 저장 레이어 (2단계 고도화)
 *
 * 1단계에서는 모든 화면이 읽기 전용이었지만, 여기서부터는 사용자의 행동
 * (발주 생성, 견적 저장, 고객 접촉 기록)이 실제로 저장된다.
 *
 * 현재 저장소는 localStorage이지만, 인터페이스는 비동기 전환을 전제로
 * 설계했다. Supabase 연동 시 이 파일의 read/write 구현부만
 * `supabase.from("orders").insert(...)` 등으로 교체하면 화면 코드는 그대로 쓴다.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ActivityKind,
  ActivityLog,
  CustomerRequest,
  OrderStatus,
  PurchaseOrder,
  RequestStatus,
  RequestType,
  SavedQuote,
  ServiceInterest,
  ServiceStage,
} from "@/data/types";
import { REQUEST_STATUS_FLOW } from "@/data/types";
import { seedRequests } from "@/data/mock/customer-portal";

export const STORE_KEY = "jlab-ax-store-v1";

interface StoreData {
  orders: PurchaseOrder[];
  quotes: SavedQuote[];
  activities: ActivityLog[];
  /** 고객 플랫폼에서 접수된 요청. 시드 2건으로 시작한다. */
  requests: CustomerRequest[];
  /** 준비 중·검토 중 서비스에 고객이 남긴 관심 표시 */
  interests: ServiceInterest[];
}

const emptyStore: StoreData = {
  orders: [],
  quotes: [],
  activities: [],
  requests: seedRequests,
  interests: [],
};

interface StoreContextValue extends StoreData {
  ready: boolean;
  createOrder: (input: {
    itemId: string;
    itemName: string;
    model: string;
    qty: number;
    amountManwon: number;
    memo?: string;
  }) => void;
  advanceOrder: (id: string) => void;
  saveQuote: (input: {
    customerLabel: string;
    origin: SavedQuote["origin"];
    productSummary: string;
    totalManwon: number;
  }) => SavedQuote;
  logActivity: (input: {
    kind: ActivityKind;
    title: string;
    detail: string;
  }) => void;
  /** 고객 플랫폼 → Business AX : 요청 생성 */
  createRequest: (input: {
    customerId: string;
    customerName: string;
    requestType: RequestType;
    equipmentId?: string;
    equipmentName?: string;
    title: string;
    detail: string;
  }) => CustomerRequest;
  /** Business AX → 고객 플랫폼 : 처리 단계 전진 */
  advanceRequest: (id: string, response?: string) => void;
  /** 특정 단계로 직접 이동 (담당자가 상태를 고를 때) */
  setRequestStatus: (id: string, status: RequestStatus, response?: string) => void;
  /** 요청에서 만들어진 견적을 연결 */
  linkQuoteToRequest: (requestId: string, quoteId: string) => void;
  /**
   * 준비 중 서비스에 관심 표시를 켜고 끈다.
   * 기능을 동작시키는 것이 아니라 "나오면 쓰겠다"는 의사만 기록한다.
   */
  toggleServiceInterest: (input: {
    serviceId: string;
    serviceTitle: string;
    serviceStage: ServiceStage;
    customerId: string;
    customerName: string;
  }) => void;
  clearAll: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

/** 브라우저 환경에서만 쓰이는 단순 ID 생성기 */
function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const nextStatus: Record<OrderStatus, OrderStatus> = {
  "발주 대기": "발주 완료",
  "발주 완료": "입고 완료",
  "입고 완료": "입고 완료",
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>(emptyStore);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setData({ ...emptyStore, ...(JSON.parse(raw) as StoreData) });
    } catch {
      // 저장값이 손상된 경우 빈 저장소로 시작한다
    }
    setReady(true);
  }, []);

  const persist = useCallback((updater: (prev: StoreData) => StoreData) => {
    setData((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(next));
      } catch {
        // 저장 실패 시에도 화면 상태는 유지한다
      }
      return next;
    });
  }, []);

  const logActivity = useCallback<StoreContextValue["logActivity"]>(
    ({ kind, title, detail }) => {
      persist((prev) => ({
        ...prev,
        activities: [
          { id: makeId("act"), kind, title, detail, createdAt: new Date().toISOString() },
          ...prev.activities,
        ].slice(0, 50),
      }));
    },
    [persist],
  );

  const createOrder = useCallback<StoreContextValue["createOrder"]>(
    ({ itemId, itemName, model, qty, amountManwon, memo }) => {
      const order: PurchaseOrder = {
        id: makeId("po"),
        itemId,
        itemName,
        model,
        qty,
        amountManwon,
        status: "발주 대기",
        createdAt: new Date().toISOString(),
        memo,
      };
      persist((prev) => ({
        ...prev,
        orders: [order, ...prev.orders],
        activities: [
          {
            id: makeId("act"),
            kind: "발주" as ActivityKind,
            title: `${itemName} ${qty}개 발주 등록`,
            detail: `${model} · 예상 ${amountManwon.toLocaleString("ko-KR")}만원`,
            createdAt: order.createdAt,
          },
          ...prev.activities,
        ].slice(0, 50),
      }));
    },
    [persist],
  );

  const advanceOrder = useCallback<StoreContextValue["advanceOrder"]>(
    (id) => {
      persist((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === id ? { ...o, status: nextStatus[o.status] } : o,
        ),
      }));
    },
    [persist],
  );

  const saveQuote = useCallback<StoreContextValue["saveQuote"]>(
    ({ customerLabel, origin, productSummary, totalManwon }) => {
      const quote: SavedQuote = {
        id: makeId("qt"),
        customerLabel,
        origin,
        productSummary,
        totalManwon,
        createdAt: new Date().toISOString(),
      };
      persist((prev) => ({
        ...prev,
        quotes: [quote, ...prev.quotes],
        activities: [
          {
            id: makeId("act"),
            kind: "견적" as ActivityKind,
            title: `${customerLabel} 견적 저장`,
            detail: `${productSummary} · ${totalManwon.toLocaleString("ko-KR")}만원`,
            createdAt: quote.createdAt,
          },
          ...prev.activities,
        ].slice(0, 50),
      }));
      return quote;
    },
    [persist],
  );

  /* -------- 고객 플랫폼 ↔ Business AX Closed Loop -------- */

  const createRequest = useCallback<StoreContextValue["createRequest"]>(
    ({ customerId, customerName, requestType, equipmentId, equipmentName, title, detail }) => {
      const now = new Date().toISOString();
      const request: CustomerRequest = {
        id: makeId("req"),
        customerId,
        customerName,
        requestType,
        equipmentId,
        equipmentName,
        title,
        detail,
        status: "접수",
        createdAt: now,
        updatedAt: now,
      };
      persist((prev) => ({
        ...prev,
        requests: [request, ...prev.requests],
        activities: [
          {
            id: makeId("act"),
            kind: "고객 요청" as ActivityKind,
            title: `${customerName} · ${requestType} 접수`,
            detail: `${request.id}|${title}`,
            createdAt: now,
          },
          ...prev.activities,
        ].slice(0, 50),
      }));
      return request;
    },
    [persist],
  );

  const setRequestStatus = useCallback<StoreContextValue["setRequestStatus"]>(
    (id, status, response) => {
      persist((prev) => {
        const target = prev.requests.find((r) => r.id === id);
        return {
          ...prev,
          requests: prev.requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status,
                  response: response ?? r.response,
                  updatedAt: new Date().toISOString(),
                }
              : r,
          ),
          activities: target
            ? [
                {
                  id: makeId("act"),
                  kind: "요청 처리" as ActivityKind,
                  title: `${target.customerName} · ${target.requestType} → ${status}`,
                  detail: `${target.id}|${target.title}`,
                  createdAt: new Date().toISOString(),
                },
                ...prev.activities,
              ].slice(0, 50)
            : prev.activities,
        };
      });
    },
    [persist],
  );

  const advanceRequest = useCallback<StoreContextValue["advanceRequest"]>(
    (id, response) => {
      setData((prev) => {
        const target = prev.requests.find((r) => r.id === id);
        if (!target) return prev;
        const idx = REQUEST_STATUS_FLOW.indexOf(target.status);
        const next = REQUEST_STATUS_FLOW[Math.min(idx + 1, REQUEST_STATUS_FLOW.length - 1)];
        const now = new Date().toISOString();
        const updated: StoreData = {
          ...prev,
          requests: prev.requests.map((r) =>
            r.id === id
              ? { ...r, status: next, response: response ?? r.response, updatedAt: now }
              : r,
          ),
          activities: [
            {
              id: makeId("act"),
              kind: "요청 처리" as ActivityKind,
              title: `${target.customerName} · ${target.requestType} → ${next}`,
              detail: `${target.id}|${target.title}`,
              createdAt: now,
            },
            ...prev.activities,
          ].slice(0, 50),
        };
        try {
          localStorage.setItem(STORE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    },
    [],
  );

  const linkQuoteToRequest = useCallback<StoreContextValue["linkQuoteToRequest"]>(
    (requestId, quoteId) => {
      persist((prev) => ({
        ...prev,
        requests: prev.requests.map((r) =>
          r.id === requestId ? { ...r, quoteId, updatedAt: new Date().toISOString() } : r,
        ),
      }));
    },
    [persist],
  );

  const toggleServiceInterest = useCallback<StoreContextValue["toggleServiceInterest"]>(
    ({ serviceId, serviceTitle, serviceStage, customerId, customerName }) => {
      persist((prev) => {
        const existing = prev.interests.find(
          (i) => i.serviceId === serviceId && i.customerId === customerId,
        );
        const now = new Date().toISOString();
        if (existing) {
          return {
            ...prev,
            interests: prev.interests.filter((i) => i.id !== existing.id),
          };
        }
        return {
          ...prev,
          interests: [
            {
              id: makeId("int"),
              serviceId,
              serviceTitle,
              serviceStage,
              customerId,
              customerName,
              createdAt: now,
            },
            ...prev.interests,
          ],
          activities: [
            {
              id: makeId("act"),
              kind: "서비스 관심" as ActivityKind,
              title: `${customerName} · ${serviceTitle} 관심 표시`,
              detail: `${serviceStage} 서비스 · 준비 우선순위 판단 근거`,
              createdAt: now,
            },
            ...prev.activities,
          ].slice(0, 50),
        };
      });
    },
    [persist],
  );

  const clearAll = useCallback(() => {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {}
    setData(emptyStore);
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      ...data,
      ready,
      createOrder,
      advanceOrder,
      saveQuote,
      logActivity,
      createRequest,
      advanceRequest,
      setRequestStatus,
      linkQuoteToRequest,
      toggleServiceInterest,
      clearAll,
    }),
    [
      data,
      ready,
      createOrder,
      advanceOrder,
      saveQuote,
      logActivity,
      createRequest,
      advanceRequest,
      setRequestStatus,
      linkQuoteToRequest,
      toggleServiceInterest,
      clearAll,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
