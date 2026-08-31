"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  CartesianGrid,
} from "recharts";
import type { DemandTrendPoint } from "@/data/types";

export function DemandTrendChart({ data }: { data: DemandTrendPoint[] }) {
  const forecastStart = data.find((d) => d.forecast !== null)?.date;
  const last = data[data.length - 1]?.date;

  return (
    <div className="h-56 w-full md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          {forecastStart && last ? (
            <ReferenceArea
              x1={forecastStart}
              x2={last}
              fill="var(--chart-3)"
              fillOpacity={0.07}
              label={{
                value: "예측 구간",
                position: "insideTopRight",
                fontSize: 10,
                fill: "var(--sand-600)",
              }}
            />
          ) : null}
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}천만`}
            width={52}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value.toLocaleString("ko-KR")}만원`,
              name === "actual" ? "실제 출고" : "예측 출고",
            ]}
            labelFormatter={(label) => `${label} 기준`}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--line)",
              background: "var(--ivory-50)",
              fontSize: 12,
              boxShadow: "0 4px 16px rgba(15,30,25,0.08)",
            }}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="var(--chart-1)"
            strokeWidth={2.25}
            dot={{ r: 2.5, fill: "var(--chart-1)", strokeWidth: 0 }}
            activeDot={{ r: 4 }}
            connectNulls={false}
            animationDuration={900}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="var(--chart-3)"
            strokeWidth={2.25}
            strokeDasharray="5 4"
            dot={{ r: 2.5, fill: "var(--chart-3)", strokeWidth: 0 }}
            activeDot={{ r: 4 }}
            connectNulls={false}
            animationDuration={900}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
