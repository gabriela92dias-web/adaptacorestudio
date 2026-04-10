import React, { useMemo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import { Avatar, AvatarFallback } from "./Avatar";
import styles from "./CoreactExecutiveHome.module.css";
import { FileText, CheckCircle2, AlertTriangle, Clock, Ban } from "lucide-react";
import {
  useProjects,
  useTasks,
  useBudgetItems,
  useTeamMembers,
  useAllActivities,
} from "../helpers/useCoreActApi";
import { Skeleton } from "./Skeleton";

/* ============================================================
   UTILS
   ============================================================ */
const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_PT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function formatShortDate(d: Date) {
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

function next7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

/* ============================================================
   GAUGE SVG inline (leve, zero dependências externas)
   ============================================================ */
function Gauge({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const dash = `${pct}, 100`;

  return (
    <div className={styles.metricRing}>
      <div style={{ position: "relative", width: 60, height: 60 }}>
        <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", position: "absolute", transform: "rotate(-90deg)" }}>
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke="var(--border)" strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke={color} strokeWidth="3" strokeDasharray={dash}
          />
        </svg>
        <span className={styles.metricValue} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>
          {value}
        </span>
      </div>
      <span className={styles.metricLabel}>{label}</span>
    </div>
  );
}

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
export function CoreactExecutiveHome({ userName }: { userName: string }) {
  const { data: projectsData, isLoading: lProj } = useProjects();
  const { data: tasksData,    isLoading: lTask } = useTasks();
  const { data: budgetData,   isLoading: lBudg } = useBudgetItems();
  const { data: teamData,     isLoading: lTeam } = useTeamMembers();
  const { data: activityData, isLoading: lAct  } = useAllActivities();

  const isLoading = lProj || lTask || lBudg || lTeam || lAct;

  /* ---------- Métricas ---------- */
  const metrics = useMemo(() => {
    if (!projectsData || !tasksData || !budgetData) return null;

    const projects = projectsData.projects;
    const tasks = tasksData.tasks;
    const budget = budgetData.budgetItems;

    const activeProjects = projects.filter(p => p.status !== "completed" && p.status !== "cancelled");
    const completedProjects = projects.filter(p => p.status === "completed");

    const taskCounts = {
      open:        tasks.filter(t => t.status === "open").length,
      in_progress: tasks.filter(t => t.status === "in_progress").length,
      completed:   tasks.filter(t => t.status === "completed").length,
      overdue:     tasks.filter(t => t.status === "overdue").length,
      standby:     tasks.filter(t => t.status === "standby").length,
      blocked:     tasks.filter(t => t.status === "blocked").length,
    };

    const totalTasks = tasks.length;
    const avgProgress = totalTasks > 0
      ? Math.round(tasks.reduce((acc, t) => acc + (t.progress || 0), 0) / totalTasks)
      : 0;

    const budgetPredicted = budget.reduce((acc, b) => acc + Number(b.predictedAmount || 0), 0);
    const budgetPaid      = budget.reduce((acc, b) => acc + Number(b.paidAmount      || 0), 0);
    const budgetPct       = budgetPredicted > 0 ? Math.round((budgetPaid / budgetPredicted) * 100) : 0;

    // Alertas dinâmicos
    const alerts: { label: string; type: "warning" | "error" }[] = [];
    if (taskCounts.overdue > 0)
      alerts.push({ label: `${taskCounts.overdue} atrasada${taskCounts.overdue > 1 ? "s" : ""}`, type: "warning" });
    if (taskCounts.blocked > 0)
      alerts.push({ label: `${taskCounts.blocked} bloqueada${taskCounts.blocked > 1 ? "s" : ""}`, type: "error" });
    projects.forEach(p => {
      const pb = budget.filter(b => b.projectId === p.id);
      const pred = pb.reduce((acc, b) => acc + Number(b.predictedAmount || 0), 0);
      const paid = pb.reduce((acc, b) => acc + Number(b.paidAmount      || 0), 0);
      if (pred > 0 && paid / pred >= 0.9)
        alerts.push({ label: `${p.name} no limite`, type: "error" });
    });

    // Tarefas em andamento (para o "In Progress" da coluna direita)
    const inProgressTasks = tasks.filter(t => t.status === "in_progress").slice(0, 4);

    // Timeline: últimas atividades do log
    const timelineItems = (activityData?.activityLogs || []).slice(0, 4);

    return {
      activeProjects,
      completedProjects,
      taskCounts,
      totalTasks,
      avgProgress,
      budgetPct,
      budgetPaid,
      alerts,
      inProgressTasks,
      timelineItems,
    };
  }, [projectsData, tasksData, budgetData, activityData]);

  /* ---------- Saudação ---------- */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  /* ---------- 7 dias p/ schedule ---------- */
  const week = next7Days();
  const today = new Date();
  today.setHours(0,0,0,0);

  // Datas com tarefas vencendo (usa endDate)
  const taskEndDates = useMemo(() => {
    const dates = new Set<string>();
    (tasksData?.tasks || []).forEach(t => {
      if (t.endDate && t.status !== "completed") {
        dates.add(new Date(t.endDate).toDateString());
      }
    });
    return dates;
  }, [tasksData]);

  /* ---------- Loading ---------- */
  if (isLoading || !metrics) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.topGrid}>
          <div className={styles.leftColumn}>
            <Skeleton style={{ height: 80 }} />
            <Skeleton style={{ height: 120 }} />
            <div className={styles.darkCardsRow}>
              <Skeleton style={{ height: 140 }} />
              <Skeleton style={{ height: 140 }} />
            </div>
          </div>
          <div className={styles.rightColumn}>
            <Skeleton style={{ height: 100 }} />
            <Skeleton style={{ height: 240 }} />
          </div>
        </div>
        <Skeleton style={{ height: 100 }} />
      </div>
    );
  }

  /* ---------- Construção do status bars ---------- */
  const STATUS_BARS = [
    { label: "Em andamento", count: metrics.taskCounts.in_progress, color: "var(--info-foreground)" },
    { label: "Abertas",      count: metrics.taskCounts.open,        color: "var(--muted-foreground)" },
    { label: "Atrasadas",    count: metrics.taskCounts.overdue,     color: "var(--error-foreground)" },
    { label: "Concluídas",   count: metrics.taskCounts.completed,   color: "var(--success-foreground)" },
    { label: "Standby",      count: metrics.taskCounts.standby,     color: "var(--warning-foreground)" },
  ].filter(s => s.count > 0);

  const maxCount = Math.max(...STATUS_BARS.map(s => s.count), 1);

  /* ---------- Donut orçamento ---------- */
  const budgetDonutData = [
    { value: metrics.budgetPct },
    { value: Math.max(0, 100 - metrics.budgetPct) },
  ];

  /* ---------- Half donut progresso ---------- */
  const segments = 8;
  const filled = Math.round((metrics.avgProgress / 100) * segments);
  const progressData = Array.from({ length: segments }, (_, i) => ({ value: 1 }));

  const progressColors = [
    "var(--primary)",
    "var(--chart-color-2)",
    "var(--chart-color-3)",
    "var(--chart-color-4)",
  ];

  /* ---------- Mensagem do banner ---------- */
  const bannerMsg = metrics.alerts.length === 0
    ? "Tudo sob controle — seus projetos estão progredindo bem."
    : `Você tem ${metrics.activeProjects.length} projeto${metrics.activeProjects.length !== 1 ? "s" : ""} ativo${metrics.activeProjects.length !== 1 ? "s" : ""}. Atenção aos alertas abaixo.`;

  return (
    <div className={styles.dashboardContainer}>

      <div className={styles.topGrid}>

        {/* ===== COLUNA ESQUERDA ===== */}
        <div className={styles.leftColumn}>

          {/* Welcome Banner */}
          <div className={styles.welcomeBanner}>
            <div className={styles.welcomeText}>
              <h1>{greeting}, {userName.split(" ")[0]}!</h1>
              <p>{bannerMsg}</p>
              {metrics.alerts.length > 0 && (
                <div className={styles.alertPills}>
                  {metrics.alerts.slice(0, 4).map((a, i) => (
                    <span
                      key={i}
                      className={`${styles.alertPill} ${a.type === "error" ? styles.alertPillError : styles.alertPillWarning}`}
                    >
                      <span className={styles.alertDot} />
                      {a.label}
                    </span>
                  ))}
                </div>
              )}
              {metrics.alerts.length === 0 && (
                <div className={styles.alertPills}>
                  <span className={`${styles.alertPill} ${styles.alertPillOk}`}>
                    <span className={styles.alertDot} />
                    Sem alertas ativos
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status de Tarefas (substituição do gráfico riscado) */}
          {STATUS_BARS.length > 0 && (
            <div className={styles.taskStatusCard}>
              <p className={styles.cardTitle}>Distribuição de Tarefas</p>
              <div className={styles.statusBars}>
                {STATUS_BARS.map(s => (
                  <div key={s.label} className={styles.statusBarRow}>
                    <span className={styles.statusBarLabel}>{s.label}</span>
                    <div className={styles.statusBarTrack}>
                      <div
                        className={styles.statusBarFill}
                        style={{
                          width: `${(s.count / maxCount) * 100}%`,
                          background: s.color,
                        }}
                      />
                    </div>
                    <span className={styles.statusBarCount}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orçamento + Gauges */}
          <div className={styles.darkCardsRow}>

            {/* Donut Orçamento */}
            <div className={styles.darkCard}>
              <div className={styles.darkCardHeader}>
                <FileText size={12} />
                Orçamento
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <div style={{ position: "relative", width: 90, height: 90 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetDonutData}
                        innerRadius={32} outerRadius={42}
                        dataKey="value" stroke="none"
                        isAnimationActive={false}
                        startAngle={90} endAngle={-270}
                      >
                        <Cell fill={
                          metrics.budgetPct >= 90 ? "var(--error-foreground)"
                          : metrics.budgetPct >= 70 ? "var(--warning-foreground)"
                          : "var(--primary)"
                        } />
                        <Cell fill="var(--border)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, fontFamily: "var(--font-family-heading)" }}>
                      {metrics.budgetPct}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gauges com dados reais */}
            <div className={styles.darkPanelsCombo}>
              <Gauge
                value={metrics.activeProjects.length}
                max={Math.max(metrics.activeProjects.length + metrics.completedProjects.length, 1)}
                color="var(--primary)"
                label="Projetos"
              />
              <Gauge
                value={metrics.taskCounts.completed}
                max={Math.max(metrics.totalTasks, 1)}
                color="var(--success-foreground)"
                label="Concluídas"
              />
              <Gauge
                value={metrics.taskCounts.overdue + metrics.taskCounts.blocked}
                max={Math.max(metrics.totalTasks, 1)}
                color="var(--error-foreground)"
                label="Alertas"
              />
            </div>
          </div>

        </div>

        {/* ===== COLUNA DIREITA ===== */}
        <div className={styles.rightColumn}>

          {/* Schedule — próximos 7 dias com marcadores de prazo */}
          <div className={styles.scheduleCard}>
            <p className={styles.cardTitle}>Próximos 7 Dias</p>
            <div className={styles.scheduleStrip}>
              {week.map((d, i) => {
                const isToday = d.toDateString() === today.toDateString();
                const hasTask = taskEndDates.has(d.toDateString());
                return (
                  <div key={i} className={styles.scheduleDay}>
                    <span className={styles.dayLabel}>{DAYS_PT[d.getDay()]}</span>
                    <div className={`${styles.dayCirc} ${isToday ? styles.dayCircActive : hasTask ? styles.dayCircHasTask : ""}`}>
                      {d.getDate()}
                      {hasTask && !isToday && <span className={styles.dayTaskDot} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall Progress + In Progress */}
          <div className={styles.overallProgressCard}>
            <p className={styles.cardTitle} style={{ alignSelf: "flex-start" }}>Progresso Geral</p>

            {/* Half donut real */}
            <div style={{ width: "100%", height: 100, position: "relative", marginTop: "0.25rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    cy="80%"
                    startAngle={180} endAngle={0}
                    innerRadius={42} outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {progressData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i < filled
                          ? progressColors[Math.min(i, progressColors.length - 1)]
                          : "var(--border)"
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", bottom: "10%", left: 0, right: 0, textAlign: "center" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-family-heading)", color: "var(--foreground)", lineHeight: 1 }}>
                  {metrics.avgProgress}%
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--muted-foreground)", fontWeight: 500, marginTop: 2 }}>
                  {metrics.avgProgress < 30 ? "Fase inicial" : metrics.avgProgress < 70 ? "Bom ritmo" : "Quase lá"}
                </div>
              </div>
            </div>

            {/* In Progress list */}
            <div className={styles.inProgressList}>
              <div className={styles.inProgressHeader}>
                <span className={styles.inProgressTitle}>Em Andamento</span>
              </div>

              {metrics.inProgressTasks.length === 0 ? (
                <p className={styles.emptySmall}>Nenhuma tarefa em andamento</p>
              ) : (
                metrics.inProgressTasks.map((task, i) => {
                  const colors = [
                    "var(--primary)",
                    "var(--info-foreground)",
                    "var(--success-foreground)",
                    "var(--warning-foreground)",
                  ];
                  return (
                    <div key={task.id} className={styles.progressItem}>
                      <div
                        className={styles.progressRingCircle}
                        style={{ border: `3px solid var(--border)`, borderTopColor: colors[i % colors.length] }}
                      >
                        {task.progress || 0}
                      </div>
                      <div className={styles.progressItemInfo}>
                        <span className={styles.progressItemTitle}>{task.name}</span>
                        <span className={styles.progressItemSubtitle}>
                          {task.projectName || task.assigneeName || "Sem projeto"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ===== TIMELINE (atividade real) ===== */}
      <div className={styles.timelineCard}>
        <div className={styles.timelineHeader}>Atividade Recente</div>

        {metrics.timelineItems.length === 0 ? (
          <p className={styles.emptySmall}>Nenhuma atividade registrada ainda.</p>
        ) : (
          <div className={styles.timelineTrack}>
            <div className={styles.timelineLine} />
            {metrics.timelineItems.map((log, i) => {
              const date = log.performedAt ? new Date(log.performedAt) : new Date();
              const actionLabels: Record<string, string> = {
                created: "Criado",
                completed: "Concluído",
                deleted: "Removido",
                commented: "Comentado",
                updated: "Atualizado",
                status_changed: "Status alterado",
                assigned: "Atribuído",
              };
              const entityLabels: Record<string, string> = {
                tasks: "Tarefa",
                projects: "Projeto",
                budget_items: "Orçamento",
                team_members: "Membro",
              };

              return (
                <div key={log.id || i} className={styles.timelineNode}>
                  <div className={styles.nodeDiamond} />
                  <div className={styles.nodeContentBottom}>
                    <div className={styles.nodeDate}>{formatShortDate(date)}</div>
                    <div className={styles.nodeTitle}>
                      {actionLabels[log.action ?? ""] ?? "Ação"}
                    </div>
                    <div className={styles.nodeDesc}>
                      {entityLabels[log.entityType ?? ""] ?? "Item"}
                      {log.performerName ? ` · ${log.performerName}` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
