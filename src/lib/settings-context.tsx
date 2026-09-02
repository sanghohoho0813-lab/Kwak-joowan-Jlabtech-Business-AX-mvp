"use client";

/**
 * 앱 전역 설정 (localStorage 영속)
 * - 글자 크기: html[data-fontsize]
 * - 테마:      html[data-theme]   (globals.css 의 토큰 블록과 연결)
 * - 모션:      html[data-motion]  (reduced 이면 모든 애니메이션 정지)
 * - 역할 미리보기 / 알림 표시
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type FontSize = "small" | "default" | "large";
export type MotionMode = "default" | "reduced";
export type RolePreview = "대표" | "영업·견적" | "재고·운영";

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  /** 미리보기 스와치 — 사이드바 / 캔버스 / 강조 */
  swatch: [string, string, string];
}

export const THEMES: ThemeOption[] = [
  {
    id: "forest-sand",
    name: "Forest Sand",
    description: "아이보리 & 딥그린 · 기본 브랜드",
    swatch: ["#0D3B2E", "#EDEAE0", "#C6A76A"],
  },
  {
    id: "executive-navy",
    name: "Executive Navy",
    description: "네이비 & 브라스 · 보고용 정적인 톤",
    swatch: ["#12283F", "#EBE8DF", "#BC9A5C"],
  },
  {
    id: "teal-champagne",
    name: "Teal Champagne",
    description: "딥틸 & 샴페인 · 계측 장비 느낌",
    swatch: ["#0A3833", "#EDE9DE", "#C9A96D"],
  },
  {
    id: "burgundy-gold",
    name: "Burgundy Gold",
    description: "버건디 & 골드 · 무게감 있는 톤",
    swatch: ["#431722", "#EFE9E0", "#C6A24A"],
  },
  {
    id: "graphite-copper",
    name: "Graphite Copper",
    description: "그래파이트 & 코퍼 · 산업 현장 톤",
    swatch: ["#22272C", "#ECE9E4", "#BE7C4E"],
  },
  {
    id: "indigo-lavender",
    name: "Indigo Lavender",
    description: "인디고 & 라벤더 · 부드러운 대비",
    swatch: ["#212244", "#EDEBE4", "#9D80BD"],
  },
];

const STORAGE_KEY = "jlab-ax-settings-v1";
export const ONBOARDING_KEY = "jlab-ax-onboarding-seen-v1";

interface Settings {
  fontSize: FontSize;
  theme: string;
  motion: MotionMode;
  role: RolePreview;
  notifications: boolean;
  /** 고객 플랫폼에서 "로그인했다고 가정하는" 고객사 — 시연용 전환 */
  customer: string;
}

interface SettingsContextValue extends Settings {
  setCustomer: (id: string) => void;
  setFontSize: (size: FontSize) => void;
  setTheme: (id: string) => void;
  setMotion: (m: MotionMode) => void;
  setRole: (r: RolePreview) => void;
  setNotifications: (on: boolean) => void;
  resetAll: () => void;
}

const defaultSettings: Settings = {
  fontSize: "default",
  theme: "forest-sand",
  motion: "default",
  role: "대표",
  notifications: true,
  customer: "c-01",
};

const SettingsContext = createContext<SettingsContextValue>({
  ...defaultSettings,
  setFontSize: () => {},
  setTheme: () => {},
  setMotion: () => {},
  setRole: () => {},
  setNotifications: () => {},
  setCustomer: () => {},
  resetAll: () => {},
});

function apply(next: Settings) {
  const el = document.documentElement;
  el.setAttribute("data-fontsize", next.fontSize);
  el.setAttribute("data-theme", next.theme);
  el.setAttribute("data-motion", next.motion);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw
        ? ({ ...defaultSettings, ...JSON.parse(raw) } as Settings)
        : defaultSettings;
      setSettings(parsed);
      apply(parsed);
    } catch {
      apply(defaultSettings);
    }
  }, []);

  const persist = useCallback((next: Settings) => {
    setSettings(next);
    apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage 사용 불가 환경에서는 메모리 상태만 유지
    }
  }, []);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ONBOARDING_KEY);
    } catch {}
    apply(defaultSettings);
    setSettings(defaultSettings);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setFontSize: (fontSize) => persist({ ...settings, fontSize }),
        setTheme: (theme) => persist({ ...settings, theme }),
        setMotion: (motion) => persist({ ...settings, motion }),
        setRole: (role) => persist({ ...settings, role }),
        setNotifications: (notifications) => persist({ ...settings, notifications }),
        setCustomer: (customer) => persist({ ...settings, customer }),
        resetAll,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
