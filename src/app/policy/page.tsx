"use client";

import {
  Landmark,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CircleDashed,
  FileText,
  Printer,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";
import { repo } from "@/data/repository";
import { cn } from "@/lib/utils";
import type { ReadinessState } from "@/data/types";

const { beforeAfter, readiness, fundPrograms, evidenceSummary } = repo.getPolicyAnalysis();

const stateMeta: Record<
  ReadinessState,
  { icon: typeof CheckCircle2; tone: "success" | "warning" | "neutral"; cls: string }
> = {
  충족: { icon: CheckCircle2, tone: "success", cls: "bg-pine-50 text-pine-700" },
  "진행 중": { icon: Clock3, tone: "warning", cls: "bg-sand-100 text-sand-600" },
  예정: { icon: CircleDashed, tone: "neutral", cls: "bg-ivory-200 text-inkmuted" },
};

export default function PolicyPage() {
  const met = readiness.filter((r) => r.state === "충족").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="정책자금 성과 분석"
        description="AX 도입으로 무엇이 달라졌는지 정리하고, 정책자금·사업고도화 신청 시 근거 자료로 쓸 수 있게 준비합니다."
        badge="2단계 고도화"
      />

      {/* 요약 배너 */}
      <Reveal>
        <Card className="overflow-hidden border-0 bg-pine-900 text-white">
          <CardContent className="relative p-6 md:p-7">
            <p className="text-2xs font-semibold tracking-[0.16em] text-sand-400">
              AX 도입 성과 요약
            </p>
            <h2 className="mt-2 max-w-2xl text-base font-bold leading-snug md:text-lg">
              데이터 기반 운영 체계는 계획서의 문장이 아니라
              <br />
              작동하는 화면으로 증명됩니다.
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "요건 충족", value: `${met} / ${readiness.length}` },
                { label: "검토 가능 사업", value: `${fundPrograms.length}건` },
                { label: "개선 지표", value: `${beforeAfter.length}개` },
                { label: "최고 적합도", value: `${Math.max(...fundPrograms.map((f) => f.fitPct))}%` },
              ].map((s) => (
                <div key={s.label} className="min-w-0">
                  <p className="clamp-1 text-2xs text-white/50">{s.label}</p>
                  <p className="num clamp-1 mt-0.5 text-lg font-bold text-white">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sand-500/10 blur-2xl" />
          </CardContent>
        </Card>
      </Reveal>

      {/* 도입 전후 비교 */}
      <Reveal delay={0.08}>
        <Card>
          <CardHeader>
            <CardTitle>AX 도입 전후 비교</CardTitle>
            <Badge tone="outline">일부 추정치 포함</Badge>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {beforeAfter.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-line/70 bg-ivory-100/60 p-4 transition-colors hover:border-pine-100 hover:bg-pine-50/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="clamp-1 text-xs font-bold text-pine-900">{m.label}</p>
                  <Badge tone="success">{m.changeLabel}</Badge>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:flex-nowrap">
                  <div className="min-w-0 flex-1 rounded-lg border border-line bg-ivory-50 px-3 py-2">
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-wider text-inkmuted">
                      도입 전
                    </p>
                    <p className="clamp-1 text-xs text-inkbody">{m.before}</p>
                  </div>
                  <ArrowRight size={14} className="shrink-0 text-sand-500" />
                  <div className="min-w-0 flex-1 rounded-lg border border-pine-100 bg-pine-50/70 px-3 py-2">
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-wider text-pine-600">
                      도입 후
                    </p>
                    <p className="clamp-1 text-xs font-semibold text-pine-900">{m.after}</p>
                  </div>
                </div>
                <p className="clamp-2 mt-2 text-2xs leading-relaxed text-inkmuted">
                  {m.note}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* 요건 체크리스트 */}
        <Reveal delay={0.12}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>지원사업 요건 점검</CardTitle>
              <Badge tone="success">
                {met}/{readiness.length} 충족
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {readiness.map((r) => {
                const meta = stateMeta[r.state];
                const Icon = meta.icon;
                return (
                  <div
                    key={r.requirement}
                    className="flex gap-3 rounded-xl border border-line/70 bg-ivory-100/60 p-3 transition-colors hover:border-pine-100"
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        meta.cls,
                      )}
                    >
                      <Icon size={15} strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="clamp-1 text-xs font-bold text-pine-900">
                          {r.requirement}
                        </p>
                        <Badge tone={meta.tone}>{r.state}</Badge>
                      </div>
                      <p className="clamp-2 mt-0.5 text-2xs leading-relaxed text-inkmuted">
                        {r.evidence}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </Reveal>

        {/* 검토 가능 사업 */}
        <Reveal delay={0.16}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>검토해 볼 만한 지원사업</CardTitle>
              <Landmark size={15} className="shrink-0 text-inkmuted" />
            </CardHeader>
            <CardContent className="space-y-2.5">
              {fundPrograms.map((f) => (
                <div
                  key={f.name}
                  className="rounded-xl border border-line/70 bg-ivory-100/60 p-4 transition-all hover:-translate-y-0.5 hover:border-pine-100 hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="clamp-1 text-xs font-bold text-pine-900">{f.name}</p>
                      <p className="clamp-1 text-2xs text-inkmuted">{f.agency}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="num text-sm font-bold text-pine-800">{f.fitPct}%</p>
                      <p className="text-[0.5625rem] text-inkmuted">적합도</p>
                    </div>
                  </div>
                  {/* 적합도 바 */}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ivory-300">
                    <div
                      className="h-full rounded-full bg-pine-600 transition-all duration-500"
                      style={{ width: `${f.fitPct}%` }}
                    />
                  </div>
                  <p className="clamp-2 mt-2 text-2xs leading-relaxed text-inkbody">
                    {f.reason}
                  </p>
                  <p className="clamp-1 mt-1.5 text-2xs font-semibold text-sand-600">
                    지원 규모: {f.scaleLabel}
                  </p>
                </div>
              ))}
              <p className="pt-1 text-2xs leading-relaxed text-inkmuted">
                적합도는 플랫폼이 보유한 운영 데이터와 일반적인 사업 요건을 대조한
                참고 지표입니다. 실제 신청 요건과 일정은 각 기관 공고를 확인해야 합니다.
              </p>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* 근거 자료 초안 */}
      <Reveal delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>사업계획서용 근거 문단 (초안)</CardTitle>
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <Printer size={14} />
              인쇄 / PDF 저장
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-line bg-ivory-100/50 p-5">
              <p className="mb-3 flex items-center gap-1.5 text-2xs font-bold text-sand-600">
                <FileText size={13} /> 그대로 옮겨 쓸 수 있도록 정리한 문단입니다
              </p>
              <div className="space-y-3">
                {evidenceSummary.map((p, i) => (
                  <p key={i} className="text-xs leading-relaxed text-inkbody">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
