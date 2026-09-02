"use client";

import { useMemo, useState } from "react";
import { Inbox, Plus, Wrench, MessageCircle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { RequestDialog } from "@/components/customer/request-dialog";
import { RequestStatusBadge } from "@/components/customer/status-badge";
import { useStore } from "@/lib/store-context";
import { repo } from "@/data/repository";
import { useCustomer } from "@/lib/use-customer";
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
  const me = useCustomer();
  const { requests } = useStore();
  const [filter, setFilter] = useState<(typeof filters)[number]>("전체");
  const [open, setOpen] = useState(false);

  const myEquipment = useMemo(
    () => repo.getInstalledEquipment().filter((e) => e.customerId === me.id),
    [me.id],
  );

  const mine = useMemo(
    () =>
      requests
        .filter((r) => r.customerId === me.id)
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [requests, me.id],
  );

  const filtered = mine.filter((r) =>
    filter === "전체" ? true : filter === "완료" ? r.status === "완료" : r.status !== "완료",
  );

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-inkstrong md:text-3xl">
              요청 내역
            </h1>
            <p className="mt-3 text-base leading-relaxed text-inkbody md:text-lg">
              보내신 요청이 어디까지 진행됐는지 보실 수 있습니다.
            </p>
          </div>
          <Button size="xl" className="shrink-0" onClick={() => setOpen(true)}>
            <Plus size={18} />새 요청 보내기
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.04} className="scroll-mt-24" id="sec-filter">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "h-11 whitespace-nowrap rounded-full border px-5 text-sm font-bold transition-colors duration-fast",
                filter === f
                  ? "border-pine-700 bg-pine-700 text-white shadow-sm"
                  : "border-line bg-white text-inkbody hover:border-pine-200 hover:bg-pine-50",
              )}
            >
              {f}
              <span className="num ml-2 opacity-70">
                {f === "전체"
                  ? mine.length
                  : f === "완료"
                    ? mine.filter((r) => r.status === "완료").length
                    : mine.filter((r) => r.status !== "완료").length}
              </span>
            </button>
          ))}
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <Reveal delay={0.08}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cloud text-inkmuted">
                <Inbox size={28} />
              </span>
              <p className="text-lg font-bold text-inkstrong">해당하는 요청이 없습니다</p>
              <p className="max-w-sm text-base leading-relaxed text-inkmuted">
                교정·소모품·추가 계측이 필요하시면 새 요청을 보내주세요.
              </p>
              <Button size="xl" className="mt-1" onClick={() => setOpen(true)}>
                <Plus size={18} />새 요청 보내기
              </Button>
            </CardContent>
          </Card>
        </Reveal>
      ) : (
        <Stagger className="space-y-4">
          {filtered.map((r) => {
            const stepIndex = REQUEST_STATUS_FLOW.indexOf(r.status);
            const done = r.status === "완료";
            return (
              <StaggerItem key={r.id} id={`req-${r.id}`} className="scroll-mt-24">
                <Card>
                  <CardContent className="p-5 md:p-6">
                    {/* 제목 · 상태 */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="clamp-2 text-lg font-bold leading-snug text-inkstrong md:text-xl">
                          {r.title}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <Badge tone="outline">{r.requestType}</Badge>
                          <span className="num text-sm text-inkmuted">
                            {formatDateTime(r.createdAt)} 접수
                          </span>
                        </div>
                        {r.equipmentName ? (
                          <p className="clamp-1 mt-1.5 flex items-center gap-1.5 text-sm text-inkmuted">
                            <Wrench size={14} className="shrink-0" />
                            {r.equipmentName}
                          </p>
                        ) : null}
                      </div>
                      <RequestStatusBadge status={r.status} size="md" />
                    </div>

                    {/* 진행 단계 — 지금 어디인지 한 줄로 먼저 말한다 */}
                    <div className="mt-5 rounded-2xl border border-line bg-cloud p-4">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className="num text-sm font-bold text-inkmuted">
                          {stepIndex + 1} / {REQUEST_STATUS_FLOW.length} 단계
                        </span>
                        <span className="text-base font-bold text-inkstrong">
                          지금은 &lsquo;{r.status}&rsquo; 입니다
                        </span>
                      </div>

                      <div className="mt-3 flex gap-1.5">
                        {REQUEST_STATUS_FLOW.map((s, i) => (
                          <div
                            key={s}
                            className={cn(
                              "h-2.5 flex-1 rounded-full transition-colors duration-base",
                              i < stepIndex
                                ? "bg-pine-600"
                                : i === stepIndex
                                  ? done
                                    ? "bg-pine-600"
                                    : "bg-sand-500"
                                  : "bg-line",
                            )}
                          />
                        ))}
                      </div>

                      {/* 단계 이름은 현재·다음만 크게 보여준다 */}
                      {!done && REQUEST_STATUS_FLOW[stepIndex + 1] ? (
                        <p className="mt-2.5 text-sm text-inkmuted">
                          다음 단계는{" "}
                          <span className="font-bold text-inkbody">
                            {REQUEST_STATUS_FLOW[stepIndex + 1]}
                          </span>
                          입니다
                        </p>
                      ) : null}
                    </div>

                    {/* 요청 내용 */}
                    <p className="clamp-3 mt-4 text-base leading-relaxed text-inkbody">
                      {r.detail}
                    </p>

                    {/* 답변 / 다음 단계 */}
                    <div
                      className={cn(
                        "mt-4 flex gap-3 rounded-2xl p-4",
                        done
                          ? "bg-pine-50"
                          : r.response
                            ? "border border-clay-400/50 bg-clay-100/50"
                            : "border border-line bg-cloud",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          done
                            ? "bg-pine-600 text-white"
                            : r.response
                              ? "bg-clay-500 text-white"
                              : "bg-cloud text-inkmuted",
                        )}
                      >
                        {done ? (
                          <CheckCircle2 size={19} />
                        ) : r.response ? (
                          <MessageCircle size={19} />
                        ) : (
                          <Clock size={19} />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-bold text-inkstrong">
                          {r.response ? "제이랩테크 답변" : "지금 진행 상황"}
                        </p>
                        <p className="mt-1.5 text-base leading-relaxed text-inkbody">
                          {r.response ?? nextStepText[r.status]}
                        </p>
                        <p className="num mt-2 text-sm text-inkmuted">
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
