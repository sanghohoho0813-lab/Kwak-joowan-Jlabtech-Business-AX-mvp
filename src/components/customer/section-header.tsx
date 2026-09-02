"use client";

/**
 * 고객 화면 섹션 머리말.
 *
 * 예전에는 모든 블록이 흰 카드 안에 제목을 넣고 있어서, 화면을 내려도
 * "여기서부터 다른 이야기"라는 신호가 없었다. 제목을 카드 밖으로 꺼내고
 * 색이 있는 아이콘을 붙여, 무엇에 대한 영역인지 먼저 읽히게 한다.
 */

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "pine" | "clay" | "mist" | "sand";

const toneStyle: Record<Tone, string> = {
  pine: "bg-pine-700 text-white",
  clay: "bg-clay-500 text-white",
  mist: "bg-mist-500 text-white",
  sand: "bg-sand-500 text-white",
};

interface Props {
  icon: LucideIcon;
  tone?: Tone;
  title: string;
  /** 이 영역이 무엇인지 한 줄 설명 — 없으면 생략한다 */
  desc?: string;
  /** 오른쪽 보조 동작 (전체 보기 등) */
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  tone = "pine",
  title,
  desc,
  action,
  className,
}: Props) {
  return (
    <div className={cn("mb-3", className)}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm",
            toneStyle[tone],
          )}
        >
          <Icon size={21} strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="text-lg font-bold leading-tight text-inkstrong md:text-xl">{title}</h2>
          {desc ? (
            <p className="mt-1 text-sm leading-relaxed text-inkmuted">{desc}</p>
          ) : null}
        </div>
        {/* 좁은 화면에서는 설명이 눌리지 않도록 아래 줄로 내린다 */}
        {action ? <div className="hidden shrink-0 pt-1 sm:block">{action}</div> : null}
      </div>
      {action ? <div className="mt-2.5 sm:hidden">{action}</div> : null}
    </div>
  );
}

/** 섹션 오른쪽 "전체 보기" 링크 — 크기와 색을 한 곳에서 맞춘다 */
export function SectionAction({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-pine-700 transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50",
        className,
      )}
    >
      {children}
    </span>
  );
}
