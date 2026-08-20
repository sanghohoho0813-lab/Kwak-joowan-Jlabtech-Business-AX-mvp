"use client";

/** 사용자의 행동(발주·견적 저장 등)이 실제로 기록되었음을 알리는 가벼운 피드백 */

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

interface ToastItem {
  id: number;
  title: string;
  detail?: string;
}

const ToastContext = createContext<{ toast: (title: string, detail?: string) => void }>({
  toast: () => {},
});

let seq = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((title: string, detail?: string) => {
    const id = ++seq;
    setItems((prev) => [...prev, { id, title, detail }].slice(-3));
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:right-6 lg:left-auto lg:items-end lg:px-0">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-pine-100 bg-pine-900 p-3.5 shadow-card-hover"
            >
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-sand-400" />
              <div className="min-w-0 flex-1">
                <p className="clamp-1 text-xs font-bold text-white">{item.title}</p>
                {item.detail ? (
                  <p className="clamp-2 mt-0.5 text-2xs leading-relaxed text-white/60">
                    {item.detail}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((t) => t.id !== item.id))}
                className="shrink-0 rounded-md p-0.5 text-white/40 transition-colors hover:text-white"
                aria-label="알림 닫기"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext).toast;
}
