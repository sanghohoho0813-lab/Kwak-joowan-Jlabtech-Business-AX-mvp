"use client";

/**
 * 고객 플랫폼 — 서비스 & 확장 로드맵
 *
 * "지금 되는 것"과 "준비 중인 것"을 같은 화면, 같은 구조로 보여준다.
 * 준비 중·검토 중 항목은 클릭하면 열리지만 기능이 동작하지는 않는다.
 * 대신 어떤 데이터가 이미 있고 무엇이 더 필요한지를 함께 적어,
 * 확장 가능성을 과장 없이 읽히게 하는 것이 이 화면의 목적이다.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  Package,
  History,
  Repeat,
  FileClock,
  FileCheck2,
  Boxes,
  Radio,
  LineChart,
  Gauge,
  Ruler,
  ChevronDown,
  CheckCircle2,
  Layers,
  Wrench,
  CircleDollarSign,
  TriangleAlert,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { repo } from "@/data/repository";
import { demoCustomer } from "@/data/mock/customer-portal";
import { cn } from "@/lib/utils";
import type { ServiceOffering, ServiceStage, RevenueType } from "@/data/types";

const icons: Record<string, LucideIcon> = {
  calendar: CalendarCheck,
  package: Package,
  history: History,
  repeat: Repeat,
  fileclock: FileClock,
  filecheck: FileCheck2,
  boxes: Boxes,
  radio: Radio,
  linechart: LineChart,
  gauge: Gauge,
  ruler: Ruler,
};

const stageStyle: Record<
  ServiceStage,
  {
    tone: "success" | "clay" | "mist";
    card: string;
    icon: string;
    note: string;
    anchor: string;
    rail: string;
  }
> = {
  "이용 가능": {
    tone: "success",
    card: "border-pine-100",
    icon: "bg-pine-50 text-pine-700",
    note: "지금 이 플랫폼에서 동작합니다.",
    anchor: "stage-available",
    rail: "bg-pine-600",
  },
  "준비 중": {
    tone: "clay",
    card: "border-clay-400/50",
    icon: "bg-clay-100 text-clay-600",
    note: "필요한 데이터는 이미 있습니다. 기능 구현만 남았습니다.",
    anchor: "stage-preparing",
    rail: "bg-clay-500",
  },
  "검토 중": {
    tone: "mist",
    card: "border-dashed border-mist-200",
    icon: "bg-mist-100 text-mist-600",
    note: "실증과 검증이 먼저입니다. 아직 동작하지 않습니다.",
    anchor: "stage-review",
    rail: "bg-mist-500",
  },
};

const revenueTone: Record<RevenueType, "mist" | "gold" | "neutral" | "info"> = {
  "반복 매출": "gold",
  "건별 매출": "neutral",
  "자산 활용": "mist",
  "유지·락인": "info",
};

/** 매출 구조가 어떻게 바뀌는가 — 이 화면의 핵심 서사 */
const growthStory = [
  {
    step: "지금",
    title: "팔고, 필요할 때 대응한다",
    body: "장비를 납품하고, 고객이 요청하면 교정하고 소모품을 보냅니다. 매출은 요청이 올 때만 생깁니다.",
    tone: "bg-mist-100 text-inkbody",
    label: "건별 매출",
  },
  {
    step: "다음",
    title: "주기를 알고 있으니 먼저 움직인다",
    body: "장비별 교정 주기와 소모품 교체 주기가 이미 플랫폼에 있습니다. 요청을 기다리지 않고 미리 나갈 수 있습니다.",
    tone: "bg-clay-100 text-inkbody",
    label: "반복 매출",
  },
  {
    step: "이후",
    title: "상태를 알고 있으니 문제 전에 움직인다",
    body: "측정 데이터가 쌓이면 고장 전에 알리고, 운영 자체를 맡는 계약으로 넘어갑니다. 실증이 끝난 뒤의 이야기입니다.",
    tone: "bg-pine-50 text-pine-900",
    label: "계약·데이터",
  },
];

const stageOrder: ServiceStage[] = ["이용 가능", "준비 중", "검토 중"];

