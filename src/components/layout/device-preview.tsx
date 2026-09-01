"use client";

/**
 * 영업 시연용 기기 미리보기.
 *
 * 현재 화면(또는 고객 플랫폼)을 모바일 프레임 안에서 보여준다.
 * 미리보기 안에서 다시 미리보기를 여는 재귀를 막기 위해
 * iframe URL 에 ?preview=1 을 붙이고, 그 값이 있으면 버튼 자체를 숨긴다.
 */

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Smartphone, X, RotateCcw, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const DEVICES = [
  { id: "375", label: "iPhone SE", w: 375, h: 667 },
  { id: "430", label: "iPhone Pro Max", w: 430, h: 800 },
] as const;

export function DevicePreview({ isPreview }: { isPreview: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("430");
  const [surface, setSurface] = useState<"current" | "customer">("current");
  const [reloadKey, setReloadKey] = useState(0);

  // 미리보기 안에서는 버튼을 아예 렌더하지 않는다 (재귀 방지)
  if (isPreview) return null;

  const target = surface === "customer" ? "/customer" : pathname || "/";
  const src = `${target}${target.includes("?") ? "&" : "?"}preview=1`;
  const d = DEVICES.find((x) => x.id === device) ?? DEVICES[1];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="모바일 보기"
        title="모바일 화면 미리보기 (시연용)"
        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-ivory-50 text-xs font-semibold text-inkbody transition-colors duration-fast hover:border-pine-100 hover:bg-pine-50 hover:text-pine-700 lg:flex"
      >
        <Smartphone size={15} strokeWidth={1.9} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-pine-950/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="flex max-h-[92dvh] w-full max-w-3xl flex-col rounded-2xl bg-ivory-50 shadow-card-hover"
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3.5">
                <p className="text-sm font-bold text-pine-900">모바일 미리보기</p>

                <div className="ml-auto flex flex-wrap items-center gap-1.5">
                  {/* Surface */}
                  <button
                    type="button"
                    onClick={() =>
                      setSurface((v) => (v === "current" ? "customer" : "current"))
                    }
                    className={cn(
                      "flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-2xs font-semibold transition-colors duration-fast",
                      surface === "customer"
                        ? "border-pine-700 bg-pine-700 text-white"
                        : "border-line bg-ivory-100 text-inkmuted hover:text-pine-700",
                    )}
                  >
                    <Users size={13} />
                    고객 플랫폼
                  </button>

                  {/* 기기 */}
                  {DEVICES.map((dev) => (
                    <button
                      key={dev.id}
                      type="button"
                      onClick={() => setDevice(dev.id)}
                      className={cn(
                        "h-8 whitespace-nowrap rounded-lg border px-2.5 text-2xs font-semibold transition-colors duration-fast",
                        device === dev.id
                          ? "border-pine-700 bg-pine-50 text-pine-700"
                          : "border-line bg-ivory-100 text-inkmuted hover:text-pine-700",
                      )}
                    >
                      {dev.w}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setReloadKey((k) => k + 1)}
                    aria-label="새로고침"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-ivory-100 text-inkmuted transition-colors duration-fast hover:text-pine-700"
                  >
                    <RotateCcw size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="닫기"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-inkmuted transition-colors duration-fast hover:bg-ivory-200 hover:text-pine-700"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* 기기 프레임 */}
              <div className="flex flex-1 justify-center overflow-auto bg-ivory-200/60 p-5">
                <div
                  className="shrink-0 overflow-hidden rounded-[1.75rem] border-[10px] border-pine-950 bg-ivory-300 shadow-card-hover"
                  style={{ width: d.w, height: d.h }}
                >
                  <iframe
                    key={`${src}-${reloadKey}`}
                    src={src}
                    title="모바일 미리보기"
                    className="h-full w-full border-0"
                  />
                </div>
              </div>

              <p className="border-t border-line px-5 py-3 text-2xs text-inkmuted">
                {d.label} · {d.w}×{d.h} · 시연용 미리보기입니다. 미리보기 안에서는 이
                버튼이 다시 나타나지 않습니다.
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
