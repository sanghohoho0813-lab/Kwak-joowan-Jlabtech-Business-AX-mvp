"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Wrench,
  Building2,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, HoverCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";
import { RequestStatusBadge } from "@/components/customer/status-badge";
import { useStore } from "@/lib/store-context";
import { useToast } from "@/components/ui/toast";
import { cn, formatDateTime, formatManwon } from "@/lib/utils";
import { REQUEST_STATUS_FLOW } from "@/data/types";
import type { RequestStatus } from "@/data/types";

const filters: ("전체" | RequestStatus)[] = ["전체", ...REQUEST_STATUS_FLOW];

/** 상태별로 담당자가 남기면 좋은 기본 답변 */
const defaultResponse: Partial<Record<RequestStatus, string>> = {
  "검토 중": "요청 확인했습니다. 장비 이력과 재고를 확인하고 회신드리겠습니다.",
  "일정·견적 제안": "가능한 일정과 예상 금액을 정리해 제안드립니다. 확인 후 회신 부탁드립니다.",
  "처리 중": "일정 확정되었습니다. 준비하여 진행하겠습니다.",
  완료: "처리 완료되었습니다. 이용해 주셔서 감사합니다.",
};

export default function RequestsPage() {
  const { requests, advanceRequest, quotes, interests } = useStore();
  const toast = useToast();
  const [filter, setFilter] = useState<(typeof filters)[number]>("전체");

  const sorted = useMemo(
    () => [...requests].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [requests],
  );
  const filtered = sorted.filter((r) => filter === "전체" || r.status === filter);

  const newCount = requests.filter((r) => r.status === "접수").length;
  const openCount = requests.filter((r) => r.status !== "완료").length;
  const doneCount = requests.filter((r) => r.status === "완료").length;

  const handleAdvance = (id: string, current: RequestStatus, customer: string) => {
    const idx = REQUEST_STATUS_FLOW.indexOf(current);
    const next = REQUEST_STATUS_FLOW[Math.min(idx + 1, REQUEST_STATUS_FLOW.length - 1)];
    advanceRequest(id, defaultResponse[next]);
    toast(`${next}(으)로 변경되었습니다`, `${customer} · 고객 화면에 즉시 반영됩니다`);
  };

  const summary = [
    { icon: Inbox, label: "신규 접수", value: newCount, tone: "bg-pine-50 text-pine-700" },
    { icon: Clock, label: "처리 중", value: openCount, tone: "bg-sand-100 text-sand-600" },
    { icon: CheckCircle2, label: "완료", value: doneCount, tone: "bg-sage-100 text-sage-600" },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="고객 요청"
        description="고객 플랫폼에서 접수된 교정·소모품·추가 계측 요청입니다. 상태를 바꾸면 고객 화면에 즉시 반영됩니다."
        badge="3단계 고도화"
      />

      {/* 고객이 남긴 확장 서비스 수요 신호 */}
      {interests.length > 0 ? (
        <Reveal delay={0.05}>
          <Card className="border-clay-400/50 bg-clay-100/40">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Sparkles size={17} className="shrink-0 text-clay-600" />
                <p className="text-sm font-bold text-pine-900">
                  고객이 관심 표시한 준비 중 서비스
                </p>
                <Badge tone="clay">{interests.length}건</Badge>
              </div>
              <p className="mt-1 text-2xs leading-relaxed text-inkmuted">
                고객 화면의 서비스 로드맵에서 남긴 수요 신호입니다. 무엇을 먼저 만들지
                정할 때의 근거가 됩니다.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(
                  interests.reduce<Record<string, number>>((acc, i) => {
                    acc[i.serviceTitle] = (acc[i.serviceTitle] ?? 0) + 1;
                    return acc;
                  }, {}),
                )
                  .sort((a, b) => b[1] - a[1])
                  .map(([title, n]) => (
                    <span
                      key={title}
                      className="inline-flex items-center gap-1.5 rounded-full border border-clay-400/50 bg-ivory-50 px-3 py-1.5 text-2xs font-semibold text-inkbody"
                    >
                      {title}
                      <span className="num font-bold text-clay-600">{n}</span>
                    </span>
                  ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      ) : null}

      {/* 요약 + 고객 화면 링크 */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <StaggerItem key={s.label}>
              <HoverCard className="h-24">
                <CardContent className="flex h-full items-center gap-4 p-5">
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      s.tone,
                    )}
                  >
                    <Icon size={19} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0">
                    <p className="clamp-1 text-xs text-inkmuted">{s.label}</p>
                    <p className="num text-xl font-bold text-pine-900">{s.value}건</p>
                  </div>
                </CardContent>
              </HoverCard>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal delay={0.06}>
        <Card className="border-pine-100 bg-pine-50/40">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="clamp-2 min-w-0 flex-1 text-xs leading-relaxed text-inkbody">
              이 요청들은 고객이 <strong className="font-semibold">고객 플랫폼</strong>에서
              직접 보낸 것입니다. 여기서 상태를 바꾸면 고객 화면의 진행 단계가 함께
              움직입니다.
            </p>
            <Link href="/customer" className="shrink-0">
              <Button size="sm" variant="secondary">
                <ExternalLink size={14} />
                고객 화면 보기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Reveal>

      {/* 필터 */}
      <Reveal delay={0.08}>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "h-8 whitespace-nowrap rounded-full border px-3 text-2xs font-semibold transition-colors duration-fast",
                filter === f
                  ? "border-pine-700 bg-pine-700 text-white"
                  : "border-line bg-ivory-50 text-inkmuted hover:border-pine-100 hover:text-pine-700",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </Reveal>

      {/* 요청 목록 */}
      {filtered.length === 0 ? (
        <Reveal delay={0.1}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <Inbox size={22} className="text-inkmuted opacity-50" />
              <p className="text-sm font-semibold text-pine-900">해당하는 요청이 없습니다</p>
              <p className="max-w-sm text-2xs leading-relaxed text-inkmuted">
                고객 플랫폼에서 교정·소모품 요청을 보내면 이 화면에 바로 나타납니다.
              </p>
            </CardContent>
          </Card>
        </Reveal>
      ) : (
        <Stagger className="space-y-3">
          {filtered.map((r) => {
            const stepIndex = REQUEST_STATUS_FLOW.indexOf(r.status);
            const isDone = r.status === "완료";
            const linkedQuote = r.quoteId ? quotes.find((q) => q.id === r.quoteId) : null;
            return (
              <StaggerItem key={r.id}>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                          <Building2 size={18} strokeWidth={1.9} />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="clamp-1 text-sm font-bold text-pine-900">
                              {r.customerName}
                            </p>
                            <Badge tone="outline">{r.requestType}</Badge>
                          </div>
                          <p className="clamp-2 mt-1 text-xs font-semibold text-inkbody">
                            {r.title}
                          </p>
                          {r.equipmentName ? (
                            <p className="clamp-1 mt-0.5 flex items-center gap-1.5 text-2xs text-inkmuted">
                              <Wrench size={11} className="shrink-0" />
                              {r.equipmentName}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <RequestStatusBadge status={r.status} />
                    </div>

                    <p className="clamp-2 mt-3 rounded-lg bg-ivory-100/70 p-3 text-2xs leading-relaxed text-inkbody">
                      {r.detail}
                    </p>

                    {/* 진행 단계 */}
                    <div className="mt-3.5 flex gap-1">
                      {REQUEST_STATUS_FLOW.map((s, i) => (
                        <div
                          key={s}
                          title={s}
                          className={cn(
                            "h-1.5 flex-1 rounded-full transition-colors duration-base",
                            i <= stepIndex ? "bg-pine-600" : "bg-line",
                          )}
                        />
                      ))}
                    </div>

                    {linkedQuote ? (
                      <p className="num mt-2.5 flex items-center gap-1.5 text-2xs text-pine-700">
                        <FileText size={12} className="shrink-0" />
                        연결된 견적 · {linkedQuote.productSummary} ·{" "}
                        {formatManwon(linkedQuote.totalManwon)}
                      </p>
                    ) : null}

                    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-3">
                      <p className="num clamp-1 min-w-0 text-2xs text-inkmuted">
                        접수 {formatDateTime(r.createdAt)} · 최종 {formatDateTime(r.updatedAt)}
                      </p>
                      {isDone ? (
                        <Badge tone="success">처리 완료</Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAdvance(r.id, r.status, r.customerName)}
                        >
                          {REQUEST_STATUS_FLOW[stepIndex + 1]}(으)로
                          <ArrowRight size={12} />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </div>
  );
}
