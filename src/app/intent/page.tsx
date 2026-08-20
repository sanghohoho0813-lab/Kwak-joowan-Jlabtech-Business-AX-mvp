"use client";

import {
  BookOpen,
  Cpu,
  Clock,
  Factory,
  LayoutGrid,
  Workflow,
  TrendingUp,
  Award,
  Landmark,
  Rocket,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";

const sections = [
  {
    icon: BookOpen,
    no: "01",
    title: "배경",
    body: [
      "제이랩테크는 산업·환경 계측기와 센서, 분석 장비를 공급해 온 회사입니다.",
      "그동안의 영업은 대부분 담당자의 경험과 기억에 의존해 왔습니다. 어떤 재고가 얼마나 남았는지, 어느 고객이 언제쯤 다시 구매할지는 사람의 머릿속에만 있었습니다.",
      "사업이 커질수록 이 방식은 한계에 부딪힙니다. 이 시스템은 그 한계를 넘기 위한 첫걸음입니다.",
    ],
  },
  {
    icon: Cpu,
    no: "02",
    title: "AX란 무엇인가",
    body: [
      "AX(AI Transformation)는 단순히 프로그램을 도입하는 것이 아닙니다.",
      "회사에 쌓이는 데이터(판매 기록, 재고 변화, 고객 구매 주기)를 AI가 읽을 수 있는 형태로 모으고, 그 데이터가 다음 행동을 알려주는 회사로 바뀌는 것을 말합니다.",
      "쉽게 말해, \"감으로 하던 판단\"을 \"데이터가 뒷받침하는 판단\"으로 바꾸는 일입니다.",
    ],
  },
  {
    icon: Clock,
    no: "03",
    title: "왜 지금인가",
    body: [
      "계측기 유통 시장은 제품만으로 차별화하기가 점점 어려워지고 있습니다. 같은 장비는 어디서든 살 수 있기 때문입니다.",
      "반면 \"우리 고객이 언제, 무엇을 필요로 하는지\"를 아는 회사는 흔치 않습니다. 이 데이터는 거래를 오래 해온 회사만 가질 수 있는 자산입니다.",
      "지금 시작하면 데이터가 쌓이는 만큼 격차가 벌어집니다. 늦게 시작할수록 그 격차를 따라잡기 어렵습니다.",
    ],
  },
  {
    icon: Factory,
    no: "04",
    title: "제이랩테크의 현재 상황",
    body: [
      "다양한 품목의 재고가 있지만, 무엇이 부족해지고 무엇이 남아도는지 실시간으로 보기 어렵습니다.",
      "견적은 담당자의 경험에 따라 품질이 달라지고, 함께 팔 수 있는 소모품 제안이 빠지는 경우가 있습니다.",
      "기존 고객의 재구매 시점은 대부분 고객이 먼저 연락해야 알 수 있습니다. 즉, 기회가 오기를 기다리는 구조입니다.",
    ],
  },
  {
    icon: LayoutGrid,
    no: "05",
    title: "이 MVP는 이렇게 설계했습니다",
    body: [
      "1단계에서는 효과가 가장 빠른 세 가지에 집중했습니다. ① 재고·수요 관리, ② AI 제품추천·견적, ③ 기존 고객 재구매 예측입니다.",
      "2단계에서는 여기에 다섯 가지를 더했습니다. 마진 가드, 설치장비 관리, 산업계측 설계, 리포트 센터, 정책자금 성과 분석입니다.",
      "모든 기능은 \"화면을 보는 순간 다음에 할 일이 보이는 것\"을 목표로 만들었습니다. 발주할 품목, 오늘 연락할 고객, 교정 갈 현장이 바로 보입니다.",
    ],
  },
  {
    icon: Workflow,
    no: "06",
    title: "업무는 이렇게 달라집니다",
    body: [
      "아침에 대시보드를 열면 오늘의 실행 과제(발주·연락·교정·마진)가 한 줄로 정리되어 있습니다.",
      "고객 문의가 오면 조건 몇 가지를 고르는 것만으로 추천 장비와 견적 초안이 나옵니다. 견적 품질이 담당자에 따라 흔들리지 않습니다.",
      "발주를 등록하고 고객에게 연락하면 그 기록이 플랫폼에 남습니다. 담당자의 기억이 아니라 회사의 데이터가 됩니다.",
    ],
  },
  {
    icon: TrendingUp,
    no: "07",
    title: "사업 성장과의 연결",
    body: [
      "재고 최적화는 묶여 있던 자금을 풀어 줍니다. 과잉 재고를 줄이면 그만큼 현금 여력이 생깁니다.",
      "재구매 예측은 새 고객을 찾는 비용 없이 매출을 올리는 방법입니다. 설치장비의 교정 주기까지 함께 보면, 방문 한 번에 교정과 소모품 두 가지 매출이 생깁니다.",
      "마진 가드는 반대편을 지킵니다. 매출이 늘어도 할인으로 마진이 새면 남는 것이 없기 때문에, 견적 전에 하한선을 확인하도록 만들었습니다.",
    ],
  },
  {
    icon: Award,
    no: "08",
    title: "결국 얻는 것",
    body: [
      "단순 전산화가 아니라, 회사의 판단 기준이 데이터 위에 올라섭니다.",
      "\"계측기를 파는 회사\"에서 \"계측 데이터로 고객의 운영을 돕는 회사\"로 정체성이 확장됩니다.",
      "이 변화는 직원이 바뀌어도, 회사가 커져도 흔들리지 않는 운영 체계로 남습니다.",
    ],
  },
  {
    icon: Landmark,
    no: "09",
    title: "정책자금과의 연결",
    body: [
      "정부의 사업고도화·디지털 전환 지원사업은 \"데이터 기반 운영 체계\"를 갖춘 기업을 우대하는 방향으로 움직이고 있습니다.",
      "이 시스템은 그 자체로 \"우리 회사는 이미 AX를 시작했다\"는 실물 증거가 됩니다. 계획서 속 문장이 아니라 작동하는 화면으로 보여줄 수 있습니다.",
      "2단계에서는 정책자금 성과 분석 화면을 따로 만들었습니다. 도입 전후 비교, 요건 충족 현황, 사업계획서에 그대로 옮겨 쓸 수 있는 근거 문단까지 정리해 둡니다.",
    ],
  },
  {
    icon: Rocket,
    no: "10",
    title: "앞으로",
    body: [
      "1단계에서 핵심 3개 기능으로 업무 흐름을 확정했고, 2단계(현재)에서 수익·자산 관리와 성과 분석까지 8개 모듈로 확장했습니다. 발주·견적·고객 접촉은 이제 실제로 기록됩니다.",
      "3단계에서는 실제 판매·재고 시스템을 연결해 데모 데이터를 실데이터로 바꾸고, 고객이 자기 장비 상태를 직접 확인하는 포털과 예지보전 분석으로 넓혀갑니다.",
      "서두르지 않고, 실제 업무에서 검증하며 한 단계씩 나아가는 것이 이 프로젝트의 원칙입니다.",
    ],
  },
];

export default function IntentPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="기획의도"
        description="이 시스템을 왜 만들었는지, 그리고 제이랩테크가 어디로 갈 수 있는지를 정리했습니다."
      />

      {/* 핵심 메시지 배너 */}
      <Reveal>
        <Card className="overflow-hidden border-0 bg-pine-900 text-white">
          <CardContent className="relative p-6 md:p-8">
            <p className="text-2xs font-semibold tracking-[0.16em] text-sand-400">
              JLAB TECH — INDUSTRIAL MEASUREMENT BUSINESS AX
            </p>
            <h2 className="mt-2 max-w-2xl text-lg font-bold leading-snug md:text-xl">
              계측기를 파는 회사에서,
              <br />
              계측 데이터로 성장하는 회사로.
            </h2>
            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-white/65 md:text-sm">
              이 MVP의 목적은 전산화가 아닙니다. 재고·견적·기존고객 관리를 체계화하고,
              그 과정에서 데이터 기반 운영과 추가 매출 구조를 만들며, 앞으로의
              사업고도화와 정책자금 설득 근거까지 함께 준비하는 것입니다.
            </p>
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sand-500/10 blur-2xl" />
          </CardContent>
        </Card>
      </Reveal>

      {/* 섹션 카드 */}
      <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <StaggerItem key={section.no}>
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="num text-2xs font-bold tracking-wider text-sand-600">
                        {section.no}
                      </p>
                      <h3 className="clamp-1 text-sm font-bold text-pine-900">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-3.5 space-y-2.5">
                    {section.body.map((paragraph, i) => (
                      <p key={i} className="text-xs leading-relaxed text-inkbody">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* 마무리 */}
      <Reveal delay={0.1}>
        <Card className="border-sand-400/40 bg-sand-100/50">
          <CardContent className="p-5 text-center md:p-6">
            <p className="mx-auto max-w-xl text-xs leading-relaxed text-inkbody md:text-sm">
              이 화면들은 완성이 아니라 시작점입니다. 실제 업무에서 써 보시고,
              &ldquo;이건 필요하다 / 이건 다르게&rdquo;를 알려 주시면 그 피드백이 다음
              버전의 설계도가 됩니다.
            </p>
            <p className="mt-3 text-2xs text-inkmuted">미래에이아이랩 &amp; 곽주완</p>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
