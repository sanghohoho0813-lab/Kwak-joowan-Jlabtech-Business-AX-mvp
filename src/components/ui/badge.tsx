import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BadgeTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "gold"
  | "outline";

const tones: Record<BadgeTone, string> = {
  success: "bg-pine-50 text-pine-700 border-pine-100",
  warning: "bg-sand-100 text-sand-600 border-sand-400/40",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-sage-100 text-sage-600 border-sage-200",
  neutral: "bg-ivory-200 text-inkmuted border-line",
  gold: "bg-sand-500 text-white border-sand-500",
  outline: "bg-transparent text-inkmuted border-line",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 text-2xs font-semibold leading-none",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/** 재고/고객 상태 → 배지 톤 매핑 */
export function statusTone(status: string): BadgeTone {
  switch (status) {
    case "정상":
    case "높음":
      return "success";
    case "주의":
    case "중간":
    case "과잉":
      return "warning";
    case "부족":
    case "즉시 연락":
      return "danger";
    case "낮음":
    case "관찰":
      return "neutral";
    default:
      return "info";
  }
}
