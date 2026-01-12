import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { day: "Seg", occ: 62 },
  { day: "Ter", occ: 70 },
  { day: "Qua", occ: 78 },
  { day: "Qui", occ: 74 },
  { day: "Sex", occ: 86 },
  { day: "Sáb", occ: 58 },
  { day: "Dom", occ: 40 },
];

export function OccupancyChartCard() {
  return (
    <Card className="border/60 shadow-sm">
      <CardContent className="p-4">
        <div className="text-sm font-semibold">Ocupação na semana</div>
        <div className="text-xs text-muted-foreground">Percentual por dia</div>

        <div className="mt-4 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -10, right: 10 }}>
              <defs>
                <linearGradient id="occ" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--brand))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--brand))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={28} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="occ"
                stroke="hsl(var(--brand))"
                fill="url(#occ)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
