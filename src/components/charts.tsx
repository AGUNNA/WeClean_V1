import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const naira = (n: number) =>
  "₦" + (n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`);

/** Area chart for a revenue-over-time series ([{ month, revenue }]). */
export function RevenueAreaChart({
  data,
  color = "hsl(217 91% 60%)",
  className = "h-[240px] w-full",
}: {
  data: { month: string; revenue: number }[];
  color?: string;
  className?: string;
}) {
  const config = {
    revenue: { label: "Revenue", color },
  } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className={className}>
      <AreaChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(v) => naira(Number(v))}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="revenue"
          type="monotone"
          stroke="var(--color-revenue)"
          fill="var(--color-revenue)"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

/** Simple vertical bar chart for any numeric series. */
export function SeriesBarChart({
  data,
  xKey,
  dataKey,
  label,
  color = "hsl(160 84% 39%)",
  className = "h-[240px] w-full",
}: {
  data: Record<string, string | number>[];
  xKey: string;
  dataKey: string;
  label: string;
  color?: string;
  className?: string;
}) {
  const config = {
    [dataKey]: { label, color },
  } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className={className}>
      <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={6} />
      </BarChart>
    </ChartContainer>
  );
}

const STATUS_PALETTE = [
  "hsl(217 91% 60%)",
  "hsl(160 84% 39%)",
  "hsl(38 92% 50%)",
  "hsl(280 65% 60%)",
  "hsl(0 84% 60%)",
  "hsl(199 89% 48%)",
  "hsl(24 95% 53%)",
  "hsl(340 82% 60%)",
];

/** Horizontal-ish status distribution from a { [status]: count } map. */
export function StatusBarChart({
  counts,
  className = "h-[240px] w-full",
}: {
  counts: Record<string, number>;
  className?: string;
}) {
  const data = Object.entries(counts).map(([status, count], i) => ({
    status: status.replace(/_/g, " "),
    count,
    fill: STATUS_PALETTE[i % STATUS_PALETTE.length],
  }));
  const config = { count: { label: "Bookings" } } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className={className}>
      <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="status"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          angle={-25}
          textAnchor="end"
          height={60}
          fontSize={10}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" radius={6}>
          {data.map((d) => (
            <Cell key={d.status} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
