"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DraftingCompass,
  Layers,
  FileText,
  RotateCcw,
  Clock,
  Info,
  Minus,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/motion";
import { useStore } from "@/lib/store-context";
import { useToast } from "@/components/ui/toast";
import { repo } from "@/data/repository";
import { cn, formatManwon } from "@/lib/utils";
import type { DesignResult } from "@/data/types";

const {
  designIndustryOptions,
  designTargetOptions,
  designCollectionOptions,
  designEnvironmentOptions,
} = repo.getDesignOptions();

function ChipField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-pine-900">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "h-8 whitespace-nowrap rounded-full border px-3 text-2xs font-semibold transition-all",
              value === opt
                ? "border-pine-700 bg-pine-700 text-white shadow-sm"
                : "border-line bg-ivory-100 text-inkmuted hover:border-pine-100 hover:bg-pine-50 hover:text-pine-700",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DesignPage() {
  const [industry, setIndustry] = useState(designIndustryOptions[0]);
  const [target, setTarget] = useState(designTargetOptions[0]);
  const [collection, setCollection] = useState(designCollectionOptions[0]);
  const [environment, setEnvironment] = useState(designEnvironmentOptions[0]);
  const [pointCount, setPointCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DesignResult | null>(null);

  const { saveQuote } = useStore();
  const toast = useToast();

  const run = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(repo.design({ industry, target, pointCount, collection, environment }));
      setLoading(false);
    }, 850);
  };

  const total = result ? repo.bomTotalManwon(result.bom) : 0;
  const install = result ? Math.max(50, Math.round(total * 0.08)) : 0;
  const grandTotal = total + install;

  const convertToQuote = () => {
    if (!result) return;
    saveQuote({
      customerLabel: `${industry} (${pointCount}포인트)`,
      origin: "산업계측 설계",
      productSummary: result.title,
      totalManwon: grandTotal,
    });
    toast("견적으로 저장되었습니다", `${result.title} · ${formatManwon(grandTotal)}`);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="산업계측 설계"
        description="현장 조건을 입력하면 계측 포인트 구성과 필요 장비 목록, 예상 구축 비용까지 설계안을 산출합니다."
        badge="2단계 고도화"
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* 입력 */}
        <Reveal className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>현장 조건 입력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <ChipField
                label="산업군"
                options={designIndustryOptions}
                value={industry}
                onChange={setIndustry}
              />
              <ChipField
                label="측정 대상"
                options={designTargetOptions}
                value={target}
                onChange={setTarget}
              />

              {/* 포인트 수 */}
              <div>
                <p className="mb-2 text-xs font-semibold text-pine-900">계측 포인트 수</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPointCount((v) => Math.max(1, v - 1))}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-ivory-100 text-inkbody transition-colors hover:border-pine-100 hover:bg-pine-50 hover:text-pine-700"
                    aria-label="포인트 수 감소"
                  >
                    <Minus size={14} />
                  </button>
                  <div className="flex h-9 min-w-[4.5rem] flex-1 items-center justify-center rounded-xl border border-line bg-ivory-50">
                    <span className="num text-sm font-bold text-pine-900">
                      {pointCount}개소
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPointCount((v) => Math.min(60, v + 1))}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-ivory-100 text-inkbody transition-colors hover:border-pine-100 hover:bg-pine-50 hover:text-pine-700"
                    aria-label="포인트 수 증가"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <ChipField
                label="데이터 수집 방식"
                options={designCollectionOptions}
                value={collection}
                onChange={setCollection}
              />
              <ChipField
                label="설치 환경"
                options={designEnvironmentOptions}
                value={environment}
                onChange={setEnvironment}
              />

              <div className="flex gap-2 pt-1">
                <Button className="flex-1" onClick={run} disabled={loading}>
                  <DraftingCompass size={15} />
                  {loading ? "설계 중..." : "설계안 만들기"}
                </Button>
                {result ? (
                  <Button
                    variant="outline"
                    onClick={() => setResult(null)}
                    aria-label="초기화"
                  >
                    <RotateCcw size={14} />
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* 결과 */}
        <div className="xl:col-span-3">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="flex h-64 items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-50 text-pine-700"
                      animate={{ rotate: [0, 8, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                    >
                      <DraftingCompass size={22} />
                    </motion.div>
                    <p className="text-sm font-semibold text-pine-900">
                      계측 구성을 설계하고 있습니다
                    </p>
                    <p className="mt-1 text-xs text-inkmuted">
                      포인트 수와 환경 조건을 반영합니다
                    </p>
                  </div>
                </Card>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                className="space-y-4"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* 설계 개요 */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Badge tone="gold">표준 설계안</Badge>
                        <h3 className="clamp-2 mt-2 text-base font-bold leading-snug text-pine-900">
                          {result.title}
                        </h3>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-2xs text-inkmuted">예상 구축 기간</p>
                        <p className="num inline-flex items-center gap-1 text-sm font-bold text-pine-800">
                          <Clock size={13} /> 약 {result.installWeeks}주
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-inkbody">
                      {result.summary}
                    </p>
                  </CardContent>
                </Card>

                {/* 계측 구성 계층 */}
                <Card>
                  <CardHeader>
                    <CardTitle>계측 구성</CardTitle>
                    <Layers size={15} className="shrink-0 text-inkmuted" />
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {result.layers.map((layer, i) => (
                      <div
                        key={layer.name}
                        className="flex gap-3 rounded-xl border border-line/70 bg-ivory-100/60 p-3 transition-colors hover:border-pine-100 hover:bg-pine-50/40"
                      >
                        <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pine-900 text-2xs font-bold text-sand-400">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="clamp-1 text-xs font-bold text-pine-900">
                            {layer.name.replace(/^\d+\.\s*/, "")}
                          </p>
                          <p className="clamp-2 mt-0.5 text-2xs leading-relaxed text-inkmuted">
                            {layer.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* BOM */}
                <Card>
                  <CardHeader>
                    <CardTitle>필요 장비 구성 (BOM)</CardTitle>
                    <Badge tone="outline">부가세 별도</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto rounded-xl border border-line">
                      <table className="w-full min-w-[34rem] text-left text-xs">
                        <thead>
                          <tr className="border-b border-line bg-ivory-100 text-2xs text-inkmuted">
                            <th className="px-4 py-3 font-medium">품목</th>
                            <th className="px-3 py-3 text-right font-medium">수량</th>
                            <th className="px-3 py-3 text-right font-medium">단가</th>
                            <th className="px-4 py-3 text-right font-medium">금액</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.bom.map((line) => (
                            <tr
                              key={line.model}
                              className="border-b border-line/60 bg-ivory-50 transition-colors last:border-0 hover:bg-pine-50/50"
                            >
                              <td className="max-w-[16rem] px-4 py-3">
                                <p className="clamp-1 font-semibold text-pine-900">
                                  {line.name} ({line.model})
                                </p>
                                <p className="clamp-1 text-2xs text-inkmuted">
                                  {line.role}
                                </p>
                              </td>
                              <td className="num whitespace-nowrap px-3 py-3 text-right">
                                {line.qty}
                              </td>
                              <td className="num whitespace-nowrap px-3 py-3 text-right text-inkmuted">
                                {formatManwon(line.unitPriceManwon)}
                              </td>
                              <td className="num whitespace-nowrap px-4 py-3 text-right font-semibold text-pine-900">
                                {formatManwon(line.qty * line.unitPriceManwon)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <ul className="mt-3 divide-y divide-line/70">
                      {[
                        { label: "장비 합계", value: total },
                        { label: "설치·시운전", value: install },
                      ].map((line) => (
                        <li
                          key={line.label}
                          className="flex items-baseline justify-between gap-3 py-2.5 text-xs"
                        >
                          <span className="font-medium text-inkbody">{line.label}</span>
                          <span className="num shrink-0 font-semibold text-inkbody">
                            {formatManwon(line.value)}
                          </span>
                        </li>
                      ))}
                      <li className="flex items-baseline justify-between gap-3 pt-3">
                        <span className="text-sm font-bold text-pine-900">
                          예상 구축 비용
                        </span>
                        <span className="num shrink-0 text-lg font-bold text-pine-800">
                          {formatManwon(grandTotal)}
                        </span>
                      </li>
                    </ul>

                    <Button variant="secondary" className="mt-3 w-full" onClick={convertToQuote}>
                      <FileText size={14} />
                      이 설계안을 견적으로 저장
                    </Button>
                  </CardContent>
                </Card>

                {/* 설계 참고 */}
                <Card className="border-sand-400/40 bg-sand-100/40">
                  <CardContent className="p-4">
                    <p className="mb-2 flex items-center gap-1.5 text-2xs font-bold text-sand-600">
                      <Info size={13} /> 설계 참고사항
                    </p>
                    <ul className="space-y-1.5">
                      {result.notes.map((note, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-2xs leading-relaxed text-inkbody"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sand-500" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="flex h-64 items-center justify-center border-dashed">
                  <div className="max-w-xs px-6 text-center">
                    <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ivory-200 text-inkmuted">
                      <DraftingCompass size={20} />
                    </span>
                    <p className="text-sm font-semibold text-pine-900">
                      왼쪽에서 현장 조건을 선택하세요
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-inkmuted">
                      산업군·측정 대상·포인트 수만 정하면 계측 구성과 장비 목록,
                      예상 구축 비용을 설계해 드립니다.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
