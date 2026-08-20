"use client";

/**
 * 사용 방법 — 스텝형 튜토리얼
 *
 * 카드를 하나씩 눌러 보는 방식이 아니라, [다음] 버튼으로 순서대로 흘러가는
 * 가이드 투어. 마지막 스텝에서 확장 모듈을 소개하고 대시보드로 보낸다.
 */

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Boxes,
  Sparkles,
  RefreshCcw,
  Compass,
  Settings,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  ShieldCheck,
  Wrench,
  DraftingCompass,
  FileBarChart,
  Landmark,
  Check,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { ONBOARDING_KEY } from "@/lib/settings-context";
import { cn } from "@/lib/utils";

interface Step {
  icon: LucideIcon;
  label: string;
  title: string;
  href: string;
  body: string;
  tip: string;
}

const steps: Step[] = [
  {
    icon: LayoutDashboard,
    label: "대시보드",
    title: "대시보드에서 시작하세요",
    href: "/",
    body: "매일 아침 이 화면 하나면 됩니다. 맨 위 '오늘의 실행 과제'가 오늘 발주할 품목, 연락할 고객, 교정 갈 현장, 마진이 위험한 품목을 한 줄로 정리해 줍니다.",
    tip: "숫자 카드 아래 작은 그래프는 최근 흐름을 보여줍니다.",
  },
  {
    icon: Boxes,
    label: "재고·수요",
    title: "재고·수요 관리",
    href: "/inventory",
    body: "품목별 재고와 30일 예측 수요를 비교해 줍니다. '발주' 버튼이 보이는 품목은 곧 재고가 부족해진다는 신호이고, 버튼을 누르면 권장 수량으로 발주가 등록됩니다.",
    tip: "등록한 발주는 대기 → 확정 → 입고 순서로 상태를 넘길 수 있습니다.",
  },
  {
    icon: Sparkles,
    label: "AI 추천",
    title: "AI 추천·견적",
    href: "/recommend",
    body: "고객의 업종, 측정 목적, 설치 환경, 예산 4가지만 고르면 적합한 장비와 함께 팔면 좋은 소모품, 예상 견적 흐름까지 제안합니다.",
    tip: "추천 사유가 함께 표시되므로 고객 설명 자료로도 쓸 수 있습니다.",
  },
  {
    icon: RefreshCcw,
    label: "재구매",
    title: "재구매 예측",
    href: "/repurchase",
    body: "기존 고객의 구매 주기를 분석해 '언제, 누구에게, 무엇을' 제안할지 알려줍니다. 즉시 연락 고객부터 확인하고, 연락한 뒤에는 기록을 남겨 두세요.",
    tip: "고객이 연락하기 전에 우리가 먼저 제안하는 것이 이 기능의 핵심입니다.",
  },
  {
    icon: ShieldCheck,
    label: "마진 가드",
    title: "마진 가드로 수익을 지키세요",
    href: "/margin",
    body: "할인을 얼마까지 줘도 되는지 알려줍니다. 견적을 내기 전에 시뮬레이터에서 할인율을 움직여 보면 마진율이 하한선을 넘는지 바로 확인할 수 있습니다.",
    tip: "매출이 늘어도 마진이 새면 남는 것이 없습니다. 견적 전 1분이면 됩니다.",
  },
  {
    icon: Wrench,
    label: "설치장비",
    title: "설치장비 관리",
    href: "/installed",
    body: "고객 현장에 설치된 장비의 교정 시기와 보증 상태를 봅니다. 30일 내 교정 대상이 자동으로 뜨고, 방문 예약을 눌러 일정을 기록할 수 있습니다.",
    tip: "교정 방문 시 소모품을 함께 제안하면 방문 1회로 두 가지 매출이 생깁니다.",
  },
  {
    icon: Compass,
    label: "기획의도",
    title: "기획의도를 꼭 읽어보세요",
    href: "/intent",
    body: "이 시스템을 왜 만들었는지, 회사가 어디로 갈 수 있는지, 정책자금·정부지원사업과 어떻게 연결되는지가 정리되어 있습니다. 5분이면 읽습니다.",
    tip: "화면 오른쪽 위 '기획의도' 버튼으로 언제든 다시 열 수 있습니다.",
  },
  {
    icon: Settings,
    label: "설정",
    title: "내게 맞게 설정하기",
    href: "/settings",
    body: "글자가 작게 느껴지면 설정에서 글자 크기를 '크게'로 바꿔 보세요. 새로고침해도 유지됩니다. 저장된 발주·견적·활동 기록도 여기서 확인하고 초기화할 수 있습니다.",
    tip: "이 안내를 다시 보고 싶을 때도 설정에서 초기화할 수 있습니다.",
  },
];

