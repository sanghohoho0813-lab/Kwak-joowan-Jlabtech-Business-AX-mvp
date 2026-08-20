"use client";

/**
 * 앱 전역 설정 (localStorage 영속)
 * - 글자 크기: html[data-fontsize] 속성으로 적용 → rem 기반 전체 스케일 조정
 * - 알림 표시, 튜토리얼(온보딩) 노출 여부
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

const STORAGE_KEY = "jlab-ax-settings-v1";
export const ONBOARDING_KEY = "jlab-ax-onboarding-seen-v1";

interface Settings {
  fontSize: FontSize;
  notifications: boolean;
}

interface SettingsContextValue extends Settings {
  setFontSize: (size: FontSize) => void;
  setNotifications: (on: boolean) => void;
  resetAll: () => void;
}

const defaultSettings: Settings = {
  fontSize: "default",
  notifications: true,
};

const SettingsContext = createContext<SettingsContextValue>({
  ...defaultSettings,
  setFontSize: () => {},
  setNotifications: () => {},
  resetAll: () => {},
});

function applyFontSize(size: FontSize) {
  document.documentElement.setAttribute("data-fontsize", size);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = { ...defaultSettings, ...JSON.parse(raw) } as Settings;
        setSettings(parsed);
        applyFontSize(parsed.fontSize);
      }
    } catch {
      // 저장값이 손상된 경우 기본값 유지
    }
  }, []);

  const persist = useCallback((next: Settings) => {
    setSettings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage 사용 불가 환경에서는 메모리 상태만 유지
    }
  }, []);

  const setFontSize = useCallback(
    (fontSize: FontSize) => {
      applyFontSize(fontSize);
      persist({ ...settings, fontSize });
    },
    [settings, persist],
  );

  const setNotifications = useCallback(
    (notifications: boolean) => persist({ ...settings, notifications }),
    [settings, persist],
  );

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ONBOARDING_KEY);
    } catch {}
    applyFontSize("default");
    setSettings(defaultSettings);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ ...settings, setFontSize, setNotifications, resetAll }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
