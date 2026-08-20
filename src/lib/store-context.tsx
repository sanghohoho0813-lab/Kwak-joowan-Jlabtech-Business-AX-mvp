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
  OrderStatus,
  PurchaseOrder,
  SavedQuote,
} from "@/data/types";

export const STORE_KEY = "jlab-ax-store-v1";

interface StoreData {
  orders: PurchaseOrder[];
  quotes: SavedQuote[];
  activities: ActivityLog[];
}

const emptyStore: StoreData = { orders: [], quotes: [], activities: [] };

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
  }) => void;
  logActivity: (input: {
    kind: ActivityKind;
    title: string;
    detail: string;
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
      clearAll,
    }),
    [data, ready, createOrder, advanceOrder, saveQuote, logActivity, clearAll],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
