import React, { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./Chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import styles from "./InitiativesAreaChart.module.css";

export interface ProjectData {
  id: string;
  name: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  ownerName?: string | null;
}

export interface InitiativeData {
  id: string;
  name: string;
  sectorName?: string | null;
  projects: ProjectData[];
}

export interface TeamMemberData {
  id: string;
  name: string;
}

export interface InitiativesAreaChartProps {
  initiatives: InitiativeData[];
  teamMembers: TeamMemberData[];
  onInitiativeClick?: (initiativeId: string) => void;
  className?: string;
}

// Helpers for date boundaries
const getMonthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const getMonthEnd = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "2-digit",
});

const formatMonth = (d: Date) => {
  const parts = monthFormatter.formatToParts(d);
  const m = parts.find((p) => p.type === "month")?.value.replace(".", "") || "";
  const y = parts.find((p) => p.type === "year")?.value || "";
  // Capitalize first letter of the month
  return `${m.charAt(0).toUpperCase() + m.slice(1)} ${y}`;
};

export function InitiativesAreaChart({
  initiatives,
  teamMembers,
  onInitiativeClick,
  className,
}: InitiativesAreaChartProps) {
  const [selectedOwner, setSelectedOwner] = useState<string>("__empty");

  const { chartData, chartConfig, hasData } = useMemo(() => {
    // 1. Filter projects and parse valid dates
    const activeInitiatives = initiatives.map((init) => {
      const validProjects = init.projects
        .filter(
          (p) =>
            selectedOwner === "__empty" || p.ownerName === selectedOwner
        )
        .map((p) => {
          const st = p.startDate ? new Date(p.startDate) : null;
          const ed = p.endDate ? new Date(p.endDate) : null;
          return {
            ...p,
            parsedStart: st || ed,
            parsedEnd: ed || st,
          };
        })
        .filter(
          (p) =>
            p.parsedStart &&
            p.parsedEnd &&
            !isNaN(p.parsedStart.getTime()) &&
            !isNaN(p.parsedEnd.getTime())
        );

      return { ...init, validProjects };
    });

    // 2. Find min and max dates across all valid projects
    let minTime = Infinity;
    let maxTime = -Infinity;

    activeInitiatives.forEach((init) => {
      init.validProjects.forEach((p) => {
        const sTime = p.parsedStart!.getTime();
        const eTime = p.parsedEnd!.getTime();
        if (sTime < minTime) minTime = sTime;
        if (eTime > maxTime) maxTime = eTime;
      });
    });

    const hasData = minTime !== Infinity;

    if (!hasData) {
      return { chartData: [], chartConfig: {}, hasData: false };
    }

    // 3. Generate month intervals
    const startMonth = getMonthStart(new Date(minTime));
    const endMonth = getMonthStart(new Date(maxTime));
    const months: Date[] = [];
    let current = new Date(startMonth);

    while (current <= endMonth) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    // 4. Calculate project counts per month per initiative
    const data = months.map((m) => {
      const mStart = getMonthStart(m).getTime();
      const mEnd = getMonthEnd(m).getTime();
      const point: Record<string, any> = { monthLabel: formatMonth(m) };

      activeInitiatives.forEach((init) => {
        const count = init.validProjects.filter(
          (p) =>
            p.parsedStart!.getTime() <= mEnd &&
            p.parsedEnd!.getTime() >= mStart
        ).length;
        point[init.id] = count;
      });

      return point;
    });

    // 5. Generate chart config for styling and tooltips
    const config: ChartConfig = {};
    activeInitiatives.forEach((init, index) => {
      config[init.id] = {
        label: init.name,
        color: `var(--chart-color-${(index % 5) + 1})`,
      };
    });

    return { chartData: data, chartConfig: config, hasData: true };
  }, [initiatives, selectedOwner]);

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Timeline de Projetos</h3>
        <div className={styles.filter}>
          <span className={styles.filterLabel}>Responsável</span>
          <Select value={selectedOwner} onValueChange={setSelectedOwner}>
            <SelectTrigger className={styles.selectTrigger}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="__empty">Todos</SelectItem>
                {teamMembers.map((tm) => (
                  <SelectItem key={tm.id} value={tm.name}>
                    {tm.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        {hasData ? (
          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="monthLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />
              {initiatives.map((init) => (
                <Area
                  key={init.id}
                  type="monotone"
                  dataKey={init.id}
                  stackId="1"
                  fill={`var(--color-${init.id})`}
                  stroke={`var(--color-${init.id})`}
                  fillOpacity={0.4}
                  className={styles.clickableArea}
                  onClick={() => onInitiativeClick?.(init.id)}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className={styles.emptyState}>
            Sem dados de timeline para exibir.
          </div>
        )}
      </div>
    </div>
  );
}