"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav, infoNav, upcomingNav, type NavItem } from "./nav-config";
import { Ruler } from "lucide-react";

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <div
        className="flex h-10 cursor-not-allowed items-center gap-3 rounded-xl px-3 text-sm text-white/35"
        aria-disabled
        title="고도화 예정 기능입니다"
      >
        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        <span className="clamp-1 flex-1">{item.label}</span>
        <span className="inline-flex h-5 shrink-0 items-center rounded-full border border-sand-500/40 px-1.5 text-[0.625rem] font-medium leading-none text-sand-400">
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
        "group flex h-10 items-center gap-3 rounded-xl px-3 text-sm transition-all duration-200",
        active
          ? "bg-white/12 font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          : "text-white/65 hover:bg-white/8 hover:pl-3.5 hover:text-white",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          active ? "text-sand-400" : "text-white/50 group-hover:text-sand-400",
        )}
        strokeWidth={1.75}
      />
      <span className="clamp-1">{item.label}</span>
      {active ? (
        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-sand-400" />
      ) : null}
    </Link>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="px-3 pb-2 pt-5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/35">
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
        className="flex items-center gap-3 px-4 pb-5 pt-6"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
          <Ruler className="h-5 w-5 text-sand-400" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold tracking-tight text-white">JLAB TECH</p>
          <p className="clamp-1 text-[0.625rem] font-medium tracking-wide text-white/45">
            Industrial Measurement Business AX
          </p>
        </div>
      </Link>

      {/* 내비게이션 */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {mainNav.map((item) => (
          <NavLink key={item.label} item={item} onNavigate={onNavigate} />
        ))}

        <SectionLabel>고도화 예정</SectionLabel>
        {upcomingNav.map((item) => (
          <NavLink key={item.label} item={item} />
        ))}

        <SectionLabel>안내</SectionLabel>
        {infoNav.map((item) => (
          <NavLink key={item.label} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* 하단 서명 */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand-500/20 text-xs font-bold text-sand-400">
            J
          </div>
          <div className="min-w-0">
            <p className="clamp-1 text-sm font-semibold text-white">대표자님</p>
            <p className="clamp-1 text-[0.625rem] text-white/40">
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
