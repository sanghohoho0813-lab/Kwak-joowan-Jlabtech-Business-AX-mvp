"use client";

/**
 * 플랫폼 변경 이력.
 *
 * 한 번 만들고 끝나는 화면이 아니라 계속 자라는 서비스라는 인상은
 * "무엇이 새로 생겼고 다음에 무엇이 오는가"를 보여줄 때 생긴다.
 * 적용된 것과 아직 아닌 것을 상태로 구분해 과장 없이 적는다.
 */

import { Check, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { repo } from "@/data/repository";
import { cn } from "@/lib/utils";
import type { PlatformUpdate } from "@/data/types";

const stateStyle: Record<
  PlatformUpdate["state"],
  { badge: "success" | "clay" | "mist"; icon: typeof Check; dot: string }
> = {
  적용됨: { badge: "success", icon: Check, dot: "bg-pine-600 text-white" },
  "다음 예정": { badge: "clay", icon: Clock, dot: "bg-clay-500 text-white" },
  "검토 중": { badge: "mist", icon: Search, dot: "bg-mist-500 text-white" },
};

export function PlatformUpdates({ limit }: { limit?: number }) {
  const updates = repo.getPlatformUpdates();
  const list = limit ? updates.slice(0, limit) : updates;

  return (
    <ol className="space-y-3">
      {list.map((u) => {
        const st = stateStyle[u.state];
        const Icon = st.icon;
        return (
          <li
            key={`${u.version}-${u.title}`}
            className={cn(
              "flex gap-3.5 rounded-2xl border p-4 md:p-5",
              u.state === "적용됨"
                ? "border-line bg-ivory-50"
                : u.state === "다음 예정"
                  ? "border-clay-400/50 bg-clay-100/40"
                  : "border-dashed border-mist-200 bg-mist-100/40",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                st.dot,
              )}
            >
              <Icon size={18} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-bold text-pine-900 md:text-lg">{u.title}</p>
                <Badge tone={st.badge}>{u.state}</Badge>
                <span className="num text-sm text-inkmuted">
                  {u.version} · {u.date}
                </span>
              </div>
              <p className="mt-1.5 text-base leading-relaxed text-inkbody">{u.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
