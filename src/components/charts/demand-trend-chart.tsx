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
          <CartesianGrid strokeDasharray="3 3" stroke="#EAE6D8" vertical={false} />
          {forecastStart && last ? (
            <ReferenceArea
              x1={forecastStart}
              x2={last}
              fill="#C6A76A"
              fillOpacity={0.07}
              label={{
                value: "예측 구간",
                position: "insideTopRight",
                fontSize: 10,
                fill: "#A8853F",
              }}
            />
          ) : null}
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}억`}
            width={52}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value}억원`,
              name === "actual" ? "실제 수요" : "예측 수요",
            ]}
            labelFormatter={(label) => `${label} 기준`}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #E6E1D3",
              background: "#FDFCF8",
              fontSize: 12,
              boxShadow: "0 4px 16px rgba(13,59,46,0.08)",
            }}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#145C44"
            strokeWidth={2.25}
            dot={{ r: 2.5, fill: "#145C44", strokeWidth: 0 }}
            activeDot={{ r: 4 }}
            connectNulls={false}
            animationDuration={900}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#C6A76A"
            strokeWidth={2.25}
            strokeDasharray="5 4"
            dot={{ r: 2.5, fill: "#C6A76A", strokeWidth: 0 }}
            activeDot={{ r: 4 }}
            connectNulls={false}
            animationDuration={900}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
