"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileBarChart,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  Building2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";
import { repo } from "@/data/repository";
import { cn } from "@/lib/utils";

const reports = repo.getReports();

export default function ReportsPage() {
  const [selectedId, setSelectedId] = useState(reports[0].id);
  const report = reports.find((r) => r.id === selectedId) ?? reports[0];

  return (
    <div className="space-y-5">
      <PageHeader
        title="리포트 센터"
        description="운영 데이터를 경영 보고와 외부 제출에 쓸 수 있는 형태로 정리합니다. 매달 따로 만들 필요가 없습니다."
        badge="2단계 고도화"
      />

      {/* 리포트 선택 */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reports.map((r) => {
          const active = r.id === selectedId;
          return (
            <StaggerItem key={r.id}>
              <button
                type="button"
                onClick={() => setSelectedId(r.id)}
                className={cn(
                  "flex h-32 w-full flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200",
                  active
                    ? "border-pine-700 bg-pine-900 text-white shadow-card-hover"
                    : "border-line bg-ivory-50 shadow-card hover:-translate-y-0.5 hover:border-pine-100 hover:shadow-card-hover",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      active ? "bg-white/10 text-sand-400" : "bg-pine-50 text-pine-700",
                    )}
                  >
                    <FileBarChart size={17} strokeWidth={1.75} />
                  </span>
                  {active ? <Badge tone="gold">선택됨</Badge> : null}
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "clamp-1 text-sm font-bold",
                      active ? "text-white" : "text-pine-900",
                    )}
                  >
                    {r.kind}
                  </p>
                  <p
                    className={cn(
                      "clamp-2 mt-0.5 text-2xs leading-relaxed",
                      active ? "text-white/60" : "text-inkmuted",
                    )}
                  >
                    {r.description}
                  </p>
                </div>
              </button>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* 리포트 미리보기 */}
      <Reveal delay={0.08}>
        <Card>
          <CardHeader>
            <CardTitle>리포트 미리보기</CardTitle>
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <Printer size={14} />
              인쇄 / PDF 저장
            </Button>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-xl border border-line bg-ivory-100/50 p-5 md:p-7"
              >
                {/* 리포트 머리말 */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-2xs font-semibold tracking-[0.12em] text-sand-600">
                      <Building2 size={12} /> JLAB TECH — INDUSTRIAL MEASUREMENT BUSINESS AX
                    </p>
                    <h3 className="clamp-1 mt-1.5 text-lg font-bold text-pine-900">
                      {report.kind}
                    </h3>
                    <p className="clamp-1 text-xs text-inkmuted">대상 기간: {report.period}</p>
                  </div>
                  <Badge tone="neutral">자동 생성</Badge>
                </div>

                {/* 지표 */}
                <div className="grid grid-cols-1 gap-3 py-5 sm:grid-cols-2 xl:grid-cols-4">
                  {report.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="flex h-24 flex-col justify-center rounded-xl border border-line bg-ivory-50 px-4"
                    >
                      <p className="clamp-1 text-2xs text-inkmuted">{m.label}</p>
                      <p className="num clamp-1 mt-1 text-lg font-bold text-pine-900">
                        {m.value}
                      </p>
                      {m.deltaLabel ? (
                        <p
                          className={cn(
                            "num clamp-1 mt-0.5 inline-flex items-center gap-0.5 text-2xs font-semibold",
                            m.positive === false ? "text-red-600" : "text-pine-600",
                          )}
                        >
                          {m.positive === false ? (
                            <ArrowDownRight size={11} />
                          ) : (
                            <ArrowUpRight size={11} />
                          )}
                          {m.deltaLabel}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* 분석 코멘트 */}
                <div className="border-t border-line pt-4">
                  <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold text-pine-900">
                    <Lightbulb size={13} className="text-sand-500" />
                    주요 분석
                  </p>
                  <ul className="space-y-2">
                    {report.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="num mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-pine-50 text-[0.5625rem] font-bold text-pine-700">
                          {i + 1}
                        </span>
                        <span className="text-xs leading-relaxed text-inkbody">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 꼬리말 */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
                  <p className="text-2xs text-inkmuted">
                    본 리포트는 JLAB TECH AX 플랫폼의 운영 데이터를 기반으로 자동
                    생성되었습니다.
                  </p>
                  <p className="num text-2xs text-inkmuted">생성일 2026.08.20</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
