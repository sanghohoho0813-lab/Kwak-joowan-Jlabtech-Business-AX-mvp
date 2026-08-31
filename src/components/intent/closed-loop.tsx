"use client";

/**
 * 고객 플랫폼 ↔ Business AX 데이터 흐름.
 * 두 Surface 가 한 줄로 이어지고, 그 결과가 다시 다음 Action 으로 돌아온다는
 * 것을 한눈에 보여준다.
 */

import { Users, Building2, ArrowRight, ArrowDown, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const chain = [
  {
    side: "customer" as const,
    title: "고객 플랫폼",
    steps: ["장비 확인", "교정·소모품 요청"],
  },
  {
    side: "internal" as const,
    title: "Business AX",
    steps: ["요청 접수", "재고·견적·일정 판단"],
  },
  {
    side: "internal" as const,
    title: "직원 처리",
    steps: ["검토 → 제안 → 처리", "발주·견적 생성"],
  },
  {
    side: "customer" as const,
    title: "고객 화면 반영",
    steps: ["진행 상태 업데이트", "완료 안내"],
  },
];

const feedback = ["요청 데이터 축적", "재구매 예측", "재고 수요 반영", "다음 제안"];

export function ClosedLoopDiagram() {
  return (
    <div className="rounded-xl border border-line bg-ivory-100/60 p-4 md:p-5">
      {/* 상단 흐름 */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
        {chain.map((c, i) => (
          <div key={c.title} className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-center">
            <div
              className={cn(
                "flex-1 rounded-lg border p-3",
                c.side === "customer"
                  ? "border-sand-400/50 bg-sand-100/50"
                  : "border-pine-100 bg-pine-50/70",
              )}
            >
              <p className="flex items-center gap-1.5 text-[0.7em] font-bold text-pine-900">
                {c.side === "customer" ? (
                  <Users size={12} className="shrink-0 text-sand-600" />
                ) : (
                  <Building2 size={12} className="shrink-0 text-pine-700" />
                )}
                {c.title}
              </p>
              <ul className="mt-1 space-y-0.5">
                {c.steps.map((s) => (
                  <li key={s} className="text-[0.7em] leading-snug text-inkmuted">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            {i < chain.length - 1 ? (
              <>
                <ArrowDown size={14} className="mx-auto shrink-0 text-sand-500 lg:hidden" />
                <ArrowRight
                  size={14}
                  className="mx-1 hidden shrink-0 text-sand-500 lg:block"
                />
              </>
            ) : null}
          </div>
        ))}
      </div>

      {/* 되돌아오는 흐름 */}
      <div className="mt-4 rounded-lg border border-dashed border-sage-200 bg-sage-100/40 p-3">
        <p className="mb-2 flex items-center gap-1.5 text-[0.7em] font-bold text-sage-600">
          <RefreshCcw size={12} className="shrink-0" />
          그리고 다시 돌아옵니다
        </p>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
          {feedback.map((f, i) => (
            <span key={f} className="flex items-center gap-1.5">
              <span className="whitespace-nowrap rounded-md border border-line bg-ivory-50 px-2 py-1 text-[0.7em] font-semibold text-pine-900">
                {f}
              </span>
              {i < feedback.length - 1 ? (
                <ArrowRight size={10} className="shrink-0 text-sage-600" />
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
