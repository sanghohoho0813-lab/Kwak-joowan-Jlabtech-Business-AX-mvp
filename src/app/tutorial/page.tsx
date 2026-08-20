"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Boxes,
  Sparkles,
  RefreshCcw,
  Compass,
  Settings,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";
import { ONBOARDING_KEY } from "@/lib/settings-context";

const steps = [
  {
    icon: LayoutDashboard,
    step: "STEP 1",
    title: "대시보드에서 시작하세요",
    href: "/",
    body: "매일 아침 이 화면 하나면 됩니다. 총 재고 가치, 30일 예측 수요, 매출 기회, 재구매 알림을 한눈에 확인할 수 있습니다.",
    tip: "숫자 카드 아래 작은 그래프는 최근 흐름을 보여줍니다.",
  },
  {
    icon: Boxes,
    step: "STEP 2",
    title: "재고·수요 관리",
    href: "/inventory",
    body: "품목별 재고와 예측 수요를 비교해 줍니다. '발주 필요' 배지가 붙은 품목은 곧 재고가 부족해진다는 신호입니다.",
    tip: "카테고리·상태 필터와 검색으로 원하는 품목만 골라 볼 수 있습니다.",
  },
  {
    icon: Sparkles,
    step: "STEP 3",
    title: "AI 추천·견적",
    href: "/recommend",
    body: "고객의 업종, 측정 목적, 설치 환경, 예산 4가지만 고르면 적합한 장비와 함께 팔면 좋은 소모품, 예상 견적 흐름까지 제안합니다.",
    tip: "추천 사유가 함께 표시되므로 고객 설명 자료로도 쓸 수 있습니다.",
  },
  {
    icon: RefreshCcw,
    step: "STEP 4",
    title: "재구매 예측",
    href: "/repurchase",
    body: "기존 고객의 구매 주기를 분석해 '언제, 누구에게, 무엇을' 제안할지 알려줍니다. 즉시 연락 고객부터 확인하세요.",
    tip: "고객이 연락하기 전에 먼저 제안하는 것이 이 기능의 핵심입니다.",
  },
  {
    icon: Compass,
    step: "STEP 5",
    title: "기획의도 읽어보기",
    href: "/intent",
    body: "이 시스템을 왜 만들었는지, 앞으로 어디까지 확장되는지 정리되어 있습니다. 처음 한 번은 꼭 읽어보시길 권합니다.",
    tip: "정책자금·사업고도화와의 연결도 이 페이지에 있습니다.",
  },
  {
    icon: Settings,
    step: "STEP 6",
    title: "내게 맞게 설정하기",
    href: "/settings",
    body: "글자가 작게 느껴지면 설정에서 글자 크기를 '크게'로 바꿔 보세요. 새로고침해도 설정이 유지됩니다.",
    tip: "튜토리얼을 다시 보고 싶을 때도 설정에서 초기화할 수 있습니다.",
  },
];

export default function TutorialPage() {
  const replayOnboarding = () => {
    try {
      localStorage.removeItem(ONBOARDING_KEY);
    } catch {}
    window.location.href = "/";
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="튜토리얼"
        description="처음 오셨다면 이 순서대로 한 바퀴만 돌아보세요. 5분이면 전체 흐름을 이해할 수 있습니다."
      />

      <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <StaggerItem key={item.step}>
              <Link href={item.href} className="block h-full">
                <Card className="group h-full transition-all hover:-translate-y-0.5 hover:border-pine-100 hover:shadow-card-hover">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700 transition-colors group-hover:bg-pine-700 group-hover:text-white">
                          <Icon size={18} strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0">
                          <p className="num text-2xs font-bold tracking-wider text-sand-600">
                            {item.step}
                          </p>
                          <h3 className="clamp-1 text-sm font-bold text-pine-900">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <ArrowRight
                        size={15}
                        className="shrink-0 text-inkmuted transition-transform group-hover:translate-x-1 group-hover:text-pine-700"
                      />
                    </div>
                    <p className="mt-3 flex-1 text-xs leading-relaxed text-inkbody">
                      {item.body}
                    </p>
                    <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-ivory-100 p-2.5 text-2xs leading-relaxed text-inkmuted">
                      <Lightbulb size={13} className="mt-px shrink-0 text-sand-500" />
                      <span className="clamp-2">{item.tip}</span>
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal delay={0.1}>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="min-w-0">
              <p className="text-sm font-bold text-pine-900">
                처음 봤던 환영 안내를 다시 보고 싶으신가요?
              </p>
              <p className="mt-1 text-xs text-inkmuted">
                온보딩 안내를 초기화하면 대시보드에서 다시 보여드립니다.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={replayOnboarding}>
              온보딩 다시 보기
            </Button>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
