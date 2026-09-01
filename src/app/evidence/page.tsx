"use client";

/**
 * AX 실증성과 (Evidence Center)
 *
 * 원칙: 여기에는 가짜 성과 숫자가 없다.
 * 모든 수치는 store(localStorage)에 실제로 기록된 Action 을 센 것이고,
 * 카드를 누르면 그 수치를 만든 개별 기록을 그대로 볼 수 있다.
 * KPI → Result → Evidence 가 끊기지 않게 연결한다.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  FileText,
  PhoneCall,
  Inbox,
  CheckCircle2,
  Activity,
  ChevronDown,
  Database,
  Target,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataChip } from "@/components/ui/status-chip";
import { PageHeader } from "@/components/ui/page-header";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";
import { useStore } from "@/lib/store-context";
import { cn, formatDateTime, formatManwon } from "@/lib/utils";

interface EvidenceRow {
  primary: string;
  secondary: string;
  meta: string;
}

export default function EvidencePage() {
  const { orders, quotes, activities, requests, interests } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  const contacts = activities.filter((a) => a.kind === "고객 연락");
  const calibrations = activities.filter((a) => a.kind === "교정 예약");
  const doneRequests = requests.filter((r) => r.status === "완료");
  const handledRequests = requests.filter((r) => r.status !== "접수");

  /** 실제 저장된 견적만 합산한다 — 추정 매출이 아니다 */
  const quoteTotal = quotes.reduce((sum, q) => sum + q.totalManwon, 0);

  const metrics = useMemo(
    () => [
      {
        id: "orders",
        icon: ShoppingCart,
        label: "발주 등록",
        count: orders.length,
        unit: "건",
        note: "재고 신호를 보고 실제로 등록한 발주",
        rows: orders.map<EvidenceRow>((o) => ({
          primary: `${o.itemName} ${o.model}`,
          secondary: `${o.qty}개 · ${formatManwon(o.amountManwon)} · ${o.status}`,
          meta: formatDateTime(o.createdAt),
        })),
      },
      {
        id: "quotes",
        icon: FileText,
        label: "견적 저장",
        count: quotes.length,
        unit: "건",
        note: "추천·설계에서 만들어 저장한 견적",
        rows: quotes.map<EvidenceRow>((q) => ({
          primary: q.customerLabel,
          secondary: `${q.productSummary} · ${formatManwon(q.totalManwon)} · ${q.origin}`,
          meta: formatDateTime(q.createdAt),
        })),
      },
      {
        id: "requests",
        icon: Inbox,
        label: "고객 요청 접수",
        count: requests.length,
        unit: "건",
        note: "고객 플랫폼에서 직접 들어온 요청",
        rows: requests.map<EvidenceRow>((r) => ({
          primary: `${r.customerName} · ${r.requestType}`,
          secondary: `${r.title} · ${r.status}`,
          meta: formatDateTime(r.createdAt),
        })),
      },
      {
        id: "handled",
        icon: CheckCircle2,
        label: "요청 처리 진행",
        count: handledRequests.length,
        unit: "건",
        note: `이 중 ${doneRequests.length}건은 완료 처리`,
        rows: handledRequests.map<EvidenceRow>((r) => ({
          primary: `${r.customerName} · ${r.requestType}`,
          secondary: `현재 상태 ${r.status}${r.response ? ` · ${r.response}` : ""}`,
          meta: formatDateTime(r.updatedAt),
        })),
      },
      {
        id: "interests",
        icon: Sparkles,
        label: "확장 서비스 관심 표시",
        count: interests.length,
        unit: "건",
        note: "고객이 준비 중 서비스에 남긴 수요 신호 — 무엇을 먼저 만들지의 근거",
        rows: interests.map<EvidenceRow>((i) => ({
          primary: `${i.customerName} · ${i.serviceTitle}`,
          secondary: `${i.serviceStage} 서비스`,
          meta: formatDateTime(i.createdAt),
        })),
      },
      {
        id: "contacts",
        icon: PhoneCall,
        label: "고객 접촉 기록",
        count: contacts.length,
        unit: "건",
        note: "재구매 예측을 보고 남긴 연락 기록",
        rows: contacts.map<EvidenceRow>((a) => ({
          primary: a.title,
          secondary: a.detail.includes("|") ? a.detail.split("|")[1] : a.detail,
          meta: formatDateTime(a.createdAt),
        })),
      },
      {
        id: "calibrations",
        icon: Activity,
        label: "교정 방문 예약",
        count: calibrations.length,
        unit: "건",
        note: "설치장비 교정 주기를 보고 잡은 일정",
        rows: calibrations.map<EvidenceRow>((a) => ({
          primary: a.title,
          secondary: a.detail.includes("|") ? a.detail.split("|")[1] : a.detail,
          meta: formatDateTime(a.createdAt),
        })),
      },
    ],
    [orders, quotes, requests, handledRequests, doneRequests, contacts, calibrations, interests],
  );

  const totalActions = metrics.reduce((s, m) => s + m.count, 0);

  /** 측정 준비 중 항목 — 실측이 생기기 전까지 목표만 표시한다 */
  const measures = [
    {
      label: "견적 작성 소요 시간",
      before: "측정 전",
      target: "단축",
      measured: null as string | null,
    },
    { label: "재고 확인 소요 시간", before: "측정 전", target: "단축", measured: null },
    { label: "재구매 선제 연락", before: "측정 전", target: "증가", measured: null },
    { label: "고객 요청 대응 시간", before: "측정 전", target: "단축", measured: null },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="AX 실증성과"
        description="이 플랫폼에서 실제로 일어난 일만 셉니다. 각 카드를 누르면 그 수치를 만든 기록을 그대로 확인할 수 있습니다."
        badge="3단계 고도화"
      />

      {/* 요약 배너 */}
      <Reveal>
        <Card className="overflow-hidden border-0 bg-pine-900 text-white">
          <CardContent className="relative p-6 md:p-7">
            <p className="text-2xs font-semibold tracking-[0.16em] text-sand-400">
              ACTUAL RECORD · 실제 기록
            </p>
            <h2 className="mt-2 max-w-2xl text-base font-bold leading-snug md:text-lg">
              지금까지 이 플랫폼에 남은 실제 Action은 {totalActions}건입니다.
            </h2>
            <p className="mt-2.5 max-w-2xl text-xs leading-relaxed text-white/65 md:text-sm">
              화면의 재고·고객 데이터는 시연용이지만, 아래 숫자는 다릅니다. 발주를 누르고
              견적을 저장하고 고객 요청을 처리한 기록만 셉니다. 실제 운영에서는 이 기록이
              쌓여 사업 고도화·정책자금 심사의 근거가 됩니다.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="min-w-0">
                <p className="clamp-1 text-2xs text-white/50">기록된 Action</p>
                <p className="num mt-0.5 text-lg font-bold text-white">{totalActions}건</p>
              </div>
              <div className="min-w-0">
                <p className="clamp-1 text-2xs text-white/50">저장 견적 합계</p>
                <p className="num mt-0.5 text-lg font-bold text-white">
                  {quotes.length ? formatManwon(quoteTotal) : "—"}
                </p>
              </div>
              <div className="min-w-0">
                <p className="clamp-1 text-2xs text-white/50">고객 요청</p>
                <p className="num mt-0.5 text-lg font-bold text-white">{requests.length}건</p>
              </div>
              <div className="min-w-0">
                <p className="clamp-1 text-2xs text-white/50">완료 처리</p>
                <p className="num mt-0.5 text-lg font-bold text-white">
                  {doneRequests.length}건
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sand-500/10 blur-2xl" />
          </CardContent>
        </Card>
      </Reveal>

      {/* 실제 활동 — 클릭하면 근거 기록 */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          const open = openId === m.id;
          const empty = m.count === 0;
          return (
            <StaggerItem key={m.id}>
              <Card
                className={cn(
                  "h-full transition-all duration-base",
                  open && "border-pine-100 shadow-card-hover",
                )}
              >
                <CardContent className="p-0">
                  <button
                    type="button"
                    disabled={empty}
                    onClick={() => setOpenId(open ? null : m.id)}
                    className={cn(
                      "flex w-full items-center gap-4 p-5 text-left transition-colors duration-fast",
                      !empty && "hover:bg-pine-50/40",
                      empty && "cursor-default",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                        empty ? "bg-ivory-200 text-inkmuted" : "bg-pine-50 text-pine-700",
                      )}
                    >
                      <Icon size={19} strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="clamp-1 text-xs text-inkmuted">{m.label}</p>
                      <p className="num text-xl font-bold text-pine-900">
                        {m.count}
                        <span className="ml-0.5 text-xs font-medium text-inkmuted">
                          {m.unit}
                        </span>
                      </p>
                      <p className="clamp-1 mt-0.5 text-2xs text-inkmuted">{m.note}</p>
                    </div>
                    {!empty ? (
                      <ChevronDown
                        size={16}
                        className={cn(
                          "shrink-0 text-inkmuted transition-transform duration-base",
                          open && "rotate-180",
                        )}
                      />
                    ) : null}
                  </button>

                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 border-t border-line px-5 py-4">
                          <p className="text-2xs font-bold uppercase tracking-wider text-sand-600">
                            근거 기록 {m.count}건
                          </p>
                          {m.rows.map((row, i) => (
                            <div
                              key={i}
                              className="rounded-lg border border-line/70 bg-ivory-100/60 p-3"
                            >
                              <p className="clamp-1 text-2xs font-bold text-pine-900">
                                {row.primary}
                              </p>
                              <p className="clamp-2 mt-0.5 text-2xs leading-relaxed text-inkmuted">
                                {row.secondary}
                              </p>
                              <p className="num mt-1 text-[0.5625rem] text-inkmuted">
                                {row.meta}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* 발견된 영업기회 */}
      <Reveal delay={0.08}>
        <Card>
          <CardHeader>
            <CardTitle>발견된 영업기회</CardTitle>
            <DataChip kind="ACTUAL" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-ivory-100/60 p-4">
                <p className="text-2xs text-inkmuted">고객 요청에서 발생</p>
                <p className="num mt-1 text-xl font-bold text-pine-900">
                  {requests.length}건
                </p>
              </div>
              <div className="rounded-xl border border-line bg-ivory-100/60 p-4">
                <p className="text-2xs text-inkmuted">견적으로 이어짐</p>
                <p className="num mt-1 text-xl font-bold text-pine-900">{quotes.length}건</p>
              </div>
              <div className="rounded-xl border border-pine-100 bg-pine-50/60 p-4">
                <p className="text-2xs text-inkmuted">저장 견적 합계</p>
                <p className="num mt-1 text-xl font-bold text-pine-900">
                  {quotes.length ? formatManwon(quoteTotal) : "—"}
                </p>
              </div>
            </div>
            <p className="mt-3 text-2xs leading-relaxed text-inkmuted">
              금액은 추정치가 아니라 실제로 저장된 견적만 합산한 값입니다. 저장된 견적이
              없으면 금액을 표시하지 않습니다.
            </p>
          </CardContent>
        </Card>
      </Reveal>

      {/* 측정 준비 중 */}
      <Reveal delay={0.12}>
        <Card>
          <CardHeader>
            <CardTitle>데이터 기반 변화 — 측정 준비</CardTitle>
            <DataChip kind="TARGET" />
          </CardHeader>
          <CardContent className="space-y-2.5">
            <p className="rounded-xl bg-ivory-200/60 p-3.5 text-2xs leading-relaxed text-inkmuted">
              아래 항목은 실제 운영 기간이 쌓여야 비교값이 생깁니다. 지금은 목표만 두고,
              임의의 개선율을 성과처럼 표시하지 않습니다.
            </p>
            {measures.map((m) => (
              <div
                key={m.label}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-line/70 bg-ivory-100/60 p-3.5"
              >
                <p className="clamp-1 min-w-[8rem] flex-1 text-xs font-bold text-pine-900">
                  {m.label}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg border border-line bg-ivory-50 px-2.5 py-1 text-2xs text-inkmuted">
                    도입 전 · {m.before}
                  </span>
                  <ArrowRight size={12} className="shrink-0 text-sand-500" />
                  <span className="rounded-lg border border-sage-200 bg-sage-100/60 px-2.5 py-1 text-2xs font-medium text-inkbody">
                    목표 · {m.target}
                  </span>
                  <ArrowRight size={12} className="shrink-0 text-sand-500" />
                  <span className="rounded-lg border border-dashed border-line bg-ivory-50 px-2.5 py-1 text-2xs text-inkmuted">
                    {m.measured ?? "측정 준비 중"}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </Reveal>

      {/* 다음 단계 */}
      <Reveal delay={0.16}>
        <Card className="border-dashed">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-bold text-pine-900">
                <Database size={16} className="shrink-0 text-pine-600" />
                실측값은 어떻게 생기나요?
              </p>
              <p className="mt-1 text-2xs leading-relaxed text-inkmuted">
                실제 판매·재고 시스템을 연결하고 직원이 매일 사용하면, 위 기록에 시간
                정보가 함께 쌓입니다. 그때부터 도입 전후 비교가 가능해집니다.
              </p>
            </div>
            <Link href="/policy" className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-ivory-50 px-4 py-2.5 text-xs font-semibold text-pine-700 transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50">
                <Target size={14} />
                정책자금 성과 분석
              </span>
            </Link>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
