"use client";

/**
 * 「이 시스템을 만든 이유」
 *
 * 기능 소개 페이지가 아니다.
 * 배경 → 개념 → 정책 흐름 → 우리 상황 → 설계 → 업무 변화 → 사업 성장 →
 * 얻는 것 → 기록의 주인 → 정책자금 → 앞으로 의 순서로,
 * 대표자와 직원이 5분 안에 "왜 지금 이걸 해야 하는지"를 이해하도록 만든다.
 */

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Cpu,
  Clock,
  Factory,
  LayoutGrid,
  Workflow,
  TrendingUp,
  Award,
  ShieldCheck,
  Landmark,
  Rocket,
  ArrowRight,
  ChevronDown,
  Check,
  X,
  Layers,
  Users,
  Workflow as WorkflowIcon,
  TrendingUp as GrowthIcon,
  BookMarked,
  Building2,
  Ruler,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import { ClosedLoopDiagram } from "@/components/intent/closed-loop";
import { PhotoPlaceholder } from "@/components/intent/photo-placeholder";

/* ------------------------------------------------------------------ *
 * 섹션 공통 래퍼
 * ------------------------------------------------------------------ */

function Section({
  no,
  icon: Icon,
  title,
  children,
  tone = "default",
}: {
  no: string;
  icon: typeof BookOpen;
  title: string;
  children: React.ReactNode;
  tone?: "default" | "accent";
}) {
  return (
    <Card
      className={cn(
        "transition-all hover:-translate-y-0.5 hover:shadow-card-hover",
        tone === "accent" && "border-sand-400/40 bg-sand-100/30",
      )}
    >
      <CardContent className="p-6 md:p-7">
        <div className="mb-4 flex items-center gap-3.5">
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              tone === "accent"
                ? "bg-sand-500/20 text-sand-600"
                : "bg-pine-50 text-pine-700",
            )}
          >
            <Icon size={22} strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="num text-[0.75em] font-bold tracking-[0.14em] text-sand-600">{no}</p>
            <h2 className="clamp-2 text-[1.25em] font-bold leading-tight text-pine-900 md:text-[1.5em]">
              {title}
            </h2>
          </div>
        </div>
        <div className="space-y-3.5">{children}</div>
      </CardContent>
    </Card>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[1.05em] leading-relaxed text-inkbody">{children}</p>;
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border-l-[3px] border-pine-600 bg-pine-50/60 py-3 pl-4 pr-4 text-[1.05em] font-semibold leading-relaxed text-pine-900 md:text-[1.18em]">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ *
 * Before → After 비교 블록
 * ------------------------------------------------------------------ */

