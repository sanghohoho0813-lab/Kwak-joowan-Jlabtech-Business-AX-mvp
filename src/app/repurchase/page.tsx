"use client";

import { useMemo, useState } from "react";
import {
  PhoneCall,
  CalendarClock,
  Building2,
  Target,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, HoverCard } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";
import { useStore } from "@/lib/store-context";
import { useToast } from "@/components/ui/toast";
import { repo } from "@/data/repository";
import { cn, formatDate, dday } from "@/lib/utils";
import type { RepurchaseLikelihood } from "@/data/types";

const customers = repo.getCustomers();
const likelihoods: ("전체" | RepurchaseLikelihood)[] = ["전체", "높음", "중간", "낮음"];

export default function RepurchasePage() {
  const [filter, setFilter] = useState<(typeof likelihoods)[number]>("전체");
  const { activities, logActivity } = useStore();
  const toast = useToast();

  const contactedIds = new Set(
    activities
      .filter((a) => a.kind === "고객 연락")
      .map((a) => a.detail.split("|")[0]),
  );

  const recordContact = (id: string, company: string, action: string) => {
    logActivity({
      kind: "고객 연락",
      title: `${company} 접촉 기록`,
      detail: `${id}|${action}`,
    });
    toast("연락 기록이 저장되었습니다", `${company} · ${action}`);
  };

  const sorted = useMemo(
    () =>
      [...customers].sort(
        (a, b) =>
          new Date(a.expectedRepurchaseDate).getTime() -
          new Date(b.expectedRepurchaseDate).getTime(),
      ),
    [],
  );

  const filtered = useMemo(
    () => sorted.filter((c) => filter === "전체" || c.likelihood === filter),
    [sorted, filter],
  );

  const priorityCustomers = sorted.filter((c) => c.priority === "즉시 연락");
  const thisWeek = sorted.filter((c) => c.priority === "이번 주");
  const opportunityCount = priorityCustomers.length + thisWeek.length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="재구매 예측"
        description="기존 고객의 구매 주기를 분석해 다음 재구매 시점을 예측합니다. 기존 거래처 관리만 잘해도 매출은 올라갑니다."
      />

      {/* 요약 */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StaggerItem>
          <HoverCard className="h-28">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <PhoneCall size={19} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="clamp-1 text-xs text-inkmuted">즉시 연락 필요</p>
                <p className="num text-xl font-bold text-pine-900">
                  {priorityCustomers.length}개 고객사
                </p>
                <p className="clamp-1 text-2xs text-inkmuted">재구매 예상일이 임박했습니다</p>
              </div>
            </CardContent>
          </HoverCard>
        </StaggerItem>
        <StaggerItem>
          <HoverCard className="h-28">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sand-100 text-sand-600">
                <CalendarClock size={19} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="clamp-1 text-xs text-inkmuted">이번 주 관리 대상</p>
                <p className="num text-xl font-bold text-pine-900">
                  {thisWeek.length}개 고객사
                </p>
                <p className="clamp-1 text-2xs text-inkmuted">2주 내 재구매가 예상됩니다</p>
              </div>
            </CardContent>
          </HoverCard>
        </StaggerItem>
        <StaggerItem>
          <HoverCard className="h-28">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                <Target size={19} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="clamp-1 text-xs text-inkmuted">이번 달 접촉 기회</p>
                <p className="num text-xl font-bold text-pine-900">
                  {opportunityCount}건
                </p>
                <p className="clamp-1 text-2xs text-inkmuted">즉시 연락 + 이번 주 대상</p>
              </div>
            </CardContent>
          </HoverCard>
        </StaggerItem>
      </Stagger>

      {/* 우선 관리 고객 카드 */}
      <Reveal delay={0.08}>
        <Card>
          <CardHeader>
            <CardTitle>우선 관리 고객</CardTitle>
            <Badge tone="danger">
              {priorityCustomers.length}건 긴급
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {priorityCustomers.map((c) => (
                <div
                  key={c.id}
                  className="group flex min-h-[8.5rem] flex-col justify-between rounded-xl border border-line bg-ivory-100/60 p-4 transition-all duration-base hover:-translate-y-0.5 hover:border-pine-100 hover:bg-pine-50/40 hover:shadow-card"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pine-900 text-2xs font-bold text-sand-400">
                          {c.company.slice(0, 2)}
                        </span>
                        <div className="min-w-0">
                          <p className="clamp-1 text-sm font-bold text-pine-900">
                            {c.company}
                          </p>
                          <p className="clamp-1 text-2xs text-inkmuted">
                            {c.segment} · {c.region}
                          </p>
                        </div>
                      </div>
                      <Badge tone="danger">{dday(c.expectedRepurchaseDate)}</Badge>
                    </div>
                    <p className="clamp-2 mt-2.5 text-xs leading-relaxed text-inkbody">
                      {c.nextAction}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-line/60 pt-2.5">
                    <p className="clamp-1 min-w-0 flex-1 text-2xs text-inkmuted">
                      관심 품목: {c.interestItems.join(", ")}
                    </p>
                    {contactedIds.has(c.id) ? (
                      <Badge tone="success">연락 완료</Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => recordContact(c.id, c.company, c.nextAction)}
                      >
                        연락 기록 <ArrowRight size={12} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* 전체 고객 리스트 */}
      <Reveal delay={0.12}>
        <Card>
          <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <CardTitle>전체 고객 재구매 예측</CardTitle>
            <div className="flex flex-wrap gap-1.5 sm:ml-auto">
              {likelihoods.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setFilter(l)}
                  className={cn(
                    "h-7 whitespace-nowrap rounded-full border px-3 text-2xs font-semibold transition-all",
                    filter === l
                      ? "border-pine-700 bg-pine-700 text-white shadow-sm"
                      : "border-line bg-ivory-100 text-inkmuted hover:border-pine-100 hover:text-pine-700",
                  )}
                >
                  {l === "전체" ? "전체" : `가능성 ${l}`}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[52rem] text-left text-xs">
                <thead>
                  <tr className="border-b border-line bg-ivory-100 text-2xs text-inkmuted">
                    <th className="px-4 py-3 font-medium">고객사</th>
                    <th className="px-3 py-3 font-medium">최근 구매</th>
                    <th className="px-3 py-3 font-medium">재구매 예상일</th>
                    <th className="px-3 py-3 text-center font-medium">가능성</th>
                    <th className="px-3 py-3 text-center font-medium">우선순위</th>
                    <th className="px-4 py-3 font-medium">다음 액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-line/60 bg-ivory-50 transition-colors last:border-0 hover:bg-pine-50/50"
                    >
                      <td className="max-w-[13rem] px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pine-50 text-pine-700">
                            <Building2 size={14} strokeWidth={1.75} />
                          </span>
                          <div className="min-w-0">
                            <p className="clamp-1 font-semibold text-pine-900">{c.company}</p>
                            <p className="clamp-1 text-2xs text-inkmuted">
                              {c.segment} · {c.region}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[12rem] px-3 py-3">
                        <p className="num whitespace-nowrap text-inkbody">
                          {formatDate(c.lastPurchaseDate)}
                        </p>
                        <p className="clamp-1 text-2xs text-inkmuted">{c.lastPurchaseItem}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <p className="num font-semibold text-pine-900">
                          {formatDate(c.expectedRepurchaseDate)}
                        </p>
                        <p className="num text-2xs text-sand-600">
                          {dday(c.expectedRepurchaseDate)}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge tone={statusTone(c.likelihood)}>{c.likelihood}</Badge>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge tone={statusTone(c.priority)}>{c.priority}</Badge>
                      </td>
                      <td className="max-w-[16rem] px-4 py-3">
                        <p className="clamp-2 leading-relaxed text-inkbody">{c.nextAction}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-2xs text-inkmuted">
              재구매 예상일은 고객별 평균 구매 주기와 최근 구매일을 기반으로 산출됩니다.
            </p>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
