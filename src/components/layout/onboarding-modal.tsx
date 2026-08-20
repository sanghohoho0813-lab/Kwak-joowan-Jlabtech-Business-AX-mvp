"use client";

/**
 * 최초 1회 온보딩 투어 — localStorage 로 노출 여부 기억.
 * 설정 페이지의 "튜토리얼 다시 보기"에서 초기화할 수 있다.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes, Sparkles, RefreshCcw, ShieldCheck, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ONBOARDING_KEY } from "@/lib/settings-context";

const steps = [
  {
    icon: Boxes,
    title: "재고·수요 관리",
    body: "현재 재고와 30일 예측 수요를 한 화면에서 확인하고, 부족·과잉 신호를 미리 잡아냅니다.",
  },
  {
    icon: Sparkles,
    title: "AI 추천·견적",
    body: "고객 상황을 입력하면 적합한 계측 장비와 소모품, 예상 견적 흐름을 바로 제안합니다.",
  },
  {
    icon: RefreshCcw,
    title: "재구매 예측",
    body: "기존 고객의 구매 주기를 분석해, 이번 주에 연락해야 할 고객을 알려드립니다.",
  },
  {
    icon: ShieldCheck,
    title: "수익·성과 관리",
    body: "마진 가드, 설치장비 관리, 산업계측 설계, 리포트 센터까지 왼쪽 메뉴에서 이어집니다.",
  },
];

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARDING_KEY)) setOpen(true);
    } catch {}
  }, []);

  const close = () => {
    try {
      localStorage.setItem(ONBOARDING_KEY, "1");
    } catch {}
    setOpen(false);
  };

  const isLast = step === steps.length - 1;
  const current = steps[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-pine-950/55 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-ivory-50 shadow-card-hover"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* 헤더 */}
            <div className="relative bg-pine-900 px-6 pb-5 pt-6 text-white">
              <button
                type="button"
                onClick={close}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="온보딩 닫기"
              >
                <X size={14} />
              </button>
              <p className="text-2xs font-semibold tracking-[0.14em] text-sand-400">
                JLAB TECH AX
              </p>
              <h2 className="mt-1 text-lg font-bold">처음 오셨네요, 환영합니다</h2>
              <p className="mt-1 text-xs text-white/60">
                핵심 기능 몇 가지만 알면 바로 쓸 수 있습니다.
              </p>
            </div>

            {/* 스텝 본문 */}
            <div className="px-6 py-5">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex min-h-[7rem] gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-pine-900">
                    {step + 1}. {current.title}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-inkmuted">
                    {current.body}
                  </p>
                </div>
              </motion.div>

              {/* 인디케이터 */}
              <div className="mt-2 flex justify-center gap-1.5">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === step ? "w-5 bg-pine-700" : "w-1.5 bg-line"
                    }`}
                  />
                ))}
              </div>

              {/* 액션 */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <Link
                  href="/tutorial"
                  onClick={close}
                  className="whitespace-nowrap text-xs font-medium text-inkmuted underline-offset-4 hover:text-pine-700 hover:underline"
                >
                  튜토리얼 전체 보기
                </Link>
                <Button
                  size="sm"
                  onClick={() => (isLast ? close() : setStep((s) => s + 1))}
                >
                  {isLast ? "시작하기" : "다음"}
                  <ArrowRight size={13} />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
