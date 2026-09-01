"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  operationNav,
  assetNav,
  analysisNav,
  infoNav,
  upcomingNav,
  type NavItem,
} from "./nav-config";
import { Ruler, Users, ArrowUpRight } from "lucide-react";

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <div
        className="flex h-9 cursor-not-allowed items-center gap-3 rounded-xl px-3 text-sm text-white/30"
        aria-disabled
        title="다음 단계에서 확장 예정인 기능입니다"
      >
        <Icon className="h-4 w-4 shrink-0 opacity-40" strokeWidth={1.75} style={{ color: item.tint }} />
        <span className="clamp-1 flex-1">{item.label}</span>
        <span className="inline-flex h-5 shrink-0 items-center rounded-full border border-sand-500/30 px-1.5 text-[0.625rem] font-medium leading-none text-sand-400/70">
          예정
        </span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex h-9 items-center gap-3 rounded-xl px-3 text-sm transition-all duration-200",
        active
          ? "bg-white/12 font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          : "text-white hover:bg-white/8 hover:pl-3.5",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-opacity duration-200",
          active ? "opacity-100" : "opacity-70 group-hover:opacity-100",
        )}
        strokeWidth={1.75}
        style={{ color: item.tint }}
      />
      <span className="clamp-1">{item.label}</span>
      {active ? (
        <span
          className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: item.tint }}
        />
      ) : null}
    </Link>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="px-3 pb-1.5 pt-4 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/55">
      {children}
    </p>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* 브랜드 */}
      <Link
        href="/"
        onClick={onNavigate}
        className="block px-4 pb-4 pt-6 transition-opacity hover:opacity-90"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <Ruler className="h-[1.375rem] w-[1.375rem] text-sand-400" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="text-lg font-bold leading-tight tracking-tight text-white">
              제이랩테크(주)
            </p>
            <p className="text-[0.6875rem] font-semibold leading-tight tracking-[0.05em] text-white/50">
              JLAB TECH
            </p>
          </div>
        </div>

        {/* 사업 정체성 — 잘리지 않게 두 줄로 명확히 */}
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5">
          <p className="text-[0.6875rem] font-medium leading-snug text-white/55">
            Industrial Measurement
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-bold leading-tight tracking-wide text-sand-400">
              Business AX
            </p>
            <span className="inline-flex h-[1.125rem] shrink-0 items-center rounded-md bg-sand-500/20 px-1.5 text-[0.625rem] font-bold leading-none tracking-wider text-sand-400 ring-1 ring-sand-500/25">
              MVP
            </span>
          </div>
        </div>
      </Link>

      {/* 내비게이션 */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        <SectionLabel>운영</SectionLabel>
        {operationNav.map((item) => (
          <NavLink key={item.label} item={item} onNavigate={onNavigate} />
        ))}

        <SectionLabel>수익·자산 관리</SectionLabel>
        {assetNav.map((item) => (
          <NavLink key={item.label} item={item} onNavigate={onNavigate} />
        ))}

        <SectionLabel>분석·성과</SectionLabel>
        {analysisNav.map((item) => (
          <NavLink key={item.label} item={item} onNavigate={onNavigate} />
        ))}

        <SectionLabel>안내</SectionLabel>
        {infoNav.map((item) => (
          <NavLink key={item.label} item={item} onNavigate={onNavigate} />
        ))}

        <SectionLabel>3단계 검토</SectionLabel>
        {upcomingNav.map((item) => (
          <NavLink key={item.label} item={item} />
        ))}
      </nav>

      {/* 고객 플랫폼 전환 — 시연용 Surface Switcher */}
      <div className="px-3 pb-2">
        <Link
          href="/customer"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.07] px-3 py-2.5 transition-colors duration-fast hover:bg-white/12"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sand-500/20 text-sand-400">
            <Users size={16} strokeWidth={1.9} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-white">
              고객 화면으로 전환
            </span>
            <span className="block truncate text-[0.625rem] text-white/45">
              고객이 보는 화면 · 시연용
            </span>
          </span>
          <ArrowUpRight size={14} className="shrink-0 text-white/40" />
        </Link>
      </div>

      {/* 하단 서명 */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand-500/20 text-sm font-bold text-sand-400">
            박
          </div>
          <div className="min-w-0">
            <p className="clamp-1 text-[1.1rem] font-semibold leading-tight text-white">
              박지훈 대표님
            </p>
            <p className="clamp-2 mt-0.5 text-[0.65rem] leading-snug text-white/40">
              Planned &amp; Built by
              <br />
              미래에이아이랩 &amp; 곽주완
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-pine-900 shadow-sidebar lg:block">
      <SidebarContent />
    </aside>
  );
}
