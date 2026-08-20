import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 억 단위 원화 표기 (예: 48.7억) */
export function formatEok(valueEok: number, digits = 1): string {
  return `${valueEok.toFixed(digits)}억`;
}

/** 만원 단위 금액 표기 (예: 1,250만원) */
export function formatManwon(valueManwon: number): string {
  return `${valueManwon.toLocaleString("ko-KR")}만원`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/** D-day 표기 (음수면 지남) */
export function dday(iso: string, base = new Date("2026-08-20")): string {
  const target = new Date(iso);
  const diff = Math.round((target.getTime() - base.getTime()) / 86400000);
  if (diff === 0) return "오늘";
  return diff > 0 ? `D-${diff}` : `${-diff}일 지남`;
}
