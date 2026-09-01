"use client";

import { useMemo, useState } from "react";
import { Inbox, Plus, Wrench, MessageCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { RequestDialog } from "@/components/customer/request-dialog";
import { RequestStatusBadge } from "@/components/customer/status-badge";
import { useStore } from "@/lib/store-context";
import { repo } from "@/data/repository";
import { demoCustomer } from "@/data/mock/customer-portal";
import { cn, formatDateTime } from "@/lib/utils";
import { REQUEST_STATUS_FLOW } from "@/data/types";
import type { RequestStatus } from "@/data/types";

const filters: ("전체" | "처리 중" | "완료")[] = ["전체", "처리 중", "완료"];

/** 다음 단계 안내 — 고객이 "지금 무엇을 기다리는지" 알 수 있게 */
const nextStepText: Record<RequestStatus, string> = {
  접수: "제이랩테크 담당자가 요청을 확인하고 있습니다.",
  "검토 중": "장비 이력과 재고를 확인하는 중입니다.",
  "일정·견적 제안": "제안 내용을 확인하시고 회신해 주시면 진행됩니다.",
  "처리 중": "일정에 맞춰 준비하고 있습니다.",
  완료: "처리가 완료되었습니다.",
};

export default function CustomerRequestsPage() {
  const { requests } = useStore();
  const [filter, setFilter] = useState<(typeof filters)[number]>("전체");
  const [open, setOpen] = useState(false);

  const myEquipment = useMemo(
    () => repo.getInstalledEquipment().filter((e) => e.customerId === demoCustomer.id),
    [],
  );

  const mine = useMemo(
    () =>
      requests
        .filter((r) => r.customerId === demoCustomer.id)
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [requests],
  );

  const filtered = mine.filter((r) =>
    filter === "전체" ? true : filter === "완료" ? r.status === "완료" : r.status !== "완료",
  );

  return (
    <div className="space-y-5">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-pine-900 md:text-2xl">
              요청 내역
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-inkmuted md:text-base">
              보내신 요청의 진행 상황을 확인하실 수 있습니다.
            </p>
          </div>
          <Button size="lg" className="shrink-0" onClick={() => setOpen(true)}>
            <Plus size={16} />새 요청
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.04} className="scroll-mt-20" id="sec-filter">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "h-9 whitespace-nowrap rounded-full border px-4 text-xs font-semibold transition-colors duration-fast",
                filter === f
                  ? "border-pine-700 bg-pine-700 text-white"
                  : "border-line bg-ivory-50 text-inkmuted hover:border-pine-100 hover:text-pine-700",
              )}
            >
              {f}
              {f !== "전체" ? (
                <span className="num ml-1.5 opacity-70">
                  {f === "완료"
                    ? mine.filter((r) => r.status === "완료").length
                    : mine.filter((r) => r.status !== "완료").length}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <Reveal delay={0.08}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ivory-200 text-inkmuted">
                <Inbox size={22} />
              </span>
              <p className="text-sm font-semibold text-pine-900">해당하는 요청이 없습니다</p>
              <p className="max-w-xs text-xs leading-relaxed text-inkmuted">
                교정·소모품·추가 계측이 필요하시면 새 요청을 보내주세요.
              </p>
              <Button size="md" className="mt-1" onClick={() => setOpen(true)}>
                <Plus size={15} />새 요청 보내기
              </Button>
            </CardContent>
          </Card>
        </Reveal>
      ) : (
        <Stagger className="space-y-4">
          {filtered.map((r) => {
            const stepIndex = REQUEST_STATUS_FLOW.indexOf(r.status);
            return (
              <StaggerItem key={r.id} id={`req-${r.id}`} className="scroll-mt-20">
                <Card>
                  <CardContent className="p-5 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone="outline">{r.requestType}</Badge>
                          <span className="num text-2xs text-inkmuted">
                            {formatDateTime(r.createdAt)} 접수
                          </span>
                        </div>
                        <p className="clamp-2 mt-2 text-base font-bold leading-snug text-pine-900">
                          {r.title}
                        </p>
                        {r.equipmentName ? (
                          <p className="clamp-1 mt-1 flex items-center gap-1.5 text-2xs text-inkmuted">
                            <Wrench size={12} className="shrink-0" />
                            {r.equipmentName}
                          </p>
                        ) : null}
                      </div>
                      <RequestStatusBadge status={r.status} />
                    </div>

                    <p className="clamp-3 mt-3 text-xs leading-relaxed text-inkbody">
                      {r.detail}
                    </p>

                    {/* 진행 단계 */}
                    <div className="mt-4">
                      <div className="flex gap-1">
                        {REQUEST_STATUS_FLOW.map((s, i) => (
                          <div
                            key={s}
                            className={cn(
                              "h-1.5 flex-1 rounded-full transition-colors duration-base",
                              i <= stepIndex ? "bg-pine-600" : "bg-line",
                            )}
                          />
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap justify-between gap-x-2 gap-y-1">
                        {REQUEST_STATUS_FLOW.map((s, i) => (
                          <span
                            key={s}
                            className={cn(
                              "whitespace-nowrap text-[0.5625rem]",
                              i === stepIndex
                                ? "font-bold text-pine-700"
                                : i < stepIndex
                                  ? "text-inkmuted"
                                  : "text-inkmuted/50",
                            )}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 제이랩테크 답변 / 다음 단계 */}
                    <div
                      className={cn(
                        "mt-4 flex gap-2.5 rounded-xl p-3.5",
                        r.status === "완료"
                          ? "bg-pine-50/70"
                          : "border border-line bg-ivory-100/70",
                      )}
                    >
                      {r.status === "완료" ? (
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-pine-600" />
                      ) : (
                        <MessageCircle size={16} className="mt-0.5 shrink-0 text-sand-600" />
                      )}
                      <div className="min-w-0">
                        <p className="text-2xs font-bold text-pine-900">
                          {r.response ? "제이랩테크 답변" : "다음 단계"}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-inkbody">
                          {r.response ?? nextStepText[r.status]}
                        </p>
                        <p className="num mt-1 text-[0.5625rem] text-inkmuted">
                          최종 업데이트 {formatDateTime(r.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}

      <RequestDialog
        open={open}
        onClose={() => setOpen(false)}
        equipmentOptions={myEquipment}
      />
    </div>
  );
}
