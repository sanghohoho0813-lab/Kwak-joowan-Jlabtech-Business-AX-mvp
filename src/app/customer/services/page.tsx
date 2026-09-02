"use client";

/**
 * 고객 플랫폼 — 서비스 허브
 *
 * 메뉴에서 따로 떼어 둔 화면. 지금 되는 것과 준비 중인 것을 단계별 카드로
 * 늘어놓고, 카드를 누르면 상세 시트가 열린다. 목록은 훑어보기 좋게, 상세는
 * 한 가지에 집중하게 나눈다.
 *
 * 준비 중·검토 중 항목은 기능이 동작하지 않는다. 대신 어떤 데이터가 이미 있고
 * 무엇이 더 필요한지를 적고, "준비되면 알려주세요"로 관심을 남길 수 있다.
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
  X,
  CheckCircle2,
  Layers,
  Wrench,
  CircleDollarSign,
  TriangleAlert,
  ArrowRight,
  Bell,
  BellRing,
  Megaphone,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { PlatformUpdates } from "@/components/customer/platform-updates";
import { useStore } from "@/lib/store-context";
import { useCustomer } from "@/lib/use-customer";
import { repo } from "@/data/repository";
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

/** 단계마다 색을 완전히 달리한다 — 같은 위계의 다른 상태 */
const stageStyle: Record<
  ServiceStage,
  {
    tone: "success" | "clay" | "mist";
    anchor: string;
    band: string;
    icon: string;
    title: string;
    note: string;
  }
> = {
  "이용 가능": {
    tone: "success",
    anchor: "stage-available",
    band: "bg-pine-50",
    icon: "bg-pine-700 text-white",
    title: "지금 이용하실 수 있습니다",
    note: "이 플랫폼에서 지금 동작합니다.",
  },
  "준비 중": {
    tone: "clay",
    anchor: "stage-preparing",
    band: "bg-clay-100/60",
    icon: "bg-clay-500 text-white",
    title: "다음으로 준비하고 있습니다",
    note: "필요한 데이터는 이미 있습니다. 기능 구현만 남았습니다.",
  },
  "검토 중": {
    tone: "mist",
    anchor: "stage-review",
    band: "bg-mist-100/70",
    icon: "bg-mist-600 text-white",
    title: "실증 후에 판단합니다",
    note: "검증이 먼저입니다. 아직 동작하지 않습니다.",
  },
};

const revenueTone: Record<RevenueType, "mist" | "gold" | "neutral" | "info"> = {
  "반복 매출": "gold",
  "건별 매출": "neutral",
  "자산 활용": "mist",
  "유지·락인": "info",
};

const stageOrder: ServiceStage[] = ["이용 가능", "준비 중", "검토 중"];

