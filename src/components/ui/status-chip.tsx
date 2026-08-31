"use client";

/**
 * 화면에 표시되는 값이 어떤 성격인지 정직하게 알리는 표기들.
 *
 * - DataChip   : DEMO / TARGET / ACTUAL 구분
 * - AiPreviewChip : 실제 LLM이 아니라 규칙 기반 Preview임을 명시
 * - StatusPill : 탑바용 소형 상태 표시 (모바일에서는 점만)
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Database, Sparkles, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DataKind } from "@/data/types";

const dataKindMeta: Record<DataKind, { label: string; cls: string; hint: string }> = {
  DEMO: {
    label: "DEMO DATA",
    cls: "border-sand-400/50 bg-sand-100/70 text-sand-600",
    hint: "시연용 가상 데이터입니다. 실제 실적이 아닙니다.",
  },
  TARGET: {
    label: "TARGET",
    cls: "border-sage-200 bg-sage-100 text-sage-600",
    hint: "달성하려는 목표치이며, 아직 측정된 값이 아닙니다.",
  },
  ACTUAL: {
    label: "ACTUAL",
    cls: "border-pine-100 bg-pine-50 text-pine-700",
    hint: "이 플랫폼에 실제로 기록된 값입니다.",
  },
};

export function DataChip({
  kind = "DEMO",
  className,
}: {
  kind?: DataKind;
  className?: string;
}) {
  const meta = dataKindMeta[kind];
  return (
    <span
      title={meta.hint}
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 text-[0.625rem] font-bold tracking-wider",
        meta.cls,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}

export function AiPreviewChip({ label = "AI PREVIEW" }: { label?: string }) {
  return (
    <span
      title="현재는 규칙 기반 Preview입니다. 실제 상품 DB와 LLM API 연결 시 대체됩니다."
      className="inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-pine-100 bg-pine-50 px-2.5 text-[0.625rem] font-bold tracking-wider text-pine-700"
    >
      <Sparkles size={11} strokeWidth={2.2} />
      {label}
    </span>
  );
}

/** 탑바용 — 클릭하면 현재 데이터/AI 상태를 설명하는 팝오버가 열린다 */
export function StatusPill() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="데이터 및 AI 상태"
        aria-expanded={open}
        className="flex h-9 items-center gap-1.5 rounded-xl border border-sand-400/50 bg-sand-100/60 px-2 text-[0.625rem] font-bold tracking-wider text-sand-600 transition-colors duration-fast hover:bg-sand-100 sm:px-2.5"
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sand-500" />
        <span className="hidden whitespace-nowrap md:inline">DEMO · AI PREVIEW</span>
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.99 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-11 z-50 w-[17rem] rounded-xl border border-line bg-ivory-50 p-4 shadow-card-hover"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-pine-900">현재 상태</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="shrink-0 rounded-md p-0.5 text-inkmuted transition-colors hover:text-pine-700"
                  aria-label="닫기"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <Database size={15} className="mt-0.5 shrink-0 text-sand-600" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-pine-900">DEMO DATA</p>
                    <p className="mt-0.5 text-2xs leading-relaxed text-inkmuted">
                      화면의 재고·고객·매출 수치는 실제 규모를 참고해 구성한 시연용
                      데이터입니다. 실제 실적이 아닙니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <Sparkles size={15} className="mt-0.5 shrink-0 text-pine-700" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-pine-900">AI PREVIEW</p>
                    <p className="mt-0.5 text-2xs leading-relaxed text-inkmuted">
                      추천·설계·예측은 현재 규칙 기반입니다. 실제 상품 DB와 판매
                      데이터, LLM API를 연결하면 그대로 대체됩니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 border-t border-line pt-3">
                  <Info size={15} className="mt-0.5 shrink-0 text-pine-600" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-pine-900">기록되는 값</p>
                    <p className="mt-0.5 text-2xs leading-relaxed text-inkmuted">
                      발주·견적·고객 접촉·고객 요청은 실제로 저장됩니다. 그 기록은
                      <span className="font-semibold text-pine-700"> AX 실증성과</span>
                      에서 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
