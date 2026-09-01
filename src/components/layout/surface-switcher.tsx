"use client";

/**
 * 화면 전환 스위처 (관리자 화면 ↔ 고객 화면)
 *
 * 예전에는 각 화면에 "고객 플랫폼" / "관리자 화면" 버튼이 하나씩 따로 있어서,
 * 지금 어느 쪽에 있는지와 어디로 가는지가 헷갈렸다. 두 칸을 항상 같이 보여주고
 * 현재 있는 쪽을 채워 표시하면 위치와 이동 방향이 한눈에 읽힌다.
 */

import Link from "next/link";
import { LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  /** 지금 보고 있는 화면 */
  current: "admin" | "customer";
  /** 라벨을 항상 보여줄지 (드로어 안에서는 항상 보여준다) */
  expanded?: boolean;
  className?: string;
}

const surfaces = [
  { key: "admin" as const, href: "/", label: "관리자 화면", icon: LayoutDashboard },
  { key: "customer" as const, href: "/customer", label: "고객 화면", icon: Users },
];

export function SurfaceSwitcher({ current, expanded = false, className }: Props) {
  return (
    <div
      className={cn(
        "flex h-9 shrink-0 items-center gap-0.5 rounded-xl border border-line bg-ivory-200/70 p-0.5",
        expanded && "h-11 w-full",
        className,
      )}
      role="group"
      aria-label="화면 전환"
    >
      {surfaces.map((s) => {
        const active = s.key === current;
        const Icon = s.icon;
        return (
          <Link
            key={s.key}
            href={s.href}
            aria-current={active ? "page" : undefined}
            aria-label={active ? `${s.label} (현재 보는 중)` : `${s.label}으로 전환`}
            title={active ? `${s.label} — 지금 보고 있는 화면` : `${s.label}으로 전환합니다`}
            className={cn(
              "flex h-full flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[0.625rem] px-2.5 text-xs font-semibold transition-colors duration-fast",
              active
                ? "bg-pine-800 text-white shadow-sm"
                : "text-inkmuted hover:bg-ivory-50 hover:text-pine-700",
            )}
          >
            <Icon size={15} strokeWidth={1.9} className="shrink-0" />
            <span className={cn("whitespace-nowrap", !expanded && "hidden min-[1360px]:inline")}>
              {s.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
