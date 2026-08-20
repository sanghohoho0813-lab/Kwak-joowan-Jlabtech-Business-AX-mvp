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

/** 일일 운영 흐름 */
export const operationNav: NavItem[] = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/inventory", label: "재고·수요 관리", icon: Boxes },
  { href: "/recommend", label: "AI 추천·견적", icon: Sparkles },
  { href: "/repurchase", label: "재구매 예측", icon: RefreshCcw },
];

/** 수익·자산 관리 (2단계 고도화) */
export const assetNav: NavItem[] = [
  { href: "/margin", label: "마진 가드", icon: ShieldCheck },
  { href: "/installed", label: "설치장비 관리", icon: Wrench },
  { href: "/design", label: "산업계측 설계", icon: DraftingCompass },
];

/** 분석·성과 (2단계 고도화) */
export const analysisNav: NavItem[] = [
  { href: "/reports", label: "리포트 센터", icon: FileBarChart },
  { href: "/policy", label: "정책자금 성과 분석", icon: Landmark },
];

export const infoNav: NavItem[] = [
  { href: "/intent", label: "기획의도", icon: Compass },
  { href: "/tutorial", label: "튜토리얼", icon: GraduationCap },
  { href: "/settings", label: "설정", icon: Settings },
];

export const allNavItems = [...operationNav, ...assetNav, ...analysisNav, ...infoNav];

export const pageTitles: Record<string, string> = {
  "/": "대시보드",
  "/inventory": "재고·수요 관리",
  "/recommend": "AI 추천·견적",
  "/repurchase": "재구매 예측",
  "/margin": "마진 가드",
  "/installed": "설치장비 관리",
  "/design": "산업계측 설계",
  "/reports": "리포트 센터",
  "/policy": "정책자금 성과 분석",
  "/intent": "기획의도",
  "/tutorial": "튜토리얼",
  "/settings": "설정",
};

/** 3단계에서 확장 예정 — 목차로만 노출 */
export const upcomingNav: NavItem[] = [
  { href: "#", label: "고객 데이터 포털", icon: Compass, disabled: true },
  { href: "#", label: "예지보전 분석", icon: ShieldCheck, disabled: true },
];
