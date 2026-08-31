import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 만원 단위 금액 표기 (예: 1,250만원) */
export function formatManwon(valueManwon: number): string {
  return `${Math.round(valueManwon).toLocaleString("ko-KR")}만원`;
}

/**
 * 큰 금액을 읽기 쉽게 (만원 입력 → 억/만원 자동 전환)
 * 22530 → "2억 2,530만원", 4020 → "4,020만원"
 */
export function formatKrwCompact(valueManwon: number): string {
  const v = Math.round(valueManwon);
  if (Math.abs(v) < 10000) return `${v.toLocaleString("ko-KR")}만원`;
  const eok = Math.floor(v / 10000);
  const rest = v % 10000;
  return rest === 0 ? `${eok}억원` : `${eok}억 ${rest.toLocaleString("ko-KR")}만원`;
}

/** 억 단위 짧은 표기 (예: 2.25억) */
export function formatEokShort(valueManwon: number, digits = 2): string {
  return `${(valueManwon / 10000).toFixed(digits)}억`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/** 날짜 + 시각 (요청 이력용) */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${formatDate(iso)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * 데모 기준일. mock 데이터의 D-day 계산이 실제 오늘 날짜에 따라
 * 흔들리지 않도록 고정한다. 실데이터 연동 시 new Date() 로 교체한다.
 */
export const DEMO_TODAY = new Date("2026-08-20");

/** D-day 표기 (음수면 지남) */
export function dday(iso: string, base = DEMO_TODAY): string {
  const target = new Date(iso);
  const diff = Math.round((target.getTime() - base.getTime()) / 86400000);
  if (diff === 0) return "오늘";
  return diff > 0 ? `D-${diff}` : `${-diff}일 지남`;
}

/** 기준일로부터 남은 일수 */
export function daysLeft(iso: string, base = DEMO_TODAY): number {
  return Math.round((new Date(iso).getTime() - base.getTime()) / 86400000);
}
