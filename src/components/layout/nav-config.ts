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
  /** 아이콘 전용 강조색 — 딥그린 배경 위에서 구분되도록 채도를 낮춘 톤만 사용한다 */
  tint: string;
  disabled?: boolean;
}

/** 사이드바 아이콘 팔레트 (저채도 · 브랜드 톤 유지) */
export const tint = {
  gold: "#E0C68A",
  mint: "#8FCBAE",
  sage: "#AFBEAD",
  steel: "#9EC0D2",
  clay: "#D9AE93",
  muted: "#B4BEB8",
} as const;

/** 일일 운영 흐름 */
export const operationNav: NavItem[] = [
  { href: "/", label: "대시보드", icon: LayoutDashboard, tint: tint.gold },
  { href: "/inventory", label: "재고·수요 관리", icon: Boxes, tint: tint.mint },
  { href: "/recommend", label: "AI 추천·견적", icon: Sparkles, tint: tint.steel },
  { href: "/repurchase", label: "재구매 예측", icon: RefreshCcw, tint: tint.clay },
];

/** 수익·자산 관리 (2단계 고도화) */
export const assetNav: NavItem[] = [
  { href: "/margin", label: "마진 가드", icon: ShieldCheck, tint: tint.gold },
  { href: "/installed", label: "설치장비 관리", icon: Wrench, tint: tint.steel },
  { href: "/design", label: "산업계측 설계", icon: DraftingCompass, tint: tint.mint },
];

/** 분석·성과 (2단계 고도화) */
export const analysisNav: NavItem[] = [
  { href: "/reports", label: "리포트 센터", icon: FileBarChart, tint: tint.clay },
  { href: "/policy", label: "정책자금 성과 분석", icon: Landmark, tint: tint.gold },
];

export const infoNav: NavItem[] = [
  { href: "/intent", label: "기획의도", icon: Compass, tint: tint.sage },
  { href: "/tutorial", label: "튜토리얼", icon: GraduationCap, tint: tint.mint },
  { href: "/settings", label: "설정", icon: Settings, tint: tint.muted },
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
  { href: "#", label: "고객 데이터 포털", icon: Compass, tint: tint.muted, disabled: true },
  { href: "#", label: "예지보전 분석", icon: ShieldCheck, tint: tint.muted, disabled: true },
];
