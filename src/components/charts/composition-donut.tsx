"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { CompositionSlice } from "@/data/types";

interface Props {
  data: CompositionSlice[];
  centerLabel?: string;
  centerValue?: string;
}

export function CompositionDonut({ data, centerLabel, centerValue }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value: number, name: string) => [`${value}%`, name]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E6E1D3",
                background: "#FDFCF8",
                fontSize: 12,
              }}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={54}
              outerRadius={80}
              paddingAngle={2}
              strokeWidth={0}
              animationDuration={800}
            >
              {data.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {centerValue ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xs text-inkmuted">{centerLabel}</p>
            <p className="num text-base font-bold text-pine-900">{centerValue}</p>
          </div>
        ) : null}
      </div>

      <ul className="w-full min-w-0 max-w-[12rem] space-y-2">
        {data.map((slice) => (
          <li key={slice.name} className="flex items-center gap-2.5 text-xs">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: slice.color }}
            />
            <span className="clamp-1 flex-1 text-inkbody">{slice.name}</span>
            <span className="num shrink-0 font-semibold text-pine-900">
              {slice.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
