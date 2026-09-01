"use client";

/**
 * 플랫폼 성장 단계 밴드.
 *
 * 확장 계획을 별도 페이지에만 두면 "지금 쓰는 이 화면"과 이어지지 않는다.
 * 고객이 매일 보는 홈에 "지금 여기, 다음은 여기"를 그려 두어야
 * 이 화면이 어디로 가는 중인지가 읽힌다.
 *
 * 지어낸 일정이나 확률은 쓰지 않는다. 각 단계에 실제 서비스 개수를 붙여
 * 말이 아니라 목록으로 보이게 한다.
 */

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { repo } from "@/data/repository";
import { cn } from "@/lib/utils";

const stageTone = {
  "지금 여기": {
    badge: "success" as const,
    dot: "bg-pine-700 text-white ring-4 ring-pine-100",
    card: "border-pine-200 bg-pine-50/70",
    rail: "bg-pine-600",
  },
  "준비 중": {
    badge: "clay" as const,
    dot: "bg-clay-500 text-white",
    card: "border-clay-400/50 bg-clay-100/40",
    rail: "bg-clay-400",
  },
  "검토 중": {
    badge: "mist" as const,
    dot: "bg-mist-500 text-white",
    card: "border-dashed border-mist-200 bg-mist-100/50",
    rail: "bg-mist-200",
  },
};

export function PlatformJourney({ interestCount = 0 }: { interestCount?: number }) {
  const stages = repo.getPlatformStages();
  const catalog = repo.getServiceCatalog();

  const countFor = (state: (typeof stages)[number]["state"]) =>
    catalog.filter(
      (s) =>
        s.stage ===
        (state === "지금 여기" ? "이용 가능" : state === "준비 중" ? "준비 중" : "검토 중"),
    ).length;

  return (
    <div className="rounded-2xl border border-line bg-ivory-50 p-5 shadow-card md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-lg font-bold text-pine-900 md:text-xl">
          이 플랫폼이 가는 방향
        </p>
        <Badge size="md" tone="outline">
          1단계 운영 중
        </Badge>
      </div>
      <p className="mt-2 text-base leading-relaxed text-inkmuted">
        지금은 장비 운영을 함께 보는 단계입니다. 여기 쌓이는 장비·요청 데이터 위에서
        다음 단계가 열립니다.
      </p>

      <ol className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        {stages.map((st, i) => {
          const tone = stageTone[st.state];
          const here = st.state === "지금 여기";
          return (
            <li key={st.no} className="relative">
              {/* 단계를 잇는 선 — PC에서만 */}
              {i < stages.length - 1 ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute -right-3 top-8 hidden h-0.5 w-3 md:block",
                    stageTone[stages[i + 1].state].rail,
                  )}
                />
              ) : null}

              <div
                className={cn(
                  "flex h-full flex-col gap-3 rounded-2xl border p-4",
                  tone.card,
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "num flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold",
                      tone.dot,
                    )}
                  >
                    {here ? <Check size={18} strokeWidth={3} /> : st.no}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-pine-900 md:text-lg">
                      {st.name}
                    </span>
                  </span>
                  <Badge tone={tone.badge}>{st.state}</Badge>
                </div>

                <p className="text-sm leading-relaxed text-inkbody">{st.desc}</p>

                <p className="num mt-auto text-sm font-bold text-inkmuted">
                  서비스 {countFor(st.state)}종
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href="/customer/services"
          className="inline-flex items-center gap-2 rounded-xl bg-pine-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors duration-fast hover:bg-pine-600"
        >
          다음에 무엇이 열리는지 보기
          <ArrowRight size={16} />
        </Link>
        {interestCount > 0 ? (
          <p className="text-sm text-inkmuted">
            관심 표시하신 서비스{" "}
            <span className="num font-bold text-pine-800">{interestCount}개</span>는 준비
            순서를 정할 때 먼저 반영합니다.
          </p>
        ) : (
          <p className="text-sm text-inkmuted">
            준비 중인 서비스에 관심을 남기시면 준비 순서에 반영됩니다.
          </p>
        )}
      </div>
    </div>
  );
}
