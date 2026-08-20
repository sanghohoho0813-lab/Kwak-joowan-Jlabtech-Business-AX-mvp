import {
  LayoutDashboard,
  Boxes,
  Sparkles,
  RefreshCcw,
  Compass,
  GraduationCap,
  Settings,
  ShieldCheck,
  Wrench,
  DraftingCompass,
  FileBarChart,
  Landmark,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const mainNav: NavItem[] = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/inventory", label: "재고·수요 관리", icon: Boxes },
  { href: "/recommend", label: "AI 추천·견적", icon: Sparkles },
  { href: "/repurchase", label: "재구매 예측", icon: RefreshCcw },
];

export const infoNav: NavItem[] = [
  { href: "/intent", label: "기획의도", icon: Compass },
  { href: "/tutorial", label: "튜토리얼", icon: GraduationCap },
  { href: "/settings", label: "설정", icon: Settings },
];

/** 이번 MVP에서는 목차만 노출 — 클릭 불가, "고도화 예정" 배지 */
export const upcomingNav: NavItem[] = [
  { href: "#", label: "마진 가드", icon: ShieldCheck, disabled: true },
  { href: "#", label: "설치장비 관리", icon: Wrench, disabled: true },
  { href: "#", label: "산업계측 설계", icon: DraftingCompass, disabled: true },
  { href: "#", label: "리포트 센터", icon: FileBarChart, disabled: true },
  { href: "#", label: "정책자금 성과 분석", icon: Landmark, disabled: true },
];

export const pageTitles: Record<string, string> = {
  "/": "대시보드",
  "/inventory": "재고·수요 관리",
  "/recommend": "AI 추천·견적",
  "/repurchase": "재구매 예측",
  "/intent": "기획의도",
  "/tutorial": "튜토리얼",
  "/settings": "설정",
};
