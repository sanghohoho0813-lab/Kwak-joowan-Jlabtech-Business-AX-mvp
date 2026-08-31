"use client";

/**
 * 대표 시연 모드
 *
 * 사용법 설명이 아니라, 3~5분 안에 "왜 필요한가 → 무엇이 바뀌는가 →
 * 고객 사업까지 어떻게 확장되는가"를 보여주기 위한 화면.
 * 자동 진행하지 않고 사용자가 이전/다음으로 넘긴다.
 */

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  LayoutDashboard,
  Boxes,
  Sparkles,
  RefreshCcw,
  Users,
  Repeat,
  DraftingCompass,
  BarChart3,
  Rocket,
  ArrowRight,
  ArrowLeft,
  X,
  ExternalLink,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store-context";
import { cn } from "@/lib/utils";

interface Slide {
  no: string;
  icon: LucideIcon;
  title: string;
  lead: string;
  points: string[];
  /** 이 단계에서 함께 열어 보여줄 실제 화면 */
  route?: { href: string; label: string };
  /** 강조 색 (딥그린 배경 위) */
  tone?: "default" | "gold";
}

const slides: Slide[] = [
  {
    no: "01",
    icon: Compass,
    title: "왜 이 시스템을 만들었는가",
    lead: "제이랩테크는 계측기를 납품하면 거래가 끝나는 구조였습니다.",
    points: [
      "재고와 발주 판단은 담당자의 경험과 엑셀에 의존했습니다.",
      "견적 품질은 담당자에 따라 달랐고, 소모품 동반 제안은 자주 빠졌습니다.",
      "고객이 언제 다시 살지는 고객이 먼저 연락해야 알 수 있었습니다.",
      "장비를 팔고 끝나는 구조에서는 한 번의 매출이 전부입니다.",
    ],
  },
  {
    no: "02",
    icon: LayoutDashboard,
    title: "아침에 여는 한 화면",
    lead: "오늘 판단해야 할 일이 맨 위에 정리되어 있습니다.",
    points: [
      "신규 고객 요청 · 발주 필요 품목 · 재구매 대상 고객 · 교정 예정 장비 · 마진 위험 품목",
      "총 재고 가치 2억 2,530만원이 어느 품목에 묶여 있는지 바로 보입니다.",
      "역할(대표 / 영업 / 재고)에 따라 먼저 보이는 항목이 달라집니다.",
    ],
    route: { href: "/", label: "대시보드 열기" },
  },
  {
    no: "03",
    icon: Boxes,
    title: "재고가 부족해지기 전에 신호가 뜹니다",
    lead: "예측 수요가 발주점을 넘으면 그 품목에 발주 버튼이 나타납니다.",
    points: [
      "온도 센서는 6개월 연속 출고가 늘어 발주점 아래로 내려갈 전망입니다.",
      "버튼을 누르면 권장 수량으로 발주가 등록되고, 그 기록이 남습니다.",
      "과잉 재고에 묶인 자금도 함께 보여 줍니다.",
    ],
    route: { href: "/inventory", label: "재고·수요 관리 열기" },
  },
  {
    no: "04",
    icon: Sparkles,
    title: "견적이 담당자에 따라 흔들리지 않습니다",
    lead: "고객 조건 네 가지만 고르면 추천 장비와 견적 초안이 나옵니다.",
    points: [
      "업종 · 측정 목적 · 설치 환경 · 예산을 선택합니다.",
      "함께 팔면 좋은 소모품이 자동으로 따라붙습니다.",
      "추천 사유가 함께 나와 고객 설명 자료로도 씁니다.",
      "현재는 규칙 기반 Preview이며, 실제 상품 DB와 API를 붙이면 그대로 대체됩니다.",
    ],
    route: { href: "/recommend", label: "AI 추천·견적 열기" },
  },
  {
    no: "05",
    icon: RefreshCcw,
    title: "고객이 연락하기 전에 우리가 먼저",
    lead: "구매 주기와 교정 주기로 다음 접촉 시점을 계산합니다.",
    points: [
      "이번 주 연락할 고객사가 우선순위와 함께 표시됩니다.",
      "무엇을 제안할지(소모품·교정·업그레이드)까지 같이 나옵니다.",
      "연락한 뒤 기록을 남기면 그것도 성과 근거가 됩니다.",
    ],
    route: { href: "/repurchase", label: "재구매 예측 열기" },
  },
  {
    no: "06",
    icon: Users,
    title: "여기서부터 사업 모델이 달라집니다",
    lead: "고객이 직접 쓰는 플랫폼을 열었습니다.",
    points: [
      "고객사가 자기 장비의 교정 시점과 보증 상태를 직접 봅니다.",
      "교정·소모품·추가 계측을 화면에서 바로 요청합니다.",
      "장비를 파는 회사에서, 고객의 장비 운영을 함께 관리하는 회사로 넓어집니다.",
    ],
    route: { href: "/customer", label: "고객 플랫폼 열기" },
    tone: "gold",
  },
  {
    no: "07",
    icon: Repeat,
    title: "요청이 들어오고, 처리 결과가 돌아갑니다",
    lead: "고객 플랫폼과 내부 시스템이 한 줄로 연결됩니다.",
    points: [
      "고객 요청 → Business AX 접수 → 담당자가 검토·제안·처리 → 고객 화면에 즉시 반영",
      "그 요청은 재고·견적·설치장비 업무로 이어집니다.",
      "쌓인 요청 데이터는 다시 재구매 예측과 재고 수요로 돌아옵니다.",
    ],
    route: { href: "/requests", label: "고객 요청 열기" },
    tone: "gold",
  },
  {
    no: "08",
    icon: DraftingCompass,
    title: "제품이 아니라 문제를 설계합니다",
    lead: "현장 조건을 넣으면 계측 구성과 구축 비용이 나옵니다.",
    points: [
      "측정 대상과 포인트 수를 입력하면 4계층 구성과 장비 목록이 산출됩니다.",
      "그대로 견적으로 저장되어 영업 자료가 됩니다.",
      "'이 장비 파세요'가 아니라 '이렇게 측정하세요'로 대화가 바뀝니다.",
    ],
    route: { href: "/design", label: "산업계측 설계 열기" },
  },
  {
    no: "09",
    icon: BarChart3,
    title: "한 일이 기록으로 남습니다",
    lead: "발주·견적·접촉·요청 처리가 실제 기록으로 축적됩니다.",
    points: [
      "화면의 재고 숫자는 시연용이지만, 이 기록은 실제입니다.",
      "각 수치를 누르면 그것을 만든 개별 기록을 그대로 볼 수 있습니다.",
      "정책자금·보증·R&D 심사에서 설명할 자료가 여기서 나옵니다.",
    ],
    route: { href: "/evidence", label: "AX 실증성과 열기" },
  },
  {
    no: "10",
    icon: Rocket,
    title: "앞으로 어디까지",
    lead: "세 단계로 나눠 검증하면서 넓혀갑니다.",
    points: [
      "1단계 효율화형 — 재고·견적·재구매·마진·교정 (현재 운영 중)",
      "2단계 사업모델 전환형 — 고객 플랫폼 기반 유지관리·정기 납품 (시작 단계)",
      "3단계 산업전환형 — 원격 계측·데이터 리포트·예지보전 (중장기 검토)",
      "실제 데이터를 연결하고 써 보면서 다음 단계를 판단합니다.",
    ],
    route: { href: "/intent", label: "기획의도 열기" },
  },
];

