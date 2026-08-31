"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Type,
  Palette,
  Bell,
  GraduationCap,
  DatabaseBackup,
  Database,
  Info,
  Check,
  Zap,
  UserCog,
  Server,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import {
  useSettings,
  ONBOARDING_KEY,
  THEMES,
  type FontSize,
  type MotionMode,
  type RolePreview,
} from "@/lib/settings-context";
import { useStore } from "@/lib/store-context";
import { cn } from "@/lib/utils";

const fontSizes: { value: FontSize; label: string }[] = [
  { value: "small", label: "작게" },
  { value: "default", label: "기본" },
  { value: "large", label: "크게" },
];

const motions: { value: MotionMode; label: string; hint: string }[] = [
  { value: "default", label: "기본", hint: "부드러운 전환 효과 사용" },
  { value: "reduced", label: "줄임", hint: "애니메이션 최소화" },
];

const roles: { value: RolePreview; hint: string }[] = [
  { value: "대표", hint: "고객 요청·재구매·마진을 먼저" },
  { value: "영업·견적", hint: "고객 요청·재구매·발주를 먼저" },
  { value: "재고·운영", hint: "발주·교정을 먼저" },
];

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
  stack = false,
}: {
  icon: typeof Type;
  title: string;
  description: string;
  children: React.ReactNode;
  /** 내용이 넓으면 아래로 쌓는다 */
  stack?: boolean;
}) {
  return (
    <Card>
      <CardContent
        className={cn(
          "flex gap-4 p-5",
          stack
            ? "flex-col"
            : "flex-col sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
            <Icon size={17} strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-pine-900">{title}</p>
            <p className="clamp-3 mt-0.5 text-xs leading-relaxed text-inkmuted">
              {description}
            </p>
          </div>
        </div>
        <div className={cn("shrink-0", !stack && "sm:pl-4")}>{children}</div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const {
    fontSize,
    setFontSize,
    theme,
    setTheme,
    motion,
    setMotion,
    role,
    setRole,
    notifications,
    setNotifications,
    resetAll,
  } = useSettings();
  const { orders, quotes, activities, requests, clearAll } = useStore();
  const router = useRouter();
  const [resetDone, setResetDone] = useState(false);

  const replayTutorial = () => {
    try {
      localStorage.removeItem(ONBOARDING_KEY);
    } catch {}
    router.push("/");
  };

  const handleReset = () => {
    resetAll();
    clearAll();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="설정"
        description="화면 표시와 데이터 상태를 관리합니다. 설정은 이 기기에 저장되어 새로고침해도 유지됩니다."
      />

      <Stagger className="space-y-4">
        {/* 글자 크기 */}
        <StaggerItem>
          <SettingRow
            icon={Type}
            title="글자 크기"
            description="화면 전체의 글자 크기를 조정합니다. 선택 즉시 적용되고 저장됩니다."
          >
            <div className="flex gap-2">
              {fontSizes.map((size, i) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setFontSize(size.value)}
                  className={cn(
                    "flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-xl border transition-colors duration-fast",
                    fontSize === size.value
                      ? "border-pine-700 bg-pine-700 text-white"
                      : "border-line bg-ivory-100 text-inkmuted hover:border-pine-100 hover:text-pine-700",
                  )}
                >
                  <span
                    className="font-bold leading-none"
                    style={{ fontSize: `${0.8 + i * 0.2}rem` }}
                  >
                    가
                  </span>
                  <span className="text-2xs font-medium">{size.label}</span>
                </button>
              ))}
            </div>
          </SettingRow>
        </StaggerItem>

        {/* 테마 */}
        <StaggerItem>
          <SettingRow
            icon={Palette}
            title="화면 테마"
            description="아이보리 & 딥그린(Forest Sand)이 기본 브랜드 테마입니다. 시연 상황에 맞춰 톤을 바꿀 수 있습니다."
            stack
          >
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {THEMES.map((t) => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors duration-fast",
                      active
                        ? "border-pine-700 bg-pine-50"
                        : "border-line bg-ivory-100/60 hover:border-pine-100",
                    )}
                  >
                    <span className="flex shrink-0 gap-1">
                      {t.swatch.map((c) => (
                        <span
                          key={c}
                          className="h-7 w-3.5 rounded-sm ring-1 ring-black/10"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "clamp-1 text-xs font-bold",
                            active ? "text-pine-900" : "text-inkbody",
                          )}
                        >
                          {t.name}
                        </span>
                        {t.id === "forest-sand" ? (
                          <span className="shrink-0 text-[0.5625rem] font-semibold text-sand-600">
                            기본
                          </span>
                        ) : null}
                      </span>
                      <span className="clamp-1 block text-2xs text-inkmuted">
                        {t.description}
                      </span>
                    </span>
                    {active ? (
                      <Check size={15} className="shrink-0 text-pine-700" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </SettingRow>
        </StaggerItem>

        {/* 모션 */}
        <StaggerItem>
          <SettingRow
            icon={Zap}
            title="화면 전환 효과"
            description="기기 설정에서 '동작 줄이기'가 켜져 있으면 이 설정과 무관하게 자동으로 최소화됩니다."
          >
            <div className="flex gap-2">
              {motions.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMotion(m.value)}
                  title={m.hint}
                  className={cn(
                    "h-10 whitespace-nowrap rounded-xl border px-4 text-xs font-semibold transition-colors duration-fast",
                    motion === m.value
                      ? "border-pine-700 bg-pine-700 text-white"
                      : "border-line bg-ivory-100 text-inkmuted hover:border-pine-100 hover:text-pine-700",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </SettingRow>
        </StaggerItem>

        {/* 역할 미리보기 */}
        <StaggerItem>
          <SettingRow
            icon={UserCog}
            title="역할 미리보기"
            description="선택한 역할에 따라 대시보드 '오늘의 실행 과제' 순서가 달라집니다. 권한 기능이 아니라 시연용 미리보기입니다."
          >
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  title={r.hint}
                  className={cn(
                    "h-10 whitespace-nowrap rounded-xl border px-3.5 text-xs font-semibold transition-colors duration-fast",
                    role === r.value
                      ? "border-pine-700 bg-pine-700 text-white"
                      : "border-line bg-ivory-100 text-inkmuted hover:border-pine-100 hover:text-pine-700",
                  )}
                >
                  {r.value}
                </button>
              ))}
            </div>
          </SettingRow>
        </StaggerItem>

        {/* 알림 */}
        <StaggerItem>
          <SettingRow
            icon={Bell}
            title="알림 표시"
            description="신규 고객 요청이 있을 때 상단에 배지를 표시합니다."
          >
            <button
              type="button"
              role="switch"
              aria-checked={notifications}
              onClick={() => setNotifications(!notifications)}
              className={cn(
                "relative h-7 w-12 rounded-full transition-colors duration-base",
                notifications ? "bg-pine-700" : "bg-line",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-base",
                  notifications ? "left-[1.375rem]" : "left-0.5",
                )}
              />
            </button>
          </SettingRow>
        </StaggerItem>

        {/* 데이터 모드 / 소스 / AI */}
        <StaggerItem>
          <SettingRow
            icon={Server}
            title="데이터 모드"
            description="현재는 시연용 DEMO 모드입니다. 실제 판매·재고 시스템 연동 시 LIVE로 전환됩니다."
          >
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex h-10 items-center gap-2 rounded-xl border border-sand-400/60 bg-sand-100/70 px-3.5 text-xs font-bold text-sand-600">
                <span className="h-1.5 w-1.5 rounded-full bg-sand-500" />
                DEMO
              </span>
              <span className="inline-flex h-10 items-center rounded-xl border border-dashed border-line bg-ivory-100 px-3.5 text-xs font-medium text-inkmuted">
                LIVE 준비 중
              </span>
            </div>
          </SettingRow>
        </StaggerItem>

        <StaggerItem>
          <SettingRow
            icon={Database}
            title="데이터 소스"
            description="화면의 재고·고객·설치장비 데이터는 mock 파일에서 옵니다. 향후 Supabase 테이블로 교체 예정입니다."
          >
            <div className="text-right">
              <Badge tone="neutral">Mock Data</Badge>
              <p className="num mt-1.5 whitespace-nowrap text-2xs text-inkmuted">
                기준일 2026.08.20
              </p>
            </div>
          </SettingRow>
        </StaggerItem>

        <StaggerItem>
          <SettingRow
            icon={Sparkles}
            title="AI 상태"
            description="추천·설계·예측은 현재 규칙 기반 Preview입니다. 실제 LLM API가 연결되어 있지 않습니다."
          >
            <div className="text-right">
              <Badge tone="success">AI PREVIEW</Badge>
              <p className="mt-1.5 whitespace-nowrap text-2xs text-inkmuted">
                규칙 기반 · API 연결 가능
              </p>
            </div>
          </SettingRow>
        </StaggerItem>

        {/* 저장 데이터 */}
        <StaggerItem>
          <SettingRow
            icon={DatabaseBackup}
            title="저장된 운영 데이터"
            description="발주·견적·고객 요청·활동 기록이 이 기기에 저장되어 있습니다. AX 실증성과의 근거가 되는 값입니다."
          >
            <div className="flex gap-2">
              {[
                { label: "발주", value: orders.length },
                { label: "견적", value: quotes.length },
                { label: "요청", value: requests.length },
                { label: "활동", value: activities.length },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex h-16 w-14 flex-col items-center justify-center rounded-xl border border-line bg-ivory-100"
                >
                  <span className="num text-base font-bold text-pine-900">{s.value}</span>
                  <span className="text-2xs font-medium text-inkmuted">{s.label}</span>
                </div>
              ))}
            </div>
          </SettingRow>
        </StaggerItem>

        {/* 튜토리얼 */}
        <StaggerItem>
          <SettingRow
            icon={GraduationCap}
            title="사용 방법 다시 보기"
            description="첫 방문 시 보여드린 온보딩 안내를 다시 표시합니다."
          >
            <Button variant="secondary" size="md" onClick={replayTutorial}>
              다시 보기
            </Button>
          </SettingRow>
        </StaggerItem>

        {/* 초기화 */}
        <StaggerItem>
          <SettingRow
            icon={DatabaseBackup}
            title="데모 초기화"
            description="글자 크기·테마·역할 설정과 함께 저장된 발주·견적·요청·활동 기록을 모두 지웁니다. 기본 mock 데이터는 영향받지 않습니다."
          >
            <Button
              variant={resetDone ? "secondary" : "outline"}
              size="md"
              onClick={handleReset}
            >
              {resetDone ? (
                <>
                  <Check size={14} /> 초기화 완료
                </>
              ) : (
                "초기화"
              )}
            </Button>
          </SettingRow>
        </StaggerItem>

        {/* 버전 */}
        <StaggerItem>
          <SettingRow
            icon={Info}
            title="버전 정보"
            description="JLAB TECH AX MVP — Industrial Measurement Business AX"
          >
            <div className="text-right">
              <Badge tone="info">v0.3.0 (Customer Platform)</Badge>
              <p className="mt-1.5 whitespace-nowrap text-2xs text-inkmuted">
                미래에이아이랩 &amp; 곽주완
              </p>
            </div>
          </SettingRow>
        </StaggerItem>
      </Stagger>
    </div>
  );
}
