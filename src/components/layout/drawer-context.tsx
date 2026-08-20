"use client";

/** 모바일 드로어 상태 — 탑바 햄버거와 하단 "전체" 탭이 같은 드로어를 연다 */

import { createContext, useContext, useState, type ReactNode } from "react";

const DrawerContext = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
}>({ open: false, setOpen: () => {} });

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DrawerContext.Provider value={{ open, setOpen }}>{children}</DrawerContext.Provider>
  );
}

export function useDrawer() {
  return useContext(DrawerContext);
}