function BeforeAfter({
  before,
  after,
  beforeTitle = "지금까지",
  afterTitle = "바뀌는 방향",
}: {
  before: string[];
  after: string[];
  beforeTitle?: string;
  afterTitle?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-line bg-ivory-100/70 p-4">
        <p className="mb-2.5 flex items-center gap-1.5 text-[0.875em] font-bold text-inkmuted">
          <X size={15} className="shrink-0" />
          {beforeTitle}
        </p>
        <ul className="space-y-1.5">
          {before.map((b) => (
            <li key={b} className="flex items-start gap-2 text-[0.92em] leading-relaxed text-inkbody">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-inkmuted/50" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-pine-100 bg-pine-50/70 p-4">
        <p className="mb-2.5 flex items-center gap-1.5 text-[0.875em] font-bold text-pine-700">
          <Check size={15} className="shrink-0" />
          {afterTitle}
        </p>
        <ul className="space-y-1.5">
          {after.map((a) => (
            <li key={a} className="flex items-start gap-2 text-[0.92em] leading-relaxed text-pine-900">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-pine-600" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 흐름 다이어그램 (한 줄 파이프라인)
 * ------------------------------------------------------------------ */

function Flow({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 rounded-xl bg-ivory-100/70 p-4">
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-1.5">
          <span className="whitespace-nowrap rounded-lg border border-line bg-ivory-50 px-2.5 py-1.5 text-[0.7875em] font-semibold text-pine-900">
            {s}
          </span>
          {i < steps.length - 1 ? (
            <ArrowRight size={13} className="shrink-0 text-sand-500" />
          ) : null}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 2026 정책 흐름 — 접어두기
 * ------------------------------------------------------------------ */

interface PolicyBlock {
  /** 목록에 노출되는 짧은 이름 */
  short: string;
  agency: string;
  title: string;
  body: string[];
  bullets?: string[];
  bulletsLabel?: string;
  flow?: string[];
  /** 실제로 어떤 기업·과제가 선정·지원받는지 */
  cases?: { label: string; detail: string }[];
  casesLabel?: string;
  /** 지원 규모·조건 요약 */
  scale?: { label: string; value: string }[];
  quote?: string;
  /** 제이랩테크 적용 포인트 */
  ours?: string;
}

const policyDetail: PolicyBlock[] = [
  {
    short: "중진공",
    agency: "중소벤처기업진흥공단",
    title: "AX를 별도 정책자금 대상으로 보기 시작",
    body: [
      "2026년 중소기업 정책자금에는 AX 스프린트 우대트랙이 신설되는 흐름입니다. 핵심은 지원 대상이 단순 AI 개발회사에 한정되지 않는다는 점입니다.",
      "AI 및 AI 관련 분야를 영위하는 기업뿐 아니라, AI를 실제 업무에 도입·활용하는 기업까지 지원 대상으로 포함하는 방향이 명확해졌습니다. 즉 제조·물류·서비스·유통·헬스케어 등 기존 업종도 아래와 같은 일을 실제 업무에 적용하고 있다면 'AX 기업'이라는 정책 논리를 만들 수 있습니다.",
      "정책자금은 보조금이 아니라 융자입니다. 다만 시중은행 대비 낮은 금리와 긴 거치기간이 적용되고, 우대트랙에 해당하면 한도와 평가에서 별도 구조를 적용받습니다. 그래서 '어떤 트랙으로 신청하느냐'가 실제 조달 조건을 크게 좌우합니다.",
    ],
    bulletsLabel: "정책 논리를 만들 수 있는 활동",
    bullets: [
      "AI 기반 수요예측",
      "고객 분석",
      "재고·발주 최적화",
      "생산계획 수립",
      "경로·배차 최적화",
      "상담·영업 자동화",
      "재방문·재구매 분석",
      "품질관리",
      "반복 업무 자동화",
    ],
    casesLabel: "이런 기업들이 자금을 조달합니다",
    cases: [
      {
        label: "지방 정밀부품 제조사",
        detail:
          "설비 진동·온도 데이터를 수집해 고장을 미리 감지하는 체계를 갖춘 뒤, 스마트공장 고도화 자금과 정책자금을 함께 활용해 설비를 증설하는 형태",
      },
      {
        label: "산업 자재·장비 유통사",
        detail:
          "재고·발주·거래처 데이터를 시스템화해 재고 회전율과 거래처당 매출 개선을 수치로 제시하고, 운전자금·시설자금을 조달하는 형태",
      },
      {
        label: "환경·계측 서비스 기업",
        detail:
          "현장 측정 데이터를 축적해 유지관리 서비스를 상품화하고, 사업전환 트랙으로 자금을 신청하는 형태",
      },
    ],
    scale: [
      { label: "성격", value: "융자 (보조금 아님)" },
      { label: "일반 한도", value: "운전자금·시설자금 구분 운용" },
      { label: "우대트랙", value: "한도·금리·평가에서 별도 구조" },
    ],
    quote:
      "과거에는 'AI 기술회사를 지원한다'가 중심이었다면, 이제는 '기존 기업이 AI를 실제 사업에 활용해 일하는 방식을 바꾸는 것' 자체가 지원 대상이 되고 있습니다.",
    ours:
      "제이랩테크는 이미 재고·수요 예측, 발주 최적화, 재구매 분석을 실제 업무에 쓰고 있습니다. 위 활동 목록 중 4가지 이상에 해당하므로, 'AI 활용기업' 논리를 만들 수 있는 위치에 있습니다.",
  },
  {
    short: "기보",
    agency: "기술보증기금",
    title: "AX 수준을 별도 지수로 측정하기 시작",
    body: [
      "기술보증기금은 2026년 'AX 혁신지수'를 도입했습니다. 기업의 AX 수준을 단순히 'AI 사용 여부'로 판단하지 않고, 네 가지 관점에서 점수화합니다.",
      "기보는 기술력을 담보로 보증서를 발급하는 기관입니다. 보증서가 나오면 은행에서 신용만으로 어려웠던 대출이 가능해지고, 금리도 낮아집니다. 그래서 기술평가 등급이 곧 조달 조건입니다.",
      "여기서 중요한 것은 평가가 '무엇을 만들었는가'보다 '실제로 돌아가는가'를 본다는 점입니다. 화면만 있고 아무도 쓰지 않는 시스템은 점수를 받기 어렵습니다.",
    ],
    bulletsLabel: "AX 혁신지수의 네 가지 관점",
    bullets: ["전략 및 의지", "자원 및 조직", "기술 및 데이터", "활용 및 성과"],
    flow: [
      "왜 추진하는가",
      "누가 운영하는가",
      "어떤 데이터를 쓰는가",
      "현장에서 쓰이는가",
      "어떤 성과가 나오는가",
    ],
    casesLabel: "평가에서 실제로 제출되는 자료",
    cases: [
      {
        label: "시스템 실물",
        detail: "화면 캡처가 아니라 계정을 받아 직접 열어볼 수 있는 운영 시스템",
      },
      {
        label: "사용 로그",
        detail: "누가 언제 무엇을 처리했는지 남는 기록. 사용자가 실재한다는 증거",
      },
      {
        label: "Before & After",
        detail: "도입 전후의 업무시간·오류·재구매율·매출 비교표",
      },
      {
        label: "추진 계획",
        detail: "대표자 명의의 AX 추진 방향과 단계별 확장 로드맵",
      },
    ],
    scale: [
      { label: "성격", value: "보증 (은행 대출 연계)" },
      { label: "판단 기준", value: "기술평가 등급 + AX 혁신지수" },
      { label: "효과", value: "대출 가능성 확대 · 금리 인하" },
    ],
    quote:
      "앞으로의 심사에서는 'AI 도입 예정'보다 실제 시스템 + 실제 데이터 + 실제 사용자 + 운영로그 + Before & After를 가진 기업이 더 높은 설득력을 갖게 될 가능성이 큽니다. 기보가 벤처기업을 진단한 결과에서도 AI의 필요성을 느끼는 기업은 많지만 실제 인프라·데이터·실행 수준은 상대적으로 낮은 것으로 나타났습니다.",
    ours:
      "이 플랫폼은 네 관점 중 '기술·데이터'와 '활용·성과'에 직접 대응합니다. 발주·견적·고객 접촉이 기록으로 남고, 리포트 센터에서 성과를 뽑을 수 있기 때문입니다. 나머지 두 관점은 대표자 추진 방향과 담당자 지정으로 채웁니다.",
  },
  {
    short: "신보",
    agency: "신용보증기금",
    title: "AI를 조직·보증·스타트업 육성의 별도 분야로 강화",
    body: [
      "신용보증기금도 2026년 AI 관련 지원체계를 강화했습니다. AI 전담조직을 두고 AI·첨단산업·혁신기업을 별도로 발굴·육성하는 방향을 명확히 했으며, AI 특화 스타트업 프로그램과 보증·투자·컨설팅 연계도 확대되고 있습니다.",
      "신보는 보증뿐 아니라 직접 투자와 육성 프로그램을 함께 운영합니다. 선정되면 보증한도 우대에 더해 투자 유치, 컨설팅, 판로 연계까지 묶음으로 지원받는 경우가 있습니다.",
      "현재 공개자료상 '일반기업이 AX를 도입하면 자동으로 몇 점을 가산한다'는 식의 단순 가점표가 공개된 것은 아닙니다. 다만 심사의 핵심 항목을 설명할 때 실제 AX 시스템과 데이터 기반 운영 전환은 매우 강한 근거가 됩니다.",
    ],
    bulletsLabel: "심사에서 설명해야 하는 항목",
    bullets: ["성장성", "혁신성", "차별성", "기술성", "사업확장성", "매출 가능성"],
    casesLabel: "이런 기업이 육성 대상으로 선정됩니다",
    cases: [
      {
        label: "업종 데이터를 가진 기업",
        detail:
          "오래 거래하며 쌓은 고객·거래·현장 데이터를 구조화해 새로운 서비스를 만든 기업. 데이터 자체가 진입장벽이 됩니다.",
      },
      {
        label: "반복 구조를 가진 기업",
        detail:
          "한 거래처에서 검증한 방식을 다른 거래처로 그대로 확장할 수 있는 기업. 사업확장성 항목에서 유리합니다.",
      },
      {
        label: "수익 모델이 바뀐 기업",
        detail:
          "단발 판매에서 정기 서비스·구독·유지관리로 매출 구조를 넓힌 기업. 매출 가능성 설명이 쉬워집니다.",
      },
    ],
    scale: [
      { label: "성격", value: "보증 + 투자 + 육성 프로그램" },
      { label: "연계", value: "보증·투자·컨설팅 묶음 지원" },
      { label: "대상", value: "AI·첨단산업·혁신기업 별도 발굴" },
    ],
    ours:
      "제이랩테크의 설치장비 대장과 교정 주기 데이터는 경쟁사가 쉽게 따라 만들 수 없는 자산입니다. '차별성'과 '사업확장성'을 설명할 때 이 데이터가 근거가 됩니다.",
  },
  {
    short: "정부 지원사업",
    agency: "중기부 · 과기정통부 · 산업부",
    title: "'AI 개발'에서 '산업 AX 실증'으로 확대",
    body: [
      "2026년에는 중소벤처기업부, 과학기술정보통신부, 산업통상자원부 등을 중심으로 AI와 AX 관련 사업이 크게 확대됐습니다. 이쪽은 융자가 아니라 갚지 않아도 되는 무상지원(출연금)이라는 점에서 성격이 다릅니다.",
      "다만 경쟁률이 높고, 사업계획서만으로는 통과하기 어렵습니다. 최근 사업들은 실제 산업문제 → 실제 수요기업 → AI 솔루션 → 현장 실증 → 상용화 → 매출·생산성 구조를 요구합니다.",
      "특히 '수요기업'을 요구하는 과제가 많습니다. 솔루션을 만들 회사와 그것을 실제로 쓸 회사가 함께 신청하는 구조인데, 제이랩테크처럼 현장 고객사를 다수 보유한 기업은 이 자리에서 유리합니다.",
    ],
    bulletsLabel: "확대되고 있는 사업 방향",
    bullets: [
      "AI Agent 기술개발",
      "산업현장 AI Agent",
      "중소제조 Multi AI Agent",
      "AX Sprint",
      "AI 통합바우처",
      "산업 AI 솔루션 실증·확산",
      "제조AI 특화 스마트공장",
      "지역 AX 실증·기술개발",
      "AI·디지털 기반 서비스혁신",
      "AI 기반 창업·사업화",
      "AI·AX R&D",
    ],
    flow: [
      "실제 산업문제",
      "실제 수요기업",
      "AI 솔루션",
      "현장 실증",
      "상용화",
      "매출·생산성",
    ],
    casesLabel: "무상지원의 실제 성격",
    cases: [
      {
        label: "AI 바우처",
        detail:
          "AI 솔루션 도입 비용을 정부가 상당 부분 부담하는 방식. 공급기업과 수요기업을 매칭해 진행하며, 기업 부담금이 일부 붙습니다.",
      },
      {
        label: "실증형 과제",
        detail:
          "개발비를 출연금으로 지원하되 현장 적용과 성과 측정을 의무화합니다. 중간·최종 평가에서 실적을 제출해야 합니다.",
      },
      {
        label: "R&D 과제",
        detail:
          "기술개발 비용을 지원합니다. 최근에는 기술 자체보다 수요처와 사업화 계획이 있는 과제가 유리합니다.",
      },
    ],
    scale: [
      { label: "성격", value: "무상지원 (출연금) · 상환 의무 없음" },
      { label: "조건", value: "기업 부담금 일부 · 성과 보고 의무" },
      { label: "관건", value: "수요기업 확보 · 실증 가능 여부" },
    ],
    quote:
      "중요한 것은 사업의 중심이 'AI 모델을 개발했다'에서 끝나지 않는다는 점입니다. 최근 사업들은 점점 더 위와 같은 구조를 요구합니다.",
    ours:
      "제이랩테크는 계측 장비를 공급하는 동시에 고객 현장을 알고 있습니다. 솔루션 공급자이면서 실증 현장까지 연결할 수 있는 위치라, 실증형 과제에서 설명하기 좋은 구조입니다.",
  },
  {
    short: "선정 과제 분석",
    agency: "AX-Sprint · 실증형 과제",
    title: "선정된 과제들의 공통점",
    body: [
      "대표적인 AX 실증형 사업에서 선정된 과제들을 보면 뚜렷한 공통점이 있습니다. 화려한 기술보다 '명확한 현장 문제'를 다룬 과제가 선정됩니다.",
      "아래 유형을 보면 대부분 첨단 AI 연구가 아닙니다. 오래된 산업에서 사람이 반복하던 판단을 데이터로 옮긴 사례들입니다.",
    ],
    bulletsLabel: "선정 과제의 유형",
    bullets: [
      "농업 현장 상태를 AI가 판단해 자동화",
      "제조공정의 이상·품질을 AI가 분석",
      "물류·배차·운영계획을 데이터로 최적화",
      "현장 안전을 AI·로봇·드론으로 점검",
      "고객·사용자 행동 데이터를 분석해 서비스 개선",
      "반복 행정·상담·운영 업무를 AI Agent가 지원",
    ],
    casesLabel: "선정되는 과제의 3가지 조건",
    cases: [
      {
        label: "문제가 구체적이다",
        detail:
          "'AI로 효율화한다'가 아니라 '설비 고장으로 연간 몇 시간 라인이 멈추는데 이걸 미리 잡는다'처럼 손실이 특정됩니다.",
      },
      {
        label: "쓸 사람이 정해져 있다",
        detail:
          "개발이 끝나면 누가 어느 현장에서 쓸지가 계획서에 이름과 함께 적혀 있습니다.",
      },
      {
        label: "성과를 잴 수 있다",
        detail:
          "무엇을 어떻게 측정할지 지표가 미리 정의되어 있습니다. 측정할 수 없으면 성과 보고가 불가능하기 때문입니다.",
      },
    ],
    quote:
      "정부가 원하는 AX는 대부분 '기존 산업의 명확한 문제를 AI와 데이터로 해결한 사례'입니다. 그래서 '우리 회사는 AI 회사가 아니다'라고 생각할 필요가 없습니다. 오히려 '우리 업종에서 오래 일하며 쌓은 현장 데이터와 업무방식을 AI로 구조화해 생산성과 매출을 높였다'는 형태가 도메인 AX 관점에서 매우 좋은 스토리가 됩니다.",
    ours:
      "제이랩테크의 문제는 이미 구체적입니다. 발주 판단이 늦어 재고가 묶이고, 교정 시점을 놓쳐 매출 기회가 사라집니다. 쓸 사람도 정해져 있고, 지표도 잴 수 있습니다.",
  },
  {
    short: "창업·R&D",
    agency: "창업패키지 · 초격차 · R&D",
    title: "창업·R&D 사업에서도 AI·AX 강조",
    body: [
      "창업지원사업 역시 AI 특화 프로그램과 트랙이 확대되고 있습니다. 일반 창업패키지에서도 AI 인재·실증형 과제가 등장하고 있고, 초격차 스타트업 프로젝트에서도 AI가 핵심 전략분야로 다뤄지고 있습니다.",
      "다만 창업 계열 사업은 업력 제한(보통 7년 이내)이 있어 모든 기업이 신청할 수 있는 것은 아닙니다. 업력이 오래된 기업은 사업전환·고도화 계열이나 R&D 쪽이 현실적입니다.",
      "R&D도 마찬가지입니다. 기술 자체만 개발하는 과제보다 실제 수요기업이 있고, 현장에서 사용하고, 사업화되는 구조가 점점 중요해지고 있습니다.",
    ],
    bulletsLabel: "최근 중요해지는 키워드",
    bullets: [
      "Domain AX",
      "Vertical AI",
      "LLM 응용",
      "AI Agent",
      "스마트제조",
      "AI 기반 서비스혁신",
    ],
    casesLabel: "업력에 따른 현실적인 선택지",
    cases: [
      {
        label: "창업 7년 이내",
        detail: "창업패키지, 초격차 스타트업, 창업도약패키지 등 무상지원 중심",
      },
      {
        label: "업력 7년 이상",
        detail:
          "사업전환·고도화 지원, 정책자금 우대트랙, R&D 과제, 스마트공장 고도화 중심",
      },
      {
        label: "공통",
        detail: "AI 바우처, 지역 AX 실증, 산업 AI 솔루션 실증은 업력 제한이 덜한 편",
      },
    ],
    ours:
      "제이랩테크는 창업 계열보다 사업전환·고도화와 R&D 쪽이 현실적인 경로입니다. '계측기 유통에서 계측 데이터 기반 운영지원으로'라는 전환 서사가 여기에 맞습니다.",
  },
  {
    short: "기관이 원하는 모습",
    agency: "정책기관 공통",
    title: "실제로 보고 싶어하는 기업의 모습",
    body: [
      "현재 흐름을 종합하면, 정책금융과 정부지원사업에서 설득력이 높은 AX 기업은 대략 다음과 같은 형태입니다.",
      "이 흐름에서 중요한 것은 순서입니다. 시스템을 먼저 만들고 자금을 신청하는 것이 아니라, 실제로 쓰면서 기록이 쌓인 다음에 그 기록을 들고 가는 구조여야 합니다.",
    ],
    flow: [
      "기존 사업의 실제 문제",
      "회사 내부 데이터",
      "운영시스템 구축",
      "AI 분석·예측·추천·자동화",
      "실제 직원·고객 사용",
      "운영로그 축적",
      "Before & After 측정",
      "생산성·비용·매출 개선",
      "새로운 서비스·사업모델",
      "정책자금·보증·R&D 활용",
    ],
    casesLabel: "이 흐름에서 제이랩테크의 현재 위치",
    cases: [
      { label: "1~4단계", detail: "완료 — 문제 정의, 데이터 정리, 시스템 구축, AI 로직 적용" },
      { label: "5~6단계", detail: "진행 중 — 실제 사용과 운영로그 축적 (지금 이 화면이 그 시작)" },
      { label: "7~10단계", detail: "다음 과제 — 성과 측정과 정책 연계" },
    ],
    ours:
      "4단계까지는 시스템을 만드는 일이고, 5단계부터는 실제로 쓰면서 기록이 쌓이는 구간입니다. 정책기관에 보여줄 자료도 이 구간에서 만들어집니다.",
  },
  {
    short: "주의사항",
    agency: "심사 관점",
    title: "단순 AI 기능만으로는 부족합니다",
    body: [
      "정부 정책에서 AI가 강조된다고 해서 사업계획서에 'AI'라는 단어를 넣거나 챗봇을 하나 붙이는 것만으로 유리해지는 것은 아닙니다.",
      "실제 심사에서는 아래 질문이 나옵니다. 이 질문에 데이터로 답할 수 있느냐가 'AI 기능이 있는 회사'와 'AX가 진행된 회사'를 가릅니다.",
    ],
    bulletsLabel: "심사에서 답해야 하는 7가지 질문",
    bullets: [
      "왜 이 업무에 AI가 필요한가?",
      "어떤 데이터를 활용하는가?",
      "실제 업무가 어떻게 달라지는가?",
      "누가 실제로 사용하는가?",
      "어떤 기록이 남는가?",
      "시간·비용·오류·매출이 어떻게 달라졌는가?",
      "이 구조를 다른 고객·거래처로 확장할 수 있는가?",
    ],
    casesLabel: "떨어지는 계획서의 공통점",
    cases: [
      {
        label: "화면만 있는 경우",
        detail: "시스템은 있는데 사용 로그가 없습니다. 만들어만 두고 아무도 안 쓴 것이 드러납니다.",
      },
      {
        label: "숫자가 추정뿐인 경우",
        detail: "'30% 개선 예상'만 있고 실제 측정값이 없습니다. 근거를 묻는 질문에 막힙니다.",
      },
      {
        label: "확장 계획이 없는 경우",
        detail: "우리 회사에만 쓰고 끝나는 구조는 사업확장성 점수를 받기 어렵습니다.",
      },
    ],
    quote:
      "이 질문에 답할 수 있어야 'AI 기능이 있는 회사'가 아니라 'AX가 진행된 회사'로 보일 수 있습니다.",
    ours:
      "이 플랫폼은 7가지 질문 중 5가지에 이미 답할 수 있습니다. 나머지 둘(실제 사용자, 측정된 숫자)은 쓰기 시작해야 채워집니다.",
  },
  {
    short: "핵심 정리",
    agency: "2026 정책 흐름",
    title: "결국 한 문장으로",
    body: [
      "지금까지의 내용을 한 문장으로 줄이면 이렇습니다.",
    ],
    quote:
      "정부는 AI 기업만 지원하는 것이 아니라, 기존 중소기업이 자신의 업종 데이터와 경험에 AI를 결합해 생산성·매출·제품·서비스·사업모델을 바꾸는 AX 기업을 본격적인 정책지원 대상으로 보기 시작했습니다.",
    casesLabel: "그래서 이 시스템의 목표는",
    cases: [
      {
        label: "단순 프로그램 구축이 아니라",
        detail: "실제 사업을 변화시키고, 그 결과를 기록으로 남기는 것",
      },
      {
        label: "그 기록이",
        detail: "정책금융·정부지원·R&D·보증·투자까지 연결할 수 있는 '혁신기업의 증거'가 됩니다",
      },
    ],
    ours:
      "정책자금을 받으려고 프로그램을 만드는 것이 아닙니다. 사업을 실제로 바꾸고, 그 성과를 근거로 성장자금을 조달하는 순서입니다.",
  },
];

/* ------------------------------------------------------------------ *
 * 정책 브리핑 — 기관별로 하나씩 열어보는 체크리스트
 * (새로고침하면 확인 상태는 초기화된다)
 * ------------------------------------------------------------------ */

function PolicyBriefing() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [read, setRead] = useState<Set<number>>(new Set());

  const total = policyDetail.length;
  const readCount = read.size;
  const allRead = readCount === total;

  const openBlock = (i: number) => {
    if (active === i) {
      setActive(null);
      return;
    }
    setActive(i);
    setRead((prev) => new Set(prev).add(i));
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border-2 transition-colors duration-300",
        allRead
          ? "border-pine-600/40 bg-pine-50/50"
          : "border-sand-500/50 bg-sand-100/40",
      )}
    >
      {/* 헤더 — 필독 표시 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-sand-100/60"
        aria-expanded={open}
      >
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
            allRead ? "bg-pine-600 text-white" : "bg-sand-500 text-white",
          )}
        >
          {allRead ? <Check size={20} strokeWidth={2.4} /> : <BookMarked size={19} />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex h-[1.4em] shrink-0 items-center rounded-full px-2 text-[0.6875em] font-bold leading-none",
                allRead
                  ? "bg-pine-600 text-white"
                  : "bg-red-600 text-white",
              )}
            >
              {allRead ? "확인 완료" : "필독"}
            </span>
            <p className="text-[0.95em] font-bold text-pine-900">
              2026년 AX 정책 흐름 — 기관별 브리핑
            </p>
          </div>
          <p className="mt-1 text-[0.8em] leading-relaxed text-inkmuted">
            {allRead
              ? "9개 항목을 모두 확인하셨습니다. 언제든 다시 열어볼 수 있습니다."
              : "정책자금·정부지원사업을 검토하신다면 9개 항목을 하나씩 확인해 보세요."}
          </p>
        </div>

        {/* 진행률 */}
        <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ivory-300">
            <motion.div
              className={cn("h-full rounded-full", allRead ? "bg-pine-600" : "bg-sand-500")}
              initial={false}
              animate={{ width: `${(readCount / total) * 100}%` }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="num whitespace-nowrap text-[0.8em] font-bold text-pine-800">
            {readCount}/{total}
          </span>
        </div>

        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-inkmuted transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      {/* 본문 */}
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-2 border-t-2 border-sand-500/25 bg-ivory-50 p-3 sm:p-4">
              {/* 모바일 진행률 */}
              <div className="flex items-center gap-2.5 rounded-lg bg-ivory-100 px-3 py-2 sm:hidden">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ivory-300">
                  <motion.div
                    className={cn("h-full rounded-full", allRead ? "bg-pine-600" : "bg-sand-500")}
                    initial={false}
                    animate={{ width: `${(readCount / total) * 100}%` }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
                <span className="num shrink-0 text-[0.8em] font-bold text-pine-800">
                  {readCount}/{total} 확인
                </span>
              </div>

              {policyDetail.map((d, i) => {
                const isRead = read.has(i);
                const isOpen = active === i;
                return (
                  <div
                    key={d.short}
                    className={cn(
                      "overflow-hidden rounded-xl border transition-colors duration-200",
                      isOpen
                        ? "border-pine-600/40 bg-ivory-100/70"
                        : isRead
                          ? "border-pine-100 bg-pine-50/40"
                          : "border-line bg-ivory-100/50 hover:border-sand-400/60",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => openBlock(i)}
                      className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
                      aria-expanded={isOpen}
                    >
                      {/* 체크박스 */}
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
                          isRead
                            ? "border-pine-600 bg-pine-600 text-white"
                            : "border-sand-500/50 bg-ivory-50",
                        )}
                      >
                        {isRead ? <Check size={14} strokeWidth={3} /> : null}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span
                            className={cn(
                              "text-[0.9em] font-bold",
                              isRead ? "text-pine-900" : "text-inkbody",
                            )}
                          >
                            {d.short}
                          </span>
                          <span className="text-[0.75em] text-inkmuted">{d.agency}</span>
                        </span>
                        <span className="mt-0.5 block text-[0.8em] leading-snug text-inkmuted">
                          {d.title}
                        </span>
                      </span>

                      <ChevronDown
                        size={16}
                        className={cn(
                          "shrink-0 text-inkmuted transition-transform duration-300",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-3 border-t border-line/70 px-3.5 py-4">
                            {d.body.map((b, j) => (
                              <p
                                key={j}
                                className="text-[0.92em] leading-relaxed text-inkbody"
                              >
                                {b}
                              </p>
                            ))}

                            {d.scale ? (
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                {d.scale.map((s) => (
                                  <div
                                    key={s.label}
                                    className="rounded-lg border border-line bg-ivory-50 px-3 py-2"
                                  >
                                    <p className="text-[0.7em] font-bold uppercase tracking-wider text-sand-600">
                                      {s.label}
                                    </p>
                                    <p className="mt-0.5 text-[0.8em] font-semibold leading-snug text-pine-900">
                                      {s.value}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : null}

                            {d.bullets ? (
                              <div className="rounded-lg border border-line bg-ivory-50 p-3">
                                {d.bulletsLabel ? (
                                  <p className="mb-2 text-[0.75em] font-bold uppercase tracking-wider text-sand-600">
                                    {d.bulletsLabel}
                                  </p>
                                ) : null}
                                <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
                                  {d.bullets.map((b) => (
                                    <li
                                      key={b}
                                      className="flex items-start gap-2 text-[0.85em] leading-relaxed text-inkbody"
                                    >
                                      <span className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-pine-600" />
                                      <span>{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}

                            {d.flow ? (
                              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 rounded-lg bg-pine-50/60 p-3">
                                {d.flow.map((s, k) => (
                                  <span key={s} className="flex items-center gap-1.5">
                                    <span className="whitespace-nowrap rounded-md border border-pine-100 bg-ivory-50 px-2 py-1 text-[0.7875em] font-semibold text-pine-900">
                                      {s}
                                    </span>
                                    {k < d.flow!.length - 1 ? (
                                      <ArrowRight size={11} className="shrink-0 text-sand-500" />
                                    ) : null}
                                  </span>
                                ))}
                              </div>
                            ) : null}

                            {d.cases ? (
                              <div className="rounded-lg border border-sand-400/40 bg-sand-100/40 p-3">
                                {d.casesLabel ? (
                                  <p className="mb-2.5 flex items-center gap-1.5 text-[0.75em] font-bold uppercase tracking-wider text-sand-600">
                                    <Building2 size={13} />
                                    {d.casesLabel}
                                  </p>
                                ) : null}
                                <div className="space-y-2">
                                  {d.cases.map((c) => (
                                    <div
                                      key={c.label}
                                      className="rounded-md bg-ivory-50/80 px-3 py-2"
                                    >
                                      <p className="text-[0.85em] font-bold text-pine-900">
                                        {c.label}
                                      </p>
                                      <p className="mt-0.5 text-[0.85em] leading-relaxed text-inkbody">
                                        {c.detail}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}

                            {d.quote ? (
                              <p className="rounded-lg border-l-[3px] border-sand-500 bg-sand-100/40 py-2.5 pl-3.5 pr-3 text-[0.92em] font-medium leading-relaxed text-inkbody">
                                {d.quote}
                              </p>
                            ) : null}

                            {d.ours ? (
                              <div className="rounded-lg border border-pine-100 bg-pine-50/70 p-3">
                                <p className="mb-1 flex items-center gap-1.5 text-[0.75em] font-bold uppercase tracking-wider text-pine-700">
                                  <Ruler size={13} />
                                  제이랩테크라면
                                </p>
                                <p className="text-[0.92em] leading-relaxed text-pine-900">
                                  {d.ours}
                                </p>
                              </div>
                            ) : null}

                            {/* 다음 항목으로 */}
                            {i < total - 1 ? (
                              <button
                                type="button"
                                onClick={() => openBlock(i + 1)}
                                className="inline-flex items-center gap-1.5 text-[0.85em] font-semibold text-pine-700 underline-offset-4 transition-colors hover:text-pine-600 hover:underline"
                              >
                                다음: {policyDetail[i + 1].short}
                                <ArrowRight size={14} />
                              </button>
                            ) : null}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* 완료 메시지 */}
              <AnimatePresence>
                {allRead ? (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 rounded-lg border border-pine-100 bg-pine-50/70 p-3.5 text-[0.85em] leading-relaxed text-pine-900"
                  >
                    <Check size={16} className="mt-0.5 shrink-0 text-pine-600" />
                    <span>
                      9개 항목을 모두 확인하셨습니다. 정리하면, 정책기관은 &lsquo;AI를
                      가진 회사&rsquo;가 아니라 &lsquo;AI로 일하는 방식이 바뀐 회사&rsquo;를
                      찾고 있고, 그 증거는 실제로 써야만 생깁니다.
                    </span>
                  </motion.p>
                ) : null}
              </AnimatePresence>

              <p className="rounded-lg bg-ivory-200/70 p-3.5 text-[0.8em] leading-relaxed text-inkmuted">
                위 사례는 정책사업에서 일반적으로 나타나는 유형을 정리한 것이며, 특정
                기업의 실제 선정·수령 사례가 아닙니다. 정부 사업명·예산·지원금액·금리·
                보증한도·공고기간은 매년 바뀌므로 실제 신청 시점에는 반드시 최신 공고를
                확인해야 합니다. 또한 이 시스템이 있다고 해서 정책자금 수령이나 지원사업
                선정이 보장되지는 않습니다.
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 페이지
 * ------------------------------------------------------------------ */

export default function IntentPage() {
  return (
    <div className="intent-scale space-y-4">
      {/* 히어로 — 사업전환 문장 */}
      <Reveal>
        <Card className="overflow-hidden border-0 bg-pine-900 text-white">
          <CardContent className="relative p-7 md:p-9">
            <p className="text-[0.75em] font-semibold tracking-[0.18em] text-sand-400">
              JLAB TECH — INDUSTRIAL MEASUREMENT BUSINESS AX
            </p>
            <h1 className="mt-3 max-w-3xl text-[1.5em] font-bold leading-snug md:text-[2.25em]">
              계측기를 납품하는 회사에서,
              <br />
              고객의 계측 데이터와 설비 상태를
              <br className="hidden sm:block" /> 함께 관리하는 회사로.
            </h1>
            <p className="mt-4 max-w-2xl text-[1.05em] leading-relaxed text-white/70 md:text-[1.18em]">
              이 시스템을 만든 목적은 전산화가 아닙니다. 제이랩테크가 이미 가진
              재고·견적·고객·설치장비 데이터를 하나로 잇고, 그 데이터가 다음 매출과
              사업 확장의 근거가 되도록 만드는 것입니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["업무 효율", "매출 확대", "사업 고도화 근거"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-[0.75em] font-semibold text-white/85"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sand-500/10 blur-3xl" />
          </CardContent>
        </Card>
      </Reveal>

      <Stagger className="space-y-4">
        {/* 01 배경 */}
        <StaggerItem>
          <Section no="01" icon={BookOpen} title="기업의 일하는 방식이 바뀌고 있습니다">
            <P>
              예전에 말하던 디지털전환은 종이 문서를 컴퓨터로 옮기거나, 손으로 하던
              계산을 엑셀로 바꾸는 정도에 가까웠습니다. 하는 일은 그대로인데 도구만 바뀐
              셈입니다.
            </P>
            <P>
              최근에는 여기서 한 걸음 더 나갑니다. 회사가 이미 가지고 있는 데이터를 이용해
              반복업무를 줄이고, 필요한 정보를 자동으로 이어 주고, 직원이 판단할 때 근거를
              먼저 보여 주고, 나아가 고객에게 새로운 서비스를 제공하는 쪽으로 옮겨 가고
              있습니다.
            </P>
            <Lead>이렇게 일하는 방식 자체를 바꾸는 변화를 요즘 AX라고 부릅니다.</Lead>
          </Section>
        </StaggerItem>

        {/* 02 AX란 */}
        <StaggerItem>
          <Section no="02" icon={Cpu} title="AX는 무엇인가요?">
            <P>
              AX는 AI Transformation, 즉 인공지능 전환입니다. 다만 ChatGPT를 쓰는 것,
              챗봇을 하나 넣는 것, 화면에 &lsquo;AI 추천&rsquo;이라는 이름을 붙이는 것과는
              다릅니다.
            </P>
            <Lead>
              AX는 데이터와 AI를 이용해 회사가 실제로 일하는 방식과 서비스 구조를 바꾸는
              것입니다.
            </Lead>
            <BeforeAfter
              beforeTitle="Before"
              afterTitle="After"
              before={[
                "전화로 사양 확인 → 메모",
                "엑셀에서 재고 확인 → 다시 계산",
                "견적서 새로 작성 → 다시 연락",
                "설치·교정 일정은 담당자 수첩에",
              ]}
              after={[
                "한 번 입력하면 데이터가 자동으로 연결",
                "시스템이 우선순위와 이상 징후를 먼저 제시",
                "직원은 판단과 실행에 집중",
                "실행 결과가 다시 데이터로 저장",
              ]}
            />
            <P>
              핵심은 하나입니다. 사람이 기억하고 옮겨 적는 자리를 줄이고, 데이터가 다음
              업무로 이어지게 만드는 것.
            </P>
          </Section>
        </StaggerItem>

        {/* 03 왜 지금 */}
        <StaggerItem>
          <Section no="03" icon={Clock} title="왜 지금 이런 변화가 중요할까요?">
            <P>
              2026년 들어 정부와 정책기관은 단순한 전산화보다, AI를 실제 업무·제품·서비스에
              적용해 생산성과 매출을 높이는 <strong className="font-semibold text-pine-900">AX
              기업</strong>을 지원하는 방향으로 빠르게 움직이고 있습니다.
            </P>
            <P>
              중진공은 AI 도입·활용기업을 대상으로 하는 우대 트랙을 두고, 기술보증기금은
              기업의 AX 수준을 전략·조직·기술·데이터·성과 관점에서 측정하기 시작했습니다.
              신용보증기금도 AI 전담조직과 특화 프로그램을 강화하고 있습니다.
            </P>
            <Lead>
              그래서 이 프로젝트는 제이랩테크의 실제 사업 고도화와, 지금 정부가 중점적으로
              보는 AX·사업전환 방향을 동시에 준비하는 것입니다.
            </Lead>
            <P>
              다만 프로그램을 만들었다고 지원이나 자금조달이 자동으로 되는 것은 아닙니다.
              실제로 사용하고, 업무시간·비용·오류·재구매·매출이 어떻게 달라졌는지를 숫자로
              남겨야 심사의 근거가 됩니다.
            </P>
            <PolicyBriefing />
          </Section>
        </StaggerItem>

        {/* 04 우리 상황 */}
        <StaggerItem>
          <Section no="04" icon={Factory} title="그렇다면 제이랩테크에는 무엇이 필요할까요?">
            <P>제이랩테크의 일은 대략 이런 순서로 이어집니다.</P>
            <Flow
              steps={[
                "견적 문의",
                "사양 상담",
                "견적 작성",
                "수주",
                "재고 확인·발주",
                "납품·설치",
                "교정·A/S",
                "소모품 재구매",
              ]}
            />
            <P>
              문제는 이 과정에서 생긴 정보가 한곳에 모이지 않는다는 점입니다. 문의는 전화와
              메일에, 재고는 엑셀에, 견적서는 담당자 개인 폴더에, 설치 장비의 시리얼과
              교정 일정은 수기 대장이나 담당자의 기억에 남습니다.
            </P>
            <Lead>
              한 번 생긴 정보를 여러 번 다시 적게 되고, 숫자는 쌓이고 있지만 다음 영업에
              활용되지 못하고 있습니다.
            </Lead>
            <P>
              특히 아깝게 지나가는 것이 있습니다. 고객사에 납품한 장비는 언젠가 반드시
              교정을 받아야 하고, 소모품은 주기적으로 갈아야 합니다. 그 시점을 우리가
              알고 있으면 먼저 제안할 수 있는데, 지금은 대부분 고객이 먼저 연락해야
              알게 됩니다.
            </P>
          </Section>
        </StaggerItem>

        {/* 04-B 사진 자리 */}
        <StaggerItem>
          <Section no="04+" icon={WorkflowIcon} title="현장은 이렇게 바뀝니다">
            <P>
              아래 세 장면은 실제 제이랩테크 현장 사진으로 채울 예정입니다. 지금은
              자리만 잡아 두었습니다.
            </P>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <PhotoPlaceholder
                label="지금의 문제"
                caption="수기 대장, 엑셀 재고표, 담당자별 견적 파일 — 정보가 흩어져 있는 현재 모습"
              />
              <PhotoPlaceholder
                label="달라진 업무"
                caption="한 화면에서 재고·발주·고객 요청을 확인하고 처리하는 모습"
              />
              <PhotoPlaceholder
                label="확장되는 사업"
                caption="고객 현장에서 설치 장비를 함께 관리하고 교정·유지관리로 이어지는 모습"
              />
            </div>
          </Section>
        </StaggerItem>

        {/* 05 설계 */}
        <StaggerItem>
          <Section no="05" icon={LayoutGrid} title="그래서 이 시스템은 이렇게 설계했습니다">
            <Lead>
              견적 단계에서 한 번 입력한 정보가 회사의 다음 업무까지 이어지게 만든다.
            </Lead>
            <P>
              화려한 기능을 넣는 대신, 제이랩테크의 핵심 업무가 끊기지 않고 이어지는 데
              집중했습니다. AI는 정말 필요한 판단·추천·예측·우선순위 영역에만 사용합니다.
            </P>
            <div className="space-y-2.5">
              {[
                {
                  n: "1",
                  t: "핵심 업무 1회 입력",
                  d: "고객 조건이나 현장 조건을 한 번만 입력합니다.",
                },
                {
                  n: "2",
                  t: "관련 데이터 자동 연결",
                  d: "재고, 원가·마진, 과거 거래 이력이 자동으로 붙습니다.",
                },
                {
                  n: "3",
                  t: "재고·견적·고객·설치장비 반영",
                  d: "발주가 등록되고, 견적이 저장되고, 설치 장비 대장에 남습니다.",
                },
                {
                  n: "4",
                  t: "AI·관리기준에 따른 우선순위 판단",
                  d: "부족할 품목, 마진이 위험한 품목, 연락할 고객을 시스템이 먼저 골라 줍니다.",
                },
                {
                  n: "5",
                  t: "직원의 다음 실행 제시",
                  d: "대시보드의 '오늘의 실행 과제'가 오늘 할 일을 정해 줍니다.",
                },
                {
                  n: "6",
                  t: "실행 결과와 성과 축적",
                  d: "발주·견적·연락 기록이 남아 다음 판단의 근거가 됩니다.",
                },
              ].map((s) => (
                <div
                  key={s.n}
                  className="flex gap-3.5 rounded-xl border border-line/70 bg-ivory-100/60 p-3.5 transition-colors hover:border-pine-100 hover:bg-pine-50/40"
                >
                  <span className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pine-900 text-[0.875em] font-bold text-sand-400">
                    {s.n}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[1em] font-bold text-pine-900">{s.t}</p>
                    <p className="mt-0.5 text-[0.92em] leading-relaxed text-inkmuted">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </StaggerItem>

        {/* 06 업무 변화 */}
        <StaggerItem>
          <Section no="06" icon={Workflow} title="업무가 어떻게 달라지나요?">
            <BeforeAfter
              before={[
                "재고 파악에 반나절 (엑셀 대조)",
                "견적은 담당자 경험에 따라 품질이 다름",
                "소모품 동반 제안이 자주 누락됨",
                "할인은 감으로 결정, 마진은 나중에 확인",
                "교정 시점은 고객이 먼저 연락해야 파악",
                "월말은 다시 입력하는 시간",
              ]}
              after={[
                "재고·예측 수요를 화면에서 즉시 확인",
                "조건 몇 가지로 추천 장비와 견적 초안 생성",
                "함께 제안할 소모품이 자동으로 따라붙음",
                "견적 전에 마진 하한선을 시뮬레이터로 확인",
                "교정·소모품 주기를 근거로 우리가 먼저 제안",
                "월말은 확인하고 마감하는 시간",
              ]}
            />
            <Lead>
              월말에 하는 일이 「다시 입력하기」에서 「확인하고 마감하기」로 바뀝니다.
            </Lead>
          </Section>
        </StaggerItem>

        {/* 06-B 고객 플랫폼 — 사업모델이 달라지는 지점 */}
        <StaggerItem>
          <Section
            no="06+"
            icon={Users}
            title="여기서부터 사업 모델이 달라집니다"
            tone="accent"
          >
            <P>
              지금까지는 내부에서 일하는 방식이 바뀌는 이야기였습니다. 여기서부터는
              고객과의 관계가 바뀝니다.
            </P>
            <P>
              기존에는 장비를 납품하면 거래가 끝났습니다. 앞으로는 고객이 제이랩테크
              플랫폼에서 자기 장비의 교정 시점과 보증 상태를 직접 확인하고, 교정·소모품·
              추가 계측을 화면에서 바로 요청합니다.
            </P>
            <P>
              그 요청은 내부 Business AX로 이어지고, 직원이 처리한 결과는 다시 고객
              화면에 반영됩니다. 이 연결이 단순 전산화와 갈리는 지점입니다.
            </P>
            <ClosedLoopDiagram />
            <Lead>
              장비를 파는 회사에서, 고객의 장비 운영을 함께 관리하는 회사로 넓어집니다.
            </Lead>
            <div className="flex flex-wrap gap-2">
              <Link href="/customer">
                <Button variant="secondary" size="md">
                  <Users size={15} />
                  고객 플랫폼 보기
                </Button>
              </Link>
              <Link href="/requests">
                <Button variant="outline" size="md">
                  고객 요청 화면 보기
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </Section>
        </StaggerItem>

        {/* 07 사업 성장 */}
        <StaggerItem>
          <Section no="07" icon={TrendingUp} title="하지만 목표는 업무효율화만이 아닙니다">
            <P>
              효율화까지만 하면 그냥 관리 프로그램입니다. AX의 중요한 차이는 쌓인 데이터를
              다시 매출에 쓰는 데 있습니다.
            </P>
            <Flow
              steps={[
                "데이터 축적",
                "고객 이용패턴 파악",
                "필요 시점 판단",
                "직원 실행",
                "추가 매출",
                "결과 재축적",
              ]}
            />
            <P>
              제이랩테크에서 이 구조가 만들어 낼 수 있는 매출은 구체적입니다. 설치된 장비
              한 대는 교정 서비스, 소모품 정기 납품, 부품 교체, 업그레이드, 유지관리
              계약까지 이어질 수 있습니다.
            </P>
            <div className="flex flex-wrap gap-2">
              {[
                "소모품 정기 납품",
                "교정 서비스 계약",
                "센서 교체·업그레이드",
                "측정 항목 확장",
                "유지관리 계약",
                "계측 설계 컨설팅",
                "거래처당 매출 확대",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-sand-400/40 bg-sand-100/60 px-3 py-1.5 text-[0.75em] font-semibold text-sand-600"
                >
                  {t}
                </span>
              ))}
            </div>
            <Lead>
              장비 대금만 한 번 받는 구조에서, 한 번 납품한 고객에게 여러 서비스를 계속
              제공하는 구조로 넓히는 것입니다.
            </Lead>
          </Section>
        </StaggerItem>

        {/* 08 얻는 것 */}
        <StaggerItem>
          <Section no="08" icon={Award} title="결국 제이랩테크가 얻으려는 것은 무엇인가요?">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                {
                  t: "업무 효율",
                  d: "반복 입력과 누락을 줄이고, 견적부터 교정까지 업무를 하나로 잇습니다.",
                },
                {
                  t: "매출 확대",
                  d: "기존 고객에게서 재구매·소모품·교정·유지관리로 거래처당 매출을 키웁니다.",
                },
                {
                  t: "사업 고도화 근거",
                  d: "실제 운영성과와 매출 데이터를 쌓아 정책자금·보증·R&D의 근거로 씁니다.",
                },
              ].map((c, i) => (
                <div
                  key={c.t}
                  className="flex min-h-[9rem] flex-col rounded-xl border border-line bg-ivory-100/60 p-5 transition-all hover:-translate-y-0.5 hover:border-pine-100 hover:shadow-card"
                >
                  <span className="num mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-pine-900 text-[0.875em] font-bold text-sand-400">
                    {i + 1}
                  </span>
                  <p className="text-[1.125em] font-bold text-pine-900">{c.t}</p>
                  <p className="mt-1.5 text-[0.92em] leading-relaxed text-inkmuted">{c.d}</p>
                </div>
              ))}
            </div>
            <Lead>
              계측기를 파는 것에서 끝나지 않고, 쌓인 데이터로 고객의 설비 운영까지 함께
              돕는 회사로 넓히는 것 — 이것이 이 시스템을 만든 이유입니다.
            </Lead>
          </Section>
        </StaggerItem>

        {/* 09 기록의 주인 */}
        <StaggerItem>
          <Section no="09" icon={ShieldCheck} title="기록의 주인은 회사입니다">
            <P>
              계측 데이터와 고객 거래 이력은 제이랩테크가 오래 일하며 쌓은 자산입니다.
              그래서 이 시스템은 처음부터 데이터의 주인이 회사라는 전제로 설계했습니다.
            </P>
            <ul className="space-y-2">
              {[
                "기존 엑셀 데이터를 가져올 수 있고, 언제든 내보낼 수 있습니다.",
                "백업과 복구를 고려하며, 오입력을 되돌릴 수 있도록 만듭니다.",
                "소스코드와 데이터의 소유권을 명확히 합니다.",
                "실제 DB 연결 후에는 여러 직원이 같은 데이터를 함께 씁니다.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[1em] leading-relaxed text-inkbody">
                  <Check size={17} className="mt-1 shrink-0 text-pine-600" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-sand-400/40 bg-sand-100/50 p-4">
              <p className="text-[1em] font-semibold leading-relaxed text-inkbody">
                그리고 한 가지 원칙이 있습니다. 예상치를 실제 성과처럼 표시하지 않습니다.
              </p>
              <p className="mt-1.5 text-[0.92em] leading-relaxed text-inkmuted">
                현재 화면의 숫자는 데모 데이터이며, 화면에도 그렇게 표기했습니다. 실제
                데이터를 연결하기 전까지는 목표 KPI로, 연결한 뒤에는 실제 결과로 구분해
                보여드립니다. 보기 좋은 숫자보다 심사에서 설명할 수 있는 숫자가 중요하기
                때문입니다.
              </p>
            </div>
          </Section>
        </StaggerItem>

        {/* 10 정책자금 */}
        <StaggerItem>
          <Section no="10" icon={Landmark} title="정책자금과는 어떻게 연결되나요?">
            <P>
              순서를 정확히 말씀드리는 것이 중요합니다. 정책자금을 받으려고 프로그램을
              만드는 것이 아닙니다.
            </P>
            <Lead>
              자금을 먼저 받아 사업을 만드는 구조가 아니라, 사업을 실제로 바꾸고 그 성과를
              근거로 성장자금을 조달하는 구조입니다.
            </Lead>
            <P>
              먼저 회사가 실제로 생산성을 높이고, 데이터를 쌓고, 기존 고객에서 추가 매출을
              만드는 과정을 만듭니다. 그 다음 실제 운영성과와 근거를 가지고 정책자금·보증·
              R&amp;D·정부지원사업을 활용해 사업을 더 키우는 것입니다.
            </P>
            <P>
              이 시스템은 그 근거를 만들기 위해 설계되었습니다. 정책기관이 보는 네 가지
              관점에 각각 대응하는 기록이 남습니다.
            </P>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  t: "전략·의지",
                  d: "AX 도입 목적과 3단계 확장 로드맵이 문서와 화면으로 존재합니다.",
                },
                {
                  t: "자원·조직",
                  d: "실제 사용자와 담당자, 개발 파트너, 운영 프로세스가 확인됩니다.",
                },
                {
                  t: "기술·데이터",
                  d: "작동하는 시스템, 회사 데이터, 예측·추천·자동화 로직, 사용 로그가 있습니다.",
                },
                {
                  t: "활용·성과",
                  d: "견적 시간, 발주 누락, 재구매율, 거래처당 매출을 Before & After로 측정합니다.",
                },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-line bg-ivory-100/60 p-4">
                  <p className="text-[1em] font-bold text-pine-900">{c.t}</p>
                  <p className="mt-1 text-[0.92em] leading-relaxed text-inkmuted">{c.d}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-ivory-200/60 p-4">
              <p className="text-[0.92em] leading-relaxed text-inkmuted">
                다만 분명히 해 둡니다. 이 시스템이 있다고 정책자금 수령이나 정부지원사업
                선정이 보장되지는 않습니다. 심사에서 설명할 근거가 생기고, AX·혁신기업
                관점의 설득력이 높아지며, 공고 요건에 맞는 경우 신청 가능성이 열리는
                것입니다. 실제 성과 기록이 쌓일수록 그 설득력은 강해집니다.
              </p>
            </div>
            <Link href="/policy" className="inline-block">
              <Button variant="secondary" size="lg">
                정책자금 성과 분석 화면 보기
                <ArrowRight size={15} />
              </Button>
            </Link>
          </Section>
        </StaggerItem>

        {/* 11 앞으로 */}
        <StaggerItem>
          <Section no="11" icon={Rocket} title="앞으로 어디까지 발전시키나요?">
            <P>
              지금 보시는 화면은 1·2단계입니다. 화면과 업무 흐름을 확정했고, 발주·견적·
              고객 접촉이 실제로 기록되기 시작했습니다. 여기서 멈추면 잘 만든 데모로
              끝납니다.
            </P>
            <div className="space-y-2.5">
              {[
                {
                  n: "1단계 — 효율화형 AX",
                  s: "운영 중",
                  d: "내부 운영을 하나로 잇고 기존 사업 안에서 매출을 올립니다. 재고·발주·견적·재구매·마진·교정이 여기에 해당하며, 지금 작동하고 있습니다.",
                  tone: "done" as const,
                },
                {
                  n: "2단계 — 사업모델 전환형 AX",
                  s: "시작 단계",
                  d: "계측기 판매에서 고객 운영지원으로 넓힙니다. 고객 플랫폼, 고객 장비 관리, 교정·소모품 요청, 추가 계측 상담, 계측 설계가 여기에 들어갑니다. 구조는 열렸고, 실제 판매·재고 데이터 연동이 남았습니다.",
                  tone: "next" as const,
                },
                {
                  n: "3단계 — 산업전환형 AX",
                  s: "중장기 검토",
                  d: "장기적으로 계측 운영 데이터 플랫폼을 검토합니다. 원격 계측, 데이터 리포트, 이상징후 감지, 예지보전, 반복형 관리 서비스가 후보입니다. 아직 구현된 기능이 아니며, 실증 이후 확장 여부를 판단합니다.",
                  tone: "later" as const,
                },
              ].map((p) => (
                <div
                  key={p.n}
                  className={cn(
                    "rounded-xl border p-4",
                    p.tone === "done" && "border-pine-100 bg-pine-50/60",
                    p.tone === "next" && "border-sand-400/50 bg-sand-100/50",
                    p.tone === "later" && "border-line bg-ivory-100/60",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="clamp-1 text-[1em] font-bold text-pine-900">{p.n}</p>
                    <Badge
                      tone={
                        p.tone === "done"
                          ? "success"
                          : p.tone === "next"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {p.s}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-[0.92em] leading-relaxed text-inkmuted">{p.d}</p>
                </div>
              ))}
            </div>
            <Lead>
              이 시스템의 완성은 개발이 끝나는 시점이 아니라, 실제 직원과 고객이 쓰면서
              업무시간과 매출이 실제로 나아지는 순간입니다.
            </Lead>
          </Section>
        </StaggerItem>
      </Stagger>

      {/* 마무리 — 이 프로그램에서 시작되는 다섯 갈래 */}
      <Reveal delay={0.1}>
        <Card className="overflow-hidden border-0 bg-pine-900 text-white">
          <CardContent className="relative p-7 md:p-9">
            <span className="inline-flex items-center gap-2 rounded-full border border-sand-500/30 bg-sand-500/10 px-3 py-1.5 text-[0.75em] font-semibold text-sand-400">
              <Layers size={13} /> 이 프로그램에서 시작되는 것들
            </span>
            <h2 className="mt-3.5 max-w-3xl text-[1.25em] font-bold leading-snug md:text-[1.5em]">
              하나의 시스템에서 다섯 갈래가 함께 열립니다.
            </h2>
            <p className="mt-3 max-w-3xl text-[1.05em] leading-relaxed text-white/70 md:text-[1.18em]">
              재고를 정리하려고 만든 프로그램 하나가, 실제로는 경쟁력·자금·비용·매출·
              사업모델까지 함께 담당합니다. 이미 여러 업종의 기업들이 같은 이유로 AX
              도입을 시작하고 있습니다.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  icon: Cpu,
                  title: "AI 시대의 경쟁력",
                  body: "같은 장비는 어디서나 살 수 있습니다. 차이를 만드는 것은 고객의 설비와 사용 주기를 아는 데이터이고, 그건 오래 거래한 회사만 가질 수 있습니다.",
                },
                {
                  icon: Landmark,
                  title: "정책자금·정부지원 대응력",
                  body: "정책기관이 보는 전략·조직·기술·성과 네 관점에 각각 대응하는 기록이 남습니다. 계획서의 문장이 아니라 열어볼 수 있는 화면으로 설명할 수 있습니다.",
                },
                {
                  icon: Clock,
                  title: "낭비되는 시간과 비용 절감",
                  body: "재고 파악, 견적 작성, 발주 판단에 쓰던 시간이 줄어듭니다. 과잉 재고에 묶여 있던 자금도 함께 풀립니다.",
                },
                {
                  icon: TrendingUp,
                  title: "매출이 나오는 곳에 집중",
                  body: "어느 고객이, 어느 품목에서, 언제 다시 살지를 데이터가 알려줍니다. 감으로 도는 영업이 근거를 가진 영업으로 바뀝니다.",
                },
                {
                  icon: Rocket,
                  title: "다음 사업모델의 발판",
                  body: "설치장비와 교정 데이터가 쌓이면 유지관리 서비스를 상품화할 수 있습니다. 장비를 파는 회사에서 운영을 돕는 회사로 넓어지는 출발점입니다.",
                },
                {
                  icon: ShieldCheck,
                  title: "흔들리지 않는 운영 체계",
                  body: "담당자가 바뀌어도, 회사가 커져도 판단 기준이 그대로 남습니다. 개인의 기억이 아니라 회사의 데이터가 일하기 때문입니다.",
                },
              ].map((c, ci) => {
                const CIcon = c.icon;
                return (
                  <div
                    key={c.title}
                    className="rounded-xl border border-white/12 bg-white/5 p-5 transition-colors duration-200 hover:border-sand-500/30 hover:bg-white/[0.08]"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand-500/15 text-sand-400">
                        <CIcon size={19} strokeWidth={1.9} />
                      </span>
                      <span className="num text-[1.1em] font-bold leading-none text-sand-500/45">
                        {String(ci + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-[1.21em] font-bold leading-snug text-sand-400">
                      {c.title}
                    </p>
                    <p className="mt-2 text-[0.92em] leading-relaxed text-white/65">
                      {c.body}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 max-w-3xl text-[1.05em] leading-relaxed text-white/70">
              이 화면들은 완성품이 아니라 제이랩테크에 맞게 다듬기 위한 출발점입니다.
              실제 업무에서 써 보시고 &lsquo;이건 필요하다 / 이건 다르게&rsquo;를 알려
              주시면, 그 피드백이 다음 버전의 설계도가 됩니다.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link href="/tutorial">
                <Button variant="gold" size="lg">
                  <BookOpen size={16} />
                  사용 방법 먼저 보기
                </Button>
              </Link>
              <Link href="/">
                <Button
                  size="lg"
                  className="border border-white/20 bg-white/10 text-white hover:bg-white/16"
                >
                  대시보드로 이동
                  <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
            <p className="mt-6 border-t border-white/10 pt-4 text-[0.75em] text-white/40">
              Planned &amp; Built by 미래에이아이랩 &amp; 곽주완
            </p>
            <div className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-sand-500/10 blur-3xl" />
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
