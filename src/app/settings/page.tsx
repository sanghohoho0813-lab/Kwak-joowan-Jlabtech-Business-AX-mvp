"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Type,
  Palette,
  Bell,
  GraduationCap,
  DatabaseBackup,
  Info,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { useSettings, ONBOARDING_KEY, type FontSize } from "@/lib/settings-context";
import { cn } from "@/lib/utils";

const fontSizes: { value: FontSize; label: string; sample: string }[] = [
  { value: "small", label: "작게", sample: "가" },
  { value: "default", label: "기본", sample: "가" },
  { value: "large", label: "크게", sample: "가" },
];

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Type;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
            <Icon size={17} strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-pine-900">{title}</p>
            <p className="clamp-2 mt-0.5 text-xs leading-relaxed text-inkmuted">
              {description}
            </p>
          </div>
        </div>
        <div className="shrink-0 sm:pl-4">{children}</div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const { fontSize, setFontSize, notifications, setNotifications, resetAll } =
    useSettings();
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
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="설정"
        description="화면 표시와 알림, 데이터를 관리합니다. 설정은 이 기기에 저장되어 새로고침해도 유지됩니다."
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
                    "flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-xl border transition-all",
                    fontSize === size.value
                      ? "border-pine-700 bg-pine-700 text-white shadow-md"
                      : "border-line bg-ivory-100 text-inkmuted hover:border-pine-100 hover:bg-pine-50 hover:text-pine-700",
                  )}
                >
                  <span
                    className="font-bold leading-none"
                    style={{ fontSize: `${0.8 + i * 0.2}rem` }}
                  >
                    {size.sample}
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
            description="아이보리 & 딥그린 테마가 기본입니다. 추가 테마는 고도화 단계에서 제공됩니다."
          >
            <div className="flex items-center gap-2">
              <span className="flex h-9 items-center gap-2 rounded-xl border border-pine-700 bg-pine-50 px-3 text-xs font-semibold text-pine-700">
                <span className="flex gap-1">
                  <span className="h-3.5 w-3.5 rounded-full bg-pine-900 ring-1 ring-black/5" />
                  <span className="h-3.5 w-3.5 rounded-full bg-ivory-300 ring-1 ring-black/10" />
                  <span className="h-3.5 w-3.5 rounded-full bg-sand-500 ring-1 ring-black/5" />
                </span>
                아이보리 &amp; 딥그린
                <Check size={13} />
              </span>
              <Badge tone="outline">추가 테마 예정</Badge>
            </div>
          </SettingRow>
        </StaggerItem>

        {/* 알림 */}
        <StaggerItem>
          <SettingRow
            icon={Bell}
            title="알림 표시"
            description="재고 부족, 재구매 시점 등 알림 배지 표시 여부를 설정합니다. (데모)"
          >
            <button
              type="button"
              role="switch"
              aria-checked={notifications}
              onClick={() => setNotifications(!notifications)}
              className={cn(
                "relative h-7 w-12 rounded-full transition-colors duration-300",
                notifications ? "bg-pine-700" : "bg-line",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-300",
                  notifications ? "left-[1.375rem]" : "left-0.5",
                )}
              />
            </button>
          </SettingRow>
        </StaggerItem>

        {/* 튜토리얼 */}
        <StaggerItem>
          <SettingRow
            icon={GraduationCap}
            title="튜토리얼 다시 보기"
            description="첫 방문 시 보여드린 온보딩 안내를 다시 표시합니다."
          >
            <Button variant="secondary" size="sm" onClick={replayTutorial}>
              다시 보기
            </Button>
          </SettingRow>
        </StaggerItem>

        {/* 데이터 초기화 */}
        <StaggerItem>
          <SettingRow
            icon={DatabaseBackup}
            title="데이터 초기화"
            description="글자 크기, 알림, 온보딩 등 이 기기에 저장된 설정을 기본값으로 되돌립니다. (mock 데이터는 영향 없음)"
          >
            <Button
              variant={resetDone ? "secondary" : "outline"}
              size="sm"
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

        {/* 버전 정보 */}
        <StaggerItem>
          <SettingRow
            icon={Info}
            title="버전 정보"
            description="JLAB TECH AX MVP — Industrial Measurement Business AX"
          >
            <div className="text-right">
              <Badge tone="info">v0.1.0 (MVP Demo)</Badge>
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
