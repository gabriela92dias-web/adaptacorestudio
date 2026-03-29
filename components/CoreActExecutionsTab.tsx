import React, { useState, useMemo } from "react";
import { Calendar as CalendarIcon, Clock, Activity, CheckCircle2, User } from "lucide-react";
import { useExecutions, useTeamMembers } from "../helpers/useCoreActApi";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";
import { Calendar } from "./Calendar";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { Badge } from "./Badge";
import styles from "./CoreActExecutionsTab.module.css";

const formatDateTime = (date: Date | string) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
};

const formatDuration = (minutes: number | null | undefined) => {
  if (minutes == null) return "-";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const statusMap: Record<string, { label: string; variant: "secondary" | "warning" | "success" | "primary" }> = {
  in_progress: { label: "Em andamento", variant: "warning" },
  paused: { label: "Pausada", variant: "secondary" },
  completed: { label: "Concluída", variant: "success" },
};

const DatePicker = ({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value?: Date | null; 
  onChange: (d?: Date) => void;
  placeholder: string;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" style={{ width: "100%", justifyContent: "flex-start", fontWeight: "normal" }}>
        <CalendarIcon size={16} />
        {value ? new Intl.DateTimeFormat("pt-BR").format(value) : <span style={{ color: "var(--muted-foreground)" }}>{placeholder}</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent removeBackgroundAndPadding align="start">
      <Calendar
        mode="single"
        selected={value || undefined}
        onSelect={(d) => onChange(d as Date)}
      />
    </PopoverContent>
  </Popover>
);

export function CoreActExecutionsTab() {
  const [operatorId, setOperatorId] = useState<string>("_all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filters = useMemo(() => {
    const f: any = {};
    if (operatorId !== "_all") f.operatorId = operatorId;
    if (startDate) f.startDate = startDate;
    if (endDate) {
      // Set end date to end of day to include all records on that day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      f.endDate = end;
    }
    return f;
  }, [operatorId, startDate, endDate]);

  const { data: teamData } = useTeamMembers();
  const { data: executionsData, isLoading } = useExecutions(filters);

  const kpis = useMemo(() => {
    if (!executionsData?.executions) return { totalHours: 0, totalExecutions: 0, avgDuration: 0, completedCount: 0 };
    
    const validExecutions = executionsData.executions.filter(e => e.durationMinutes != null);
    const totalMinutes = validExecutions.reduce((acc, e) => acc + (e.durationMinutes || 0), 0);
    const totalExecutions = executionsData.executions.length;
    
    return {
      totalHours: totalMinutes / 60,
      totalExecutions,
      avgDuration: validExecutions.length > 0 ? totalMinutes / validExecutions.length : 0,
      completedCount: executionsData.executions.filter(e => e.status === "completed").length
    };
  }, [executionsData]);

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Operador</span>
          <Select value={operatorId} onValueChange={setOperatorId}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os operadores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todos os operadores</SelectItem>
              {teamData?.teamMembers.map(tm => (
                <SelectItem key={tm.id} value={tm.id}>{tm.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Data Inicial</span>
          <DatePicker 
            value={startDate} 
            onChange={d => setStartDate(d || null)} 
            placeholder="Início do período" 
          />
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Data Final</span>
          <DatePicker 
            value={endDate} 
            onChange={d => setEndDate(d || null)} 
            placeholder="Fim do período" 
          />
        </div>

        {(operatorId !== "_all" || startDate || endDate) && (
          <div className={styles.filterGroup} style={{ alignSelf: "flex-end" }}>
            <Button variant="ghost" onClick={() => {
              setOperatorId("_all");
              setStartDate(null);
              setEndDate(null);
            }}>
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Registrado</span>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
            <Clock size={20} color="var(--muted-foreground)" />
            <span className={styles.kpiValue}>{kpis.totalHours.toFixed(1)}h</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Média por Execução</span>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
            <Activity size={20} color="var(--muted-foreground)" />
            <span className={styles.kpiValue}>{Math.round(kpis.avgDuration)}m</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total de Execuções</span>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
            <User size={20} color="var(--muted-foreground)" />
            <span className={styles.kpiValue}>{kpis.totalExecutions}</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Execuções Concluídas</span>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
            <CheckCircle2 size={20} color="var(--muted-foreground)" />
            <span className={styles.kpiValue}>{kpis.completedCount}</span>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {isLoading ? (
          <div style={{ padding: "var(--spacing-4)" }}>
            <Skeleton style={{ height: "200px" }} />
          </div>
        ) : !executionsData?.executions || executionsData.executions.length === 0 ? (
          <div className={styles.emptyState}>
            Nenhuma execução encontrada para os filtros selecionados.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Operador</th>
                <th>Ação / Tarefa</th>
                <th>Início / Fim</th>
                <th>Duração</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {executionsData.executions.map(exec => (
                <tr key={exec.id}>
                  <td>
                    <div className={styles.primaryText}>{exec.operatorName || "Desconhecido"}</div>
                  </td>
                  <td>
                    <div className={styles.primaryText}>{exec.actionTitle || "Ação não definida"}</div>
                    <div className={styles.secondaryText}>
                      {exec.taskName} • {exec.projectName || "Sem projeto"}
                    </div>
                  </td>
                  <td>
                    <div className={styles.primaryText}>{formatDateTime(exec.startedAt)}</div>
                    <div className={styles.secondaryText}>{exec.endedAt ? formatDateTime(exec.endedAt) : "Em andamento"}</div>
                  </td>
                  <td>
                    <div className={styles.primaryText}>{formatDuration(exec.durationMinutes)}</div>
                  </td>
                  <td>
                    <Badge variant={statusMap[exec.status as string]?.variant || "primary"}>
                      {statusMap[exec.status as string]?.label || exec.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}