export default function CustomerServicesPage() {
  const catalog = useMemo(() => repo.getServiceCatalog(), []);
  const myEquipment = useMemo(
    () => repo.getInstalledEquipment().filter((e) => e.customerId === demoCustomer.id),
    [],
  );
  const [filter, setFilter] = useState<ServiceStage | "전체">("전체");
  const [openId, setOpenId] = useState<string | null>(null);

  /* 목차에서 특정 단계로 들어온 경우 — 필터에 가려지지 않게 전체로 되돌린 뒤 이동한다 */
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    setFilter("전체");
    const t = window.setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
      120,
    );
    return () => window.clearTimeout(t);
  }, []);

  /** 적용 대상 규모는 지어내지 않고 등록된 장비에서 센다 */
  const scopeCount = (s: ServiceOffering): number | null => {
    if (s.id === "svc-subscription")
      return myEquipment.filter((e) => e.consumableCycleMonths).length;
    if (s.id === "svc-contract") return myEquipment.length;
    return null;
  };

  const counts = stageOrder.map((st) => ({
    stage: st,
    n: catalog.filter((s) => s.stage === st).length,
  }));

  const visible = catalog.filter((s) => (filter === "전체" ? true : s.stage === filter));

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-pine-900 md:text-3xl">
          서비스
        </h1>
        <p className="mt-3 text-base leading-relaxed text-inkbody md:text-lg">
          제이랩테크가 지금 제공하는 것과, 준비하고 있는 것을 함께 정리했습니다.
          <br className="hidden sm:block" /> 각 항목을 누르면 어떻게 구현되고 무엇이
          달라지는지 확인하실 수 있습니다.
        </p>
      </Reveal>

      {/* 매출 구조 전환 서사 */}
      <Reveal delay={0.04} className="scroll-mt-20" id="sec-story">
        <Card>
          <CardContent className="p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles size={17} className="shrink-0 text-sand-600" />
              <p className="text-lg font-bold text-pine-900 md:text-xl">
                계측기를 파는 회사에서, 계측 운영을 맡는 회사로
              </p>
            </div>
            <p className="mt-2 text-base leading-relaxed text-inkmuted">
              아래 서비스들은 따로 떨어진 아이디어가 아니라 한 방향으로 이어집니다.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {growthStory.map((g, i) => (
                <div
                  key={g.step}
                  className={cn(
                    "relative flex flex-col gap-2 rounded-xl border border-line p-4",
                    g.tone,
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pine-900 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wide opacity-70">
                      {g.step}
                    </span>
                    <Badge tone="outline" size="md" className="ml-auto bg-ivory-50/60">
                      {g.label}
                    </Badge>
                  </div>
                  <p className="text-base font-bold leading-snug md:text-lg">{g.title}</p>
                  <p className="text-sm leading-relaxed opacity-85">{g.body}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* 단계 필터 */}
      <Reveal delay={0.08}>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("전체")}
            className={cn(
              "h-11 whitespace-nowrap rounded-full border px-5 text-sm font-bold transition-colors duration-fast",
              filter === "전체"
                ? "border-pine-700 bg-pine-700 text-white shadow-sm"
                : "border-line bg-ivory-50 text-inkbody hover:border-pine-200 hover:bg-pine-50",
            )}
          >
            전체 <span className="num ml-1.5 opacity-70">{catalog.length}</span>
          </button>
          {counts.map((c) => (
            <button
              key={c.stage}
              type="button"
              onClick={() => setFilter(c.stage)}
              className={cn(
                "h-11 whitespace-nowrap rounded-full border px-5 text-sm font-bold transition-colors duration-fast",
                filter === c.stage
                  ? "border-pine-700 bg-pine-700 text-white shadow-sm"
                  : "border-line bg-ivory-50 text-inkbody hover:border-pine-200 hover:bg-pine-50",
              )}
            >
              {c.stage} <span className="num ml-1.5 opacity-70">{c.n}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* 서비스 목록 — 단계별로 묶어 목차에서 바로 짚을 수 있게 한다 */}
      <div className="space-y-7">
        {stageOrder
          .filter((st) => filter === "전체" || filter === st)
          .map((st) => {
            const group = catalog.filter((x) => x.stage === st);
            if (group.length === 0) return null;
            const gs = stageStyle[st];
            return (
              <section key={st} id={gs.anchor} className="scroll-mt-20">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={cn("h-7 w-1.5 shrink-0 rounded-full", gs.rail)} />
                  <h2 className="text-xl font-bold text-pine-900 md:text-2xl">{st}</h2>
                  <Badge tone={gs.tone} size="md">{group.length}종</Badge>
                  <p className="w-full text-base text-inkmuted sm:w-auto sm:flex-1">{gs.note}</p>
                </div>
                <Stagger className="space-y-3">
                  {group.map((s) => {
            const Icon = icons[s.icon] ?? Wrench;
            const ss = stageStyle[s.stage];
            const open = openId === s.id;
            const n = scopeCount(s);

            return (
              <StaggerItem key={s.id}>
                <Card className={cn("overflow-hidden", ss.card, open && "shadow-card-hover")}>
                  {/* 헤더 — 클릭해서 펼친다 */}
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : s.id)}
                    aria-expanded={open}
                    className="flex w-full items-start gap-3 p-5 text-left transition-colors duration-fast hover:bg-pine-50/40 md:p-6"
                  >
                    <span
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                        ss.icon,
                      )}
                    >
                      <Icon size={24} strokeWidth={1.9} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="clamp-2 text-lg font-bold leading-snug text-pine-900 md:text-xl">
                          {s.title}
                        </span>
                        <Badge tone={ss.tone} size="md">{s.stage}</Badge>
                      </span>
                      <span className="clamp-2 mt-1.5 block text-base leading-relaxed text-inkmuted">
                        {s.summary}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge tone={revenueTone[s.revenueType]} size="md">{s.revenueType}</Badge>
                        {n !== null ? (
                          <span className="num text-sm text-inkmuted">
                            {s.scopeNote} {n}대
                          </span>
                        ) : null}
                      </span>
                    </span>

                    <ChevronDown
                      size={17}
                      className={cn(
                        "mt-1 shrink-0 text-inkmuted transition-transform duration-base",
                        open && "rotate-180 text-pine-700",
                      )}
                    />
                  </button>

                  {/* 상세 */}
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 border-t border-line px-5 py-5 md:px-6">
                          <p className="rounded-xl bg-ivory-200/60 px-4 py-3 text-base font-semibold text-inkbody">
                            {ss.note}
                          </p>

                          {/* 지금 준비된 것 */}
                          <section>
                            <p className="flex items-center gap-2 text-base font-bold text-pine-900 md:text-lg">
                              <Layers size={17} className="shrink-0 text-pine-600" />
                              지금 준비되어 있는 것
                            </p>
                            <ul className="mt-2 space-y-1.5">
                              {s.ready.map((r) => (
                                <li
                                  key={r}
                                  className="flex gap-2.5 text-base leading-relaxed text-inkbody"
                                >
                                  <CheckCircle2
                                    size={16}
                                    className="mt-1 shrink-0 text-pine-600"
                                  />
                                  <span className="min-w-0">{r}</span>
                                </li>
                              ))}
                            </ul>
                          </section>

                          {/* 어떻게 구현되는가 */}
                          <section>
                            <p className="flex items-center gap-2 text-base font-bold text-pine-900 md:text-lg">
                              <Wrench size={17} className="shrink-0 text-sage-600" />
                              어떻게 구현되는가
                            </p>
                            <ol className="mt-2 space-y-2">
                              {s.how.map((h, i) => (
                                <li key={h} className="flex gap-2.5">
                                  <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pine-50 text-sm font-bold text-pine-700">
                                    {i + 1}
                                  </span>
                                  <span className="min-w-0 text-base leading-relaxed text-inkbody">
                                    {h}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </section>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {/* 고객이 얻는 것 */}
                            <section className="rounded-xl bg-pine-50/60 p-4">
                              <p className="text-base font-bold text-pine-900 md:text-lg">
                                고객이 얻는 것
                              </p>
                              <ul className="mt-2 space-y-1.5">
                                {s.customerGain.map((c) => (
                                  <li
                                    key={c}
                                    className="flex gap-2 text-base leading-relaxed text-inkbody"
                                  >
                                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pine-600" />
                                    <span className="min-w-0">{c}</span>
                                  </li>
                                ))}
                              </ul>
                            </section>

                            {/* 수익 구조 */}
                            <section className="rounded-xl bg-sand-100/50 p-4">
                              <p className="flex items-center gap-2 text-base font-bold text-pine-900 md:text-lg">
                                <CircleDollarSign size={17} className="shrink-0 text-sand-600" />
                                제이랩테크의 수익 구조
                              </p>
                              <p className="mt-2 text-base leading-relaxed text-inkbody">
                                {s.revenueModel}
                              </p>
                            </section>
                          </div>

                          {/* 선행 조건 */}
                          <section className="flex gap-2.5 rounded-xl border border-line bg-ivory-100/70 p-4">
                            <TriangleAlert
                              size={19}
                              className="mt-0.5 shrink-0 text-inkmuted"
                            />
                            <div className="min-w-0">
                              <p className="text-base font-bold text-inkbody md:text-lg">
                                시작하기 전에 정리되어야 하는 것
                              </p>
                              <p className="mt-1.5 text-base leading-relaxed text-inkmuted">
                                {s.prerequisite}
                              </p>
                            </div>
                          </section>

                          {s.stage === "이용 가능" ? (
                            <Link
                              href="/customer/equipment"
                              className="inline-flex items-center gap-2 rounded-xl bg-pine-700 px-5 py-3 text-sm font-bold text-white transition-colors duration-fast hover:bg-pine-600"
                            >
                              내 장비에서 바로 요청하기
                              <ArrowRight size={14} />
                            </Link>
                          ) : null}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </Card>
              </StaggerItem>
            );
          })}
                </Stagger>
              </section>
            );
          })}
      </div>

      {/* 표기 원칙 */}
      <Reveal delay={0.12} className="scroll-mt-20" id="sec-notation">
        <Card className="border-dashed">
          <CardContent className="p-5 md:p-6">
            <p className="text-lg font-bold text-pine-900">표기에 대해</p>
            <ul className="mt-2.5 space-y-2">
              {stageOrder.map((st) => (
                <li key={st} className="flex flex-wrap items-center gap-2">
                  <Badge tone={stageStyle[st].tone} size="md">{st}</Badge>
                  <span className="min-w-0 flex-1 text-base leading-relaxed text-inkmuted">
                    {stageStyle[st].note}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-4 text-base leading-relaxed text-inkmuted">
              준비 중·검토 중 항목은 아직 동작하지 않는 기능입니다. 되는 것처럼 보이게 하는
              대신, 무엇이 이미 준비되어 있고 무엇이 더 필요한지를 함께 적었습니다. 예상
              매출액을 적지 않은 것도 같은 이유입니다. 근거가 생기기 전까지는 구조만
              말씀드립니다.
            </p>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
