import React from "react";
import { useSectorDashboardData } from "../helpers/useSectorDashboardData";
import { SectorBudgetGauge } from "./SectorBudgetGauge";
import { SectorTaskCenter } from "./SectorTaskCenter";
import { Skeleton } from "./Skeleton";
import { Badge } from "./Badge";
import { Progress } from "./Progress";
import { Clock, AlertTriangle, XCircle, CheckCircle, ClipboardList } from "lucide-react";
import styles from "./CoreactSectorDashboard.module.css";

export const CoreactSectorDashboard = ({ sector }: { sector: { id: string; name: string } }) => {
  const {
    isLoading,
    stats,
    memberStats,
    stageStats,
  } = useSectorDashboardData(sector.id);

  if (isLoading || !stats) {
    return (
      <div className={styles.container}>
        <Skeleton className={styles.skeletonKpiStrip} />
        <div className={styles.mainGrid}>
          <div className={styles.leftCol}>
            <div className={styles.overviewStrip}>
              <Skeleton className={styles.skeletonCard} />
              <Skeleton className={styles.skeletonCard} />
              <Skeleton className={styles.skeletonCard} />
            </div>
            <Skeleton className={styles.skeletonTable} />
          </div>
          <div className={styles.rightCol}>
            <Skeleton className={styles.skeletonTable} />
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const renderProjectRow = (p: any) => {
    const pTasks = stats.sectorTasks.filter(t => t.projectId === p.id);
    const progress = pTasks.length > 0 ? pTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / pTasks.length : 0;
    
    // Find most active operator
    let activeOperator = "-";
    if (pTasks.length > 0) {
      const counts = pTasks.reduce((acc, t) => {
        if (t.assigneeName) acc[t.assigneeName] = (acc[t.assigneeName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (top) activeOperator = top[0];
    }

    let farol = "green";
    if (p.status === 'paused' || p.priority === 'high') farol = "yellow";
    if (p.status === 'cancelled' || p.priority === 'critical') farol = "red";

    let timelinePct = 0;
    if (p.startDate && p.endDate) {
      const start = new Date(p.startDate).getTime();
      const end = new Date(p.endDate).getTime();
      const now = Date.now();
      if (now >= end) timelinePct = 100;
      else if (now <= start) timelinePct = 0;
      else timelinePct = ((now - start) / (end - start)) * 100;
    }

    return (
      <tr key={p.id}>
        <td className={styles.fw500}>{p.name}</td>
        <td>
          <div className={styles.timelineBar}>
            <div className={styles.timelineFill} style={{ width: `${timelinePct}%` }} />
          </div>
        </td>
        <td className={styles.textSm}>{activeOperator}</td>
        <td>
          {p.endDate ? (
            <span className={farol === 'red' ? styles.textDanger : ''}>
              {new Date(p.endDate).toLocaleDateString('pt-BR')}
            </span>
          ) : '-'}
        </td>
        <td>
          <div className={styles.progressCell}>
            <div style={{ "--primary": "var(--success-foreground)", flex: 1 } as React.CSSProperties}>
              <Progress value={progress} className={styles.miniProgress} />
            </div>
            <span className={styles.textXs}>{Math.round(progress)}%</span>
          </div>
        </td>
        <td>
          <Badge variant={p.status === 'completed' ? 'success' : p.status === 'active' ? 'primary' : 'outline'}>
            {p.status === 'completed' ? 'Em dia' : p.status === 'active' ? 'Ativo' : p.status}
          </Badge>
        </td>
        <td>
          <div className={`${styles.farolDot} ${styles[`farol-${farol}`]}`} />
        </td>
      </tr>
    );
  };

  const hasProjects = stats.projectsThisMonth.length > 0 || stats.projectsNextMonth.length > 0;

  return (
    <div className={styles.container}>
      {/* COMPACT KPI STRIP */}
      <div className={styles.kpiStrip}>
        <div className={styles.kpiItem}>
          <div className={styles.kpiIconCompact}><ClipboardList size={14} /></div>
          <div className={styles.kpiContentCompact}>
            <span className={styles.kpiValueCompact}>{stats.totalProjects}</span>
            <span className={styles.kpiLabelCompact}>TOTAL DE PROJETOS</span>
          </div>
        </div>
        <div className={styles.kpiItem}>
          <div className={styles.kpiIconCompact}><Clock size={14} /></div>
          <div className={styles.kpiContentCompact}>
            <span className={styles.kpiValueCompact}>{stats.tasksPending}</span>
            <span className={styles.kpiLabelCompact}>PENDENTES</span>
          </div>
        </div>
        <div className={styles.kpiItem}>
          <div className={styles.kpiIconCompact}><CheckCircle size={14} /></div>
          <div className={styles.kpiContentCompact}>
            <span className={styles.kpiValueCompact}>{stats.tasksCompleted}</span>
            <span className={styles.kpiLabelCompact}>CONCLUÍDOS</span>
          </div>
        </div>
        <div className={styles.kpiItemRight}>
          <div className={styles.kpiContentCompactRight}>
            <span className={styles.kpiValueCompact}>{formatCurrency(stats.totalPredicted)}</span>
            <span className={styles.kpiLabelCompact}>VALOR PREVISTO</span>
          </div>
        </div>
        <div className={styles.kpiItemRight}>
          <div className={styles.kpiContentCompactRight}>
            <span className={styles.kpiValueCompact}>{formatCurrency(stats.totalPaid)}</span>
            <span className={styles.kpiLabelCompact}>VALOR GASTO</span>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className={styles.mainGrid}>
        
        {/* LEFT COLUMN */}
        <div className={styles.leftCol}>
          
          <div className={styles.overviewStrip}>
            <div className={styles.compactCard}>
              <h3 className={styles.cardTitleCenterCompact}>Etapas</h3>
              <div className={styles.overviewRowsCompact}>
                <div className={styles.overviewRowCompact}>
                  <div className={styles.iconCircleBlueMini}><Clock size={12} /></div>
                  <div style={{ "--primary": "var(--info)", flex: 1 } as React.CSSProperties}>
                    <Progress value={(stats.etapasOverview.emAndamento / stats.etapasOverview.total) * 100} className={styles.miniProgress} />
                  </div>
                  <span className={styles.fw600Compact}>{stats.etapasOverview.emAndamento}</span>
                </div>
                <div className={styles.overviewRowCompact}>
                  <div className={styles.iconCircleYellowMini}><AlertTriangle size={12} /></div>
                  <div style={{ "--primary": "var(--warning-foreground)", flex: 1 } as React.CSSProperties}>
                    <Progress value={(stats.etapasOverview.atencao / stats.etapasOverview.total) * 100} className={styles.miniProgress} />
                  </div>
                  <span className={styles.fw600Compact}>{stats.etapasOverview.atencao}</span>
                </div>
                <div className={styles.overviewRowCompact}>
                  <div className={styles.iconCircleRedMini}><XCircle size={12} /></div>
                  <div style={{ "--primary": "var(--error-foreground)", flex: 1 } as React.CSSProperties}>
                    <Progress value={(stats.etapasOverview.bloqueada / stats.etapasOverview.total) * 100} className={styles.miniProgress} />
                  </div>
                  <span className={styles.fw600Compact}>{stats.etapasOverview.bloqueada}</span>
                </div>
                <div className={styles.overviewRowCompact}>
                  <div className={styles.iconCircleGreenMini}><CheckCircle size={12} /></div>
                  <div style={{ "--primary": "var(--success-foreground)", flex: 1 } as React.CSSProperties}>
                    <Progress value={(stats.etapasOverview.concluida / stats.etapasOverview.total) * 100} className={styles.miniProgress} />
                  </div>
                  <span className={styles.fw600Compact}>{stats.etapasOverview.concluida}</span>
                </div>
              </div>
            </div>

            <div className={styles.compactCard}>
              <h3 className={styles.cardTitleCenterCompact}>Atividades</h3>
              <div className={styles.overviewRowsCompact}>
                <div className={styles.overviewRowCompact}>
                  <div className={styles.iconCircleBlueMini}><Clock size={12} /></div>
                  <div style={{ "--primary": "var(--info)", flex: 1 } as React.CSSProperties}>
                    <Progress value={(stats.atividadesOverview.in_progress / stats.atividadesOverview.total) * 100} className={styles.miniProgress} />
                  </div>
                  <span className={styles.fw600Compact}>{stats.atividadesOverview.in_progress}</span>
                </div>
                <div className={styles.overviewRowCompact}>
                  <div className={styles.iconCircleYellowMini}><AlertTriangle size={12} /></div>
                  <div style={{ "--primary": "var(--warning-foreground)", flex: 1 } as React.CSSProperties}>
                    <Progress value={(stats.atividadesOverview.pending / stats.atividadesOverview.total) * 100} className={styles.miniProgress} />
                  </div>
                  <span className={styles.fw600Compact}>{stats.atividadesOverview.pending}</span>
                </div>
                <div className={styles.overviewRowCompact}>
                  <div className={styles.iconCircleRedMini}><XCircle size={12} /></div>
                  <div style={{ "--primary": "var(--error-foreground)", flex: 1 } as React.CSSProperties}>
                    <Progress value={(stats.atividadesOverview.rejected / stats.atividadesOverview.total) * 100} className={styles.miniProgress} />
                  </div>
                  <span className={styles.fw600Compact}>{stats.atividadesOverview.rejected}</span>
                </div>
                <div className={styles.overviewRowCompact}>
                  <div className={styles.iconCircleGreenMini}><CheckCircle size={12} /></div>
                  <div style={{ "--primary": "var(--success-foreground)", flex: 1 } as React.CSSProperties}>
                    <Progress value={(stats.atividadesOverview.completed / stats.atividadesOverview.total) * 100} className={styles.miniProgress} />
                  </div>
                  <span className={styles.fw600Compact}>{stats.atividadesOverview.completed}</span>
                </div>
              </div>
            </div>

            <SectorBudgetGauge 
              totalBudget={stats.totalPredicted} 
              actualCost={stats.totalPaid} 
              formatCurrency={formatCurrency} 
              className={styles.compactGauge}
            />
          </div>

          {hasProjects && (
            <div className={styles.tableCard}>
              <h3 className={styles.cardTitle}>Projetos da equipe</h3>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Cronograma</th>
                      <th>Operador mais ativo</th>
                      <th>Prazo</th>
                      <th>% Completo</th>
                      <th>Situação</th>
                      <th>Situação - Farol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.projectsThisMonth.length > 0 && (
                      <>
                        <tr className={styles.tableGroupHeader}>
                          <td colSpan={7}>Este mês</td>
                        </tr>
                        {stats.projectsThisMonth.map(renderProjectRow)}
                      </>
                    )}
                    {stats.projectsNextMonth.length > 0 && (
                      <>
                        <tr className={styles.tableGroupHeader}>
                          <td colSpan={7}>Próximo mês</td>
                        </tr>
                        {stats.projectsNextMonth.map(renderProjectRow)}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightCol}>
          <SectorTaskCenter 
            centralTarefas={stats.centralTarefas} 
            memberStats={memberStats} 
            stageStats={stageStats} 
            className={styles.taskCenterStretch}
          />
        </div>

      </div>
    </div>
  );
};