export default function CustomerServicesPage() {
  const me = useCustomer();
  const catalog = useMemo(() => repo.getServiceCatalog(), []);
  const myEquipment = useMemo(
    () => repo.getInstalledEquipment().filter((e) => e.customerId === me.id),
    [me.id],
  );
  const { interests, toggleServiceInterest } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  const isInterested = (id: string) =>
    interests.some((i) => i.serviceId === id && i.customerId === me.id);
  const myInterestCount = interests.filter((i) => i.customerId === me.id).length;

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

  /* 해시로 들어온 경우 해당 단계로 이동 */
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = window.setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
      120,
    );
    return () => window.clearTimeout(t);
  }, []);

  /* 시트가 열려 있으면 ESC 로 닫는다 */
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  const selected = catalog.find((s) => s.id === openId) ?? null;

  return (
    <div className="space-y-10">
      {/* 히어로 — 서비스 허브임을 색으로 먼저 말한다 */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-clay-600 p-6 text-white shadow-card-hover md:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-clay-400/40 blur-2xl"
          />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
              제이랩테크 서비스
            </p>
            <h1 className="mt-1.5 text-2xl font-bold leading-tight tracking-tight md:text-3xl">
              계측기를 파는 회사에서,
              <br className="hidden sm:block" /> 계측 운영을 맡는 회사로
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              지금 제공하는 것과 준비 중인 것을 한곳에 정리했습니다. 카드를 누르면 어떻게
              구현되고 무엇이 달라지는지 보실 수 있습니다.
            </p>

            {/* 단계 요약 — 눌러서 이동 */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {counts.map((c) => {
                const st = stageStyle[c.stage];
                return (
                  <a
                    key={c.stage}
                    href={`#${st.anchor}`}
                    className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-sm transition-colors duration-fast hover:bg-white/20"
                  >
                    <span className="num block text-2xl font-bold leading-none md:text-3xl">
                      {c.n}
                      <span className="ml-0.5 text-sm font-semibold text-white/70">종</span>
                    </span>
                    <span className="mt-1.5 block text-sm font-bold">{c.stage}</span>
                  </a>
                );
              })}
            </div>

            {myInterestCount > 0 ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3.5 py-2 text-sm font-semibold">
                <BellRing size={15} />
                관심 표시하신 서비스 {myInterestCount}개 — 준비 순서에 먼저 반영합니다
              </p>
            ) : null}
          </div>
        </div>
      </Reveal>

      {/* 단계별 카드 그리드 */}
      {stageOrder.map((st, si) => {
        const gs = stageStyle[st];
        const group = catalog.filter((s) => s.stage === st);
        return (
          <Reveal key={st} delay={0.04 + si * 0.03}>
            <section
              id={gs.anchor}
              className={cn("scroll-mt-24 rounded-3xl p-5 md:p-7", gs.band)}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "num flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold shadow-sm",
                    gs.icon,
                  )}
                >
                  {si + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-inkstrong md:text-2xl">{gs.title}</h2>
                    <Badge tone={gs.tone} size="md">
                      {st} {group.length}종
                    </Badge>
                  </div>
                  <p className="mt-1 text-base text-inkbody">{gs.note}</p>
                </div>
              </div>

              <Stagger className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                {group.map((s) => {
                  const Icon = icons[s.icon] ?? Wrench;
                  const n = scopeCount(s);
                  const on = isInterested(s.id);
                  return (
                    <StaggerItem key={s.id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(s.id)}
                        className="group flex h-full w-full items-start gap-4 rounded-2xl border-2 border-transparent bg-white p-5 text-left shadow-card transition-all duration-base hover:-translate-y-0.5 hover:border-inkstrong/10 hover:shadow-card-hover"
                      >
                        <span
                          className={cn(
                            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                            gs.icon,
                          )}
                        >
                          <Icon size={26} strokeWidth={1.9} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="clamp-2 block text-lg font-bold leading-snug text-inkstrong">
                            {s.title}
                          </span>
                          <span className="clamp-2 mt-1.5 block text-base leading-relaxed text-inkbody">
                            {s.summary}
                          </span>
                          <span className="mt-3 flex flex-wrap items-center gap-1.5">
                            <Badge tone={revenueTone[s.revenueType]}>{s.revenueType}</Badge>
                            {n !== null ? (
                              <span className="num text-sm text-inkmuted">
                                {s.scopeNote} {n}대
                              </span>
                            ) : null}
                            {on ? (
                              <Badge tone="clay">
                                <BellRing size={11} />
                                관심 표시함
                              </Badge>
                            ) : null}
                          </span>
                        </span>
                        <ChevronRight
                          size={20}
                          className="mt-1 shrink-0 text-inkmuted transition-transform duration-base group-hover:translate-x-1 group-hover:text-inkstrong"
                        />
                      </button>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </section>
          </Reveal>
        );
      })}

      {/* 변경 이력 */}
      <Reveal delay={0.14} className="scroll-mt-24" id="sec-updates">
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mist-600 text-white shadow-sm">
            <Megaphone size={20} />
          </span>
          <h2 className="text-xl font-bold text-inkstrong md:text-2xl">이 플랫폼의 변화</h2>
        </div>
        <PlatformUpdates />
      </Reveal>

      {/* 표기 원칙 */}
      <Reveal delay={0.16} className="scroll-mt-24" id="sec-notation">
        <div className="rounded-2xl border border-dashed border-line bg-white p-5 md:p-6">
          <p className="text-lg font-bold text-inkstrong">표기에 대해</p>
          <ul className="mt-3 space-y-2">
            {stageOrder.map((st) => (
              <li key={st} className="flex flex-wrap items-center gap-2">
                <Badge tone={stageStyle[st].tone} size="md">
                  {st}
                </Badge>
                <span className="min-w-0 flex-1 text-base leading-relaxed text-inkbody">
                  {stageStyle[st].note}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-line pt-4 text-base leading-relaxed text-inkmuted">
            준비 중·검토 중 항목은 아직 동작하지 않는 기능입니다. 되는 것처럼 보이게 하는 대신,
            무엇이 이미 준비되어 있고 무엇이 더 필요한지를 함께 적었습니다. 예상 매출액을 적지
            않은 것도 같은 이유입니다. 근거가 생기기 전까지는 구조만 말씀드립니다.
          </p>
        </div>
      </Reveal>

      {/* 상세 시트 */}
      <AnimatePresence>
        {selected ? (
          <ServiceSheet
            service={selected}
            scope={scopeCount(selected)}
            interested={isInterested(selected.id)}
            onToggle={() =>
              toggleServiceInterest({
                serviceId: selected.id,
                serviceTitle: selected.title,
                serviceStage: selected.stage,
                customerId: me.id,
                customerName: me.company,
              })
            }
            onClose={() => setOpenId(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ServiceSheet({
  service: s,
  scope,
  interested,
  onToggle,
  onClose,
}: {
  service: ServiceOffering;
  scope: number | null;
  interested: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const gs = stageStyle[s.stage];
  const Icon = icons[s.icon] ?? Wrench;

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-pine-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={s.title}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-card-hover sm:max-w-2xl sm:rounded-3xl"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 머리 — 단계 색 */}
        <div className={cn("sticky top-0 z-10 px-5 pb-4 pt-5 md:px-7", gs.band)}>
          <div className="flex items-start gap-4">
            <span
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                gs.icon,
              )}
            >
              <Icon size={26} strokeWidth={1.9} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={gs.tone} size="md">
                  {s.stage}
                </Badge>
                <Badge tone={revenueTone[s.revenueType]} size="md">
                  {s.revenueType}
                </Badge>
              </div>
              <h2 className="mt-2 text-xl font-bold leading-snug text-inkstrong md:text-2xl">
                {s.title}
              </h2>
              <p className="mt-1.5 text-base leading-relaxed text-inkbody">{s.summary}</p>
              {scope !== null ? (
                <p className="num mt-2 text-sm font-semibold text-inkmuted">
                  {s.scopeNote} {scope}대
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl bg-white/70 p-2 text-inkbody transition-colors duration-fast hover:bg-white hover:text-inkstrong"
              aria-label="닫기"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-6 px-5 py-6 md:px-7">
          <p className="rounded-xl bg-cloud px-4 py-3 text-base font-semibold text-inkstrong">
            {gs.note}
          </p>

          {/* 지금 준비된 것 */}
          <section>
            <p className="flex items-center gap-2 text-base font-bold text-inkstrong md:text-lg">
              <Layers size={18} className="shrink-0 text-pine-600" />
              지금 준비되어 있는 것
            </p>
            <ul className="mt-2.5 space-y-2">
              {s.ready.map((r) => (
                <li key={r} className="flex gap-2.5 text-base leading-relaxed text-inkbody">
                  <CheckCircle2 size={17} className="mt-1 shrink-0 text-pine-600" />
                  <span className="min-w-0">{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 어떻게 구현되는가 */}
          <section>
            <p className="flex items-center gap-2 text-base font-bold text-inkstrong md:text-lg">
              <Wrench size={18} className="shrink-0 text-mist-600" />
              어떻게 구현되는가
            </p>
            <ol className="mt-2.5 space-y-2.5">
              {s.how.map((h, i) => (
                <li key={h} className="flex gap-3">
                  <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mist-100 text-sm font-bold text-mist-600">
                    {i + 1}
                  </span>
                  <span className="min-w-0 text-base leading-relaxed text-inkbody">{h}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <section className="rounded-2xl border-l-4 border-pine-600 bg-pine-50 p-4">
              <p className="text-base font-bold text-inkstrong md:text-lg">고객이 얻는 것</p>
              <ul className="mt-2 space-y-1.5">
                {s.customerGain.map((c) => (
                  <li key={c} className="flex gap-2 text-base leading-relaxed text-inkbody">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pine-600" />
                    <span className="min-w-0">{c}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-2xl border-l-4 border-sand-600 bg-sand-100 p-4">
              <p className="flex items-center gap-2 text-base font-bold text-inkstrong md:text-lg">
                <CircleDollarSign size={17} className="shrink-0 text-sand-600" />
                제이랩테크의 수익 구조
              </p>
              <p className="mt-2 text-base leading-relaxed text-inkbody">{s.revenueModel}</p>
            </section>
          </div>

          <section className="flex gap-3 rounded-2xl border border-line bg-cloud p-4">
            <TriangleAlert size={19} className="mt-0.5 shrink-0 text-inkmuted" />
            <div className="min-w-0">
              <p className="text-base font-bold text-inkstrong md:text-lg">
                시작하기 전에 정리되어야 하는 것
              </p>
              <p className="mt-1.5 text-base leading-relaxed text-inkbody">{s.prerequisite}</p>
            </div>
          </section>

          {s.stage === "이용 가능" ? (
            <Link
              href="/customer/equipment"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-pine-700 px-5 text-base font-bold text-white transition-colors duration-fast hover:bg-pine-600"
            >
              내 장비에서 바로 요청하기
              <ArrowRight size={16} />
            </Link>
          ) : (
            <div className="rounded-2xl border-2 border-clay-500 bg-white p-4">
              <p className="text-base font-bold text-inkstrong">이 서비스가 필요하신가요?</p>
              <p className="mt-1.5 text-base leading-relaxed text-inkbody">
                관심을 남겨 주시면 무엇을 먼저 만들지 정할 때 반영합니다. 아직 동작하는 기능이
                아니므로 신청이 아니라 의사 표시입니다.
              </p>
              <button
                type="button"
                onClick={onToggle}
                className={cn(
                  "mt-3.5 inline-flex h-12 items-center gap-2 rounded-xl px-5 text-base font-bold transition-colors duration-fast",
                  interested
                    ? "bg-clay-500 text-white hover:bg-clay-600"
                    : "border-2 border-clay-500 bg-white text-clay-600 hover:bg-clay-100/60",
                )}
              >
                {interested ? (
                  <>
                    <BellRing size={17} />
                    관심 표시함 — 준비되면 알려드립니다
                  </>
                ) : (
                  <>
                    <Bell size={17} />
                    준비되면 알려주세요
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