/** 마지막 스텝에서 함께 소개하는 나머지 확장 모듈 */
const remainingModules = [
  {
    icon: DraftingCompass,
    title: "산업계측 설계",
    href: "/design",
    body: "현장 조건만 넣으면 필요한 장비 목록과 구축 비용을 설계해 줍니다. 그대로 견적으로 저장됩니다.",
  },
  {
    icon: FileBarChart,
    title: "리포트 센터",
    href: "/reports",
    body: "월간 운영·재고 회전·마진 분석 리포트를 자동으로 만듭니다. 인쇄해서 그대로 보고에 쓸 수 있습니다.",
  },
  {
    icon: Landmark,
    title: "정책자금 성과 분석",
    href: "/policy",
    body: "도입 전후로 무엇이 달라졌는지, 어떤 지원사업에 맞는지 정리해 둔 곳입니다.",
  },
];

export default function TutorialPage() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const step = steps[index];
  const Icon = step.icon;
  const isLast = index === steps.length - 1;
  const progress = ((index + 1) / steps.length) * 100;

  const replayOnboarding = () => {
    try {
      localStorage.removeItem(ONBOARDING_KEY);
    } catch {}
    window.location.href = "/";
  };

  /* ---------------- 완료 화면 ---------------- */
  if (done) {
    return (
      <div className="space-y-5">
        <Reveal>
          <Card className="overflow-hidden border-0 bg-pine-900 text-white">
            <CardContent className="relative p-7 text-center md:p-10">
              <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sand-500/20 text-sand-400">
                <Check size={32} strokeWidth={2.2} />
              </span>
              <h1 className="text-2xl font-bold md:text-3xl">
                안내를 모두 보셨습니다
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-lg leading-relaxed text-white/70">
                이제 대시보드를 열면 오늘 할 일이 정리되어 있습니다. 헤매실 일이 생기면
                오른쪽 위 &lsquo;사용 방법&rsquo; 버튼으로 언제든 돌아오세요.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link href="/">
                  <Button variant="gold" size="lg">
                    대시보드로 이동
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  className="border border-white/20 bg-white/10 text-white hover:bg-white/16"
                  onClick={() => {
                    setDone(false);
                    setIndex(0);
                  }}
                >
                  <RotateCcw size={15} />
                  처음부터 다시 보기
                </Button>
              </div>
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sand-500/10 blur-3xl" />
            </CardContent>
          </Card>
        </Reveal>

        {/* 나머지 확장 모듈 */}
        <Reveal delay={0.08}>
          <Card>
            <CardContent className="p-6">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-pine-900">
                  더 깊이 쓰고 싶다면 — 확장 모듈
                </h2>
                <Badge tone="gold">2단계 고도화</Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {remainingModules.map((m) => {
                  const MIcon = m.icon;
                  return (
                    <Link
                      key={m.title}
                      href={m.href}
                      className="group flex flex-col gap-3 rounded-xl border border-line bg-ivory-100/60 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-pine-100 hover:bg-pine-50/50 hover:shadow-card"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex min-w-0 items-center gap-3 text-xl font-bold text-pine-900">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700 transition-colors group-hover:bg-pine-700 group-hover:text-white">
                            <MIcon size={21} strokeWidth={1.9} />
                          </span>
                          <span className="clamp-1">{m.title}</span>
                        </span>
                        <ArrowRight
                          size={20}
                          className="shrink-0 text-inkmuted transition-transform group-hover:translate-x-0.5 group-hover:text-pine-700"
                        />
                      </div>
                      <p className="text-lg leading-relaxed text-inkbody">{m.body}</p>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.12}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="min-w-0">
                <p className="text-xl font-bold text-pine-900">
                  처음 봤던 환영 안내를 다시 보고 싶으신가요?
                </p>
                <p className="mt-1.5 text-lg text-inkmuted">
                  온보딩 안내를 초기화하면 대시보드에서 다시 보여드립니다.
                </p>
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="shrink-0"
                onClick={replayOnboarding}
              >
                온보딩 다시 보기
              </Button>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    );
  }

  /* ---------------- 스텝 진행 화면 ---------------- */
  return (
    <div className="space-y-5">
      <Reveal className="mb-1">
        <h1 className="text-3xl font-bold tracking-tight text-pine-900 md:text-4xl">
          사용 방법
        </h1>
        <p className="mt-2.5 max-w-3xl text-lg leading-relaxed text-inkmuted">
          아래 [다음]을 누르면 순서대로 안내해 드립니다. 8단계, 5분이면 끝납니다.
        </p>
      </Reveal>

      {/* 진행 표시 */}
      <Reveal delay={0.04}>
        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="num text-base font-bold text-pine-800">
              {index + 1}
              <span className="text-inkmuted"> / {steps.length}</span>
              <span className="ml-2 text-base font-semibold text-inkmuted">
                {step.label}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setDone(true)}
              className="shrink-0 whitespace-nowrap text-base font-medium text-inkmuted underline-offset-4 transition-colors hover:text-pine-700 hover:underline"
            >
              건너뛰기
            </button>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-ivory-400/60">
            <motion.div
              className="h-full rounded-full bg-pine-700"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* 스텝 점 — 클릭으로 이동도 가능 */}
          <div className="flex flex-wrap gap-1.5">
            {steps.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}단계 ${s.label}`}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  i === index
                    ? "bg-sand-500"
                    : i < index
                      ? "bg-pine-600/50"
                      : "bg-line hover:bg-sage-500/60",
                )}
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* 본문 카드 — 전환 시 x축 슬라이드가 화면 밖으로 나가지 않도록 가로만 클립 */}
      <div className="min-h-[24rem] overflow-x-clip">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pine-50 text-pine-700 md:h-16 md:w-16">
                    <Icon size={28} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="num text-base font-bold tracking-wider text-sand-600">
                      STEP {index + 1}
                    </p>
                    <h2 className="text-2xl font-bold leading-tight text-pine-900 md:text-[2rem]">
                      {step.title}
                    </h2>
                  </div>
                </div>

                <p className="mt-6 text-2xl leading-relaxed text-inkbody">{step.body}</p>

                <p className="mt-5 flex items-start gap-3 rounded-xl bg-ivory-100 p-4 text-lg leading-relaxed text-inkmuted md:p-5">
                  <Lightbulb size={24} className="mt-1 shrink-0 text-sand-500" />
                  <span>{step.tip}</span>
                </p>

                <Link
                  href={step.href}
                  className="mt-5 inline-flex items-center gap-2 text-lg font-semibold text-pine-700 underline-offset-4 transition-colors hover:text-pine-600 hover:underline"
                >
                  이 화면 직접 열어보기
                  <ArrowRight size={18} />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 이동 버튼 */}
      <Reveal delay={0.06}>
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="lg"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            <ArrowLeft size={16} />
            이전
          </Button>

          <Button
            size="lg"
            onClick={() => (isLast ? setDone(true) : setIndex((i) => i + 1))}
          >
            {isLast ? "안내 마치기" : "다음"}
            {isLast ? <Check size={16} /> : <ArrowRight size={16} />}
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
