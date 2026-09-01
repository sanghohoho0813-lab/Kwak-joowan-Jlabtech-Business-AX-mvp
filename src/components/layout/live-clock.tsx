"use client";

/**
 * 탑바 실시간 시계 — 날짜 · 요일 · 시:분:초를 매초 갱신한다.
 *
 * 서버 렌더링 시점과 브라우저 시각이 다르면 hydration 경고가 나므로,
 * 첫 렌더는 자리만 잡아 두고 마운트된 뒤부터 실제 시각을 채운다.
 */

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    // 다음 '초'가 바뀌는 순간에 맞춰 시작해 표시가 튀지 않게 한다
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(
      () => {
        setNow(new Date());
        interval = setInterval(() => setNow(new Date()), 1000);
      },
      1000 - new Date().getMilliseconds(),
    );
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  const date = now
    ? `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} (${WEEKDAYS[now.getDay()]})`
    : "----.--.-- (-)";
  const time = now
    ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    : "--:--:--";

  return (
    <div
      className="hidden h-9 shrink-0 items-center gap-2 rounded-xl border border-line bg-ivory-50 px-3 text-xs font-medium text-inkbody min-[1180px]:flex"
      aria-label="현재 날짜와 시각"
    >
      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-pine-700" />
      {/* 좁은 화면에서는 시각만 노출해 탑바가 밀리지 않게 한다 */}
      <span className="num hidden whitespace-nowrap min-[1700px]:inline">{date}</span>
      <span className="num whitespace-nowrap font-semibold text-pine-800">{time}</span>
    </div>
  );
}