export default function PresentationPage() {
  const [index, setIndex] = useState(0);
  const { requests, orders, quotes } = useStore();

  const s = slides[index];
  const Icon = s.icon;
  const isLast = index === slides.length - 1;

  return (
    <div className="flex min-h-dvh flex-col bg-pine-900 text-white">
      {/* 상단 바 */}
      <header className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-3.5 md:px-8">
        <div className="min-w-0">
          <p className="text-2xs font-semibold tracking-[0.16em] text-sand-400">
            JLAB TECH · 대표 시연
          </p>
          <p className="clamp-1 text-sm font-bold text-white">
            계측기를 납품하는 회사에서, 고객의 장비 운영을 함께 관리하는 회사로
          </p>
        </div>
        <Link
          href="/"
          className="ml-auto flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 text-xs font-semibold text-white transition-colors duration-fast hover:bg-white/16"
        >
          <X size={14} />
          <span className="hidden sm:inline">시연 종료</span>
        </Link>
      </header>

      {/* 진행 표시 */}
      <div className="shrink-0 px-4 pt-4 md:px-8">
        <div className="flex items-baseline justify-between gap-3">
          <p className="num text-xs font-bold text-sand-400">
            {index + 1}
            <span className="text-white/40"> / {slides.length}</span>
          </p>
          <div className="flex shrink-0 items-center gap-1.5 text-2xs text-white/40">
            <span>기록된 Action</span>
            <span className="num font-bold text-white/70">
              {orders.length + quotes.length + requests.length}건
            </span>
          </div>
        </div>
        <div className="mt-2 flex gap-1">
          {slides.map((sl, i) => (
            <button
              key={sl.no}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}단계 ${sl.title}`}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-base",
                i === index ? "bg-sand-500" : i < index ? "bg-pine-500" : "bg-white/15",
              )}
            />
          ))}
        </div>
      </div>

      {/* 본문 */}
      <div className="flex flex-1 items-start px-4 py-6 md:items-center md:px-8 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-3xl"
          >
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl md:h-16 md:w-16",
                  s.tone === "gold"
                    ? "bg-sand-500/20 text-sand-400"
                    : "bg-white/10 text-white",
                )}
              >
                <Icon size={28} strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="num text-xs font-bold tracking-[0.18em] text-sand-400">
                  STEP {s.no}
                </p>
                <h1 className="text-xl font-bold leading-tight text-white md:text-3xl">
                  {s.title}
                </h1>
              </div>
            </div>

            <p className="mt-5 text-base leading-relaxed text-white/80 md:text-xl">
              {s.lead}
            </p>

            <ul className="mt-5 space-y-2.5">
              {s.points.map((p, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 text-sm leading-relaxed text-white/75 md:text-base"
                >
                  <Check size={17} className="mt-0.5 shrink-0 text-sand-400" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            {s.route ? (
              <Link href={s.route.href} target="_blank" className="mt-5 inline-block">
                <Button variant="gold" size="lg">
                  <ExternalLink size={16} />
                  {s.route.label}
                </Button>
              </Link>
            ) : null}

            {s.tone === "gold" ? (
              <div className="mt-4">
                <Badge tone="gold">사업 모델이 바뀌는 지점</Badge>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 하단 이동 */}
      <footer className="sticky bottom-0 shrink-0 border-t border-white/10 bg-pine-900/95 px-4 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Button
            size="lg"
            disabled={index === 0}
            className="border border-white/20 bg-white/10 text-white hover:bg-white/16 disabled:opacity-40"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            <ArrowLeft size={16} />
            이전
          </Button>

          <p className="clamp-1 hidden min-w-0 flex-1 px-3 text-center text-2xs text-white/40 sm:block">
            {isLast ? "마지막 단계입니다" : slides[index + 1].title}
          </p>

          {isLast ? (
            <Link href="/">
              <Button variant="gold" size="lg">
                시연 마치기
                <Check size={16} />
              </Button>
            </Link>
          ) : (
            <Button variant="gold" size="lg" onClick={() => setIndex((i) => i + 1)}>
              다음
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
