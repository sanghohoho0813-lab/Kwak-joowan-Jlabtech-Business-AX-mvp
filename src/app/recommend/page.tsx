"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  PackagePlus,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/motion";
import { repo } from "@/data/repository";
import { cn, formatManwon } from "@/lib/utils";
import type { RecommendedProduct, QuoteLine } from "@/data/types";

const { industryOptions, purposeOptions, environmentOptions, budgetOptions } =
  repo.getRecommendOptions();

interface FieldProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

function ChipField({ label, options, value, onChange }: FieldProps) {
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

export default function RecommendPage() {
  const [industry, setIndustry] = useState(industryOptions[0]);
  const [purpose, setPurpose] = useState(purposeOptions[0]);
  const [environment, setEnvironment] = useState(environmentOptions[0]);
  const [budget, setBudget] = useState(budgetOptions[1]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendedProduct[] | null>(null);
  const [quote, setQuote] = useState<QuoteLine[] | null>(null);

  const run = () => {
    setLoading(true);
    setResults(null);
    setQuote(null);
    // 분석하는 느낌을 위한 짧은 지연 (mock)
    setTimeout(() => {
      const rec = repo.recommend({ industry, purpose, environment, budget });
      setResults(rec);
      setQuote(repo.buildQuote(rec));
      setLoading(false);
    }, 900);
  };

  const reset = () => {
    setResults(null);
    setQuote(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI 추천·견적"
        description="고객 상황을 입력하면 적합한 계측 장비와 함께 제안할 소모품, 예상 견적 흐름을 제안합니다."
        badge="규칙 기반 데모"
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* 입력 패널 */}
        <Reveal className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>고객 상황 입력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <ChipField
                label="고객 업종"
                options={industryOptions}
                value={industry}
                onChange={setIndustry}
              />
              <ChipField
                label="측정 목적"
                options={purposeOptions}
                value={purpose}
                onChange={setPurpose}
              />
              <ChipField
                label="설치 환경"
                options={environmentOptions}
                value={environment}
                onChange={setEnvironment}
              />
              <ChipField
                label="예산 범위"
                options={budgetOptions}
                value={budget}
                onChange={setBudget}
              />
              <div className="flex gap-2 pt-1">
                <Button className="flex-1" onClick={run} disabled={loading}>
                  <Sparkles size={15} />
                  {loading ? "분석 중..." : "추천 받기"}
                </Button>
                {results ? (
                  <Button variant="outline" onClick={reset} aria-label="초기화">
                    <RotateCcw size={14} />
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* 결과 패널 */}
        <div className="space-y-4 xl:col-span-3">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="flex h-64 items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-50 text-pine-700"
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    >
                      <Sparkles size={22} />
                    </motion.div>
                    <p className="text-sm font-semibold text-pine-900">
                      고객 조건을 분석하고 있습니다
                    </p>
                    <p className="mt-1 text-xs text-inkmuted">
                      보유 재고와 구매 이력을 함께 검토합니다
                    </p>
                  </div>
                </Card>
              </motion.div>
            ) : results ? (
              <motion.div
                key="results"
                className="space-y-4"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* 추천 카드 */}
                {results.map((product, idx) => (
                  <Card
                    key={product.itemId}
                    className="overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {idx === 0 ? <Badge tone="gold">최적 추천</Badge> : null}
                            <Badge tone="success">적합도 {product.matchScore}%</Badge>
                          </div>
                          <h3 className="clamp-1 mt-2 text-base font-bold text-pine-900">
                            {product.name}{" "}
                            <span className="text-sm font-medium text-inkmuted">
                              {product.model}
                            </span>
                          </h3>
                        </div>
                        <p className="num shrink-0 text-base font-bold text-pine-800">
                          {formatManwon(product.priceManwon)}
                        </p>
                      </div>

                      <ul className="mt-3 space-y-1.5">
                        {product.reasons.map((reason, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-inkbody">
                            <CheckCircle2
                              size={14}
                              className="mt-0.5 shrink-0 text-pine-600"
                            />
                            <span className="clamp-2 leading-relaxed">{reason}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 rounded-xl border border-line bg-ivory-100/70 p-3">
                        <p className="mb-2 flex items-center gap-1.5 text-2xs font-bold text-sand-600">
                          <PackagePlus size={13} /> 함께 제안하면 좋은 품목
                        </p>
                        <ul className="space-y-1">
                          {product.accessories.map((acc) => (
                            <li
                              key={acc.name}
                              className="flex items-baseline justify-between gap-3 text-2xs"
                            >
                              <span className="clamp-1 text-inkbody">{acc.name}</span>
                              <span className="num shrink-0 font-semibold text-inkbody">
                                {formatManwon(acc.priceManwon)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* 견적 흐름 */}
                {quote ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>예상 견적 흐름</CardTitle>
                      <Badge tone="outline">부가세 별도</Badge>
                    </CardHeader>
                    <CardContent>
                      <ul className="divide-y divide-line/70">
                        {quote.map((line, i) => {
                          const isTotal = i === quote.length - 1;
                          return (
                            <li
                              key={line.label}
                              className={cn(
                                "flex items-baseline justify-between gap-3 py-2.5",
                                isTotal && "pt-3",
                              )}
                            >
                              <div className="min-w-0">
                                <p
                                  className={cn(
                                    "clamp-1 text-xs",
                                    isTotal
                                      ? "text-sm font-bold text-pine-900"
                                      : "font-medium text-inkbody",
                                  )}
                                >
                                  {line.label}
                                </p>
                                {line.note ? (
                                  <p className="clamp-1 text-2xs text-inkmuted">{line.note}</p>
                                ) : null}
                              </div>
                              <p
                                className={cn(
                                  "num shrink-0",
                                  isTotal
                                    ? "text-lg font-bold text-pine-800"
                                    : line.amountManwon < 0
                                      ? "text-xs font-semibold text-red-600"
                                      : "text-xs font-semibold text-inkbody",
                                )}
                              >
                                {line.amountManwon < 0 ? "−" : ""}
                                {formatManwon(Math.abs(line.amountManwon))}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                      <Button variant="secondary" size="sm" className="mt-3 w-full">
                        <FileText size={14} />
                        견적서 초안 만들기 (데모)
                      </Button>
                    </CardContent>
                  </Card>
                ) : null}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="flex h-64 items-center justify-center border-dashed">
                  <div className="max-w-xs px-6 text-center">
                    <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ivory-200 text-inkmuted">
                      <Sparkles size={20} />
                    </span>
                    <p className="text-sm font-semibold text-pine-900">
                      왼쪽에서 고객 상황을 선택하세요
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-inkmuted">
                      업종·목적·환경·예산 4가지만 고르면 추천 장비와 예상 견적
                      흐름을 바로 제안합니다.
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
