import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./Avatar";
import { SectorDashboardStats, MemberStat, StageStat } from "../helpers/useSectorDashboardData";
import styles from "./SectorTaskCenter.module.css";

interface SectorTaskCenterProps {
  centralTarefas: SectorDashboardStats['centralTarefas'];
  memberStats: MemberStat[];
  stageStats: StageStat[];
  className?: string;
}

export const SectorTaskCenter: React.FC<SectorTaskCenterProps> = ({
  centralTarefas,
  memberStats,
  stageStats,
  className
}) => {
  const [activeTab, setActiveTab] = useState<"geral" | "executor" | "etapa">("geral");

  const trendTotal = centralTarefas.novos + centralTarefas.concluidos || 1;
  const trendNewPct = (centralTarefas.novos / trendTotal) * 100;
  const trendDonePct = (centralTarefas.concluidos / trendTotal) * 100;

  return (
    <div className={`${styles.card} ${className || ""}`}>
      <div className={styles.headerRow}>
        <h3 className={styles.cardTitle}>Tarefas</h3>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'geral' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('geral')}
          >
            Geral
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'executor' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('executor')}
          >
            Executor
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'etapa' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('etapa')}
          >
            Etapa
          </button>
        </div>
      </div>

      <div className={styles.contentArea}>
        {activeTab === 'geral' && (
          <div className={styles.tabContentGeral}>
            <div className={styles.topMetricsRow}>
              <div className={styles.bigStatBox}>
                <span className={styles.bigStatLabel}>Ativas</span>
                <span className={styles.bigStatValue}>{centralTarefas.ativas}</span>
              </div>
              <div className={styles.smallMetrics}>
                <div className={styles.alertBox}>
                  <Calendar size={16} />
                  <div className={styles.alertBoxContent}>
                    <span>Atrasadas</span>
                    <strong>{centralTarefas.atrasadas}</strong>
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <span>Hoje</span>
                  <strong>{centralTarefas.hoje}</strong>
                </div>
                <div className={styles.infoBox}>
                  <span>Amanhã</span>
                  <strong>{centralTarefas.amanha}</strong>
                </div>
              </div>
            </div>

            <div className={styles.priorityDist}>
              <div className={styles.priorityItem}>
                <span className={styles.priorityLabel}>Urgente</span>
                <span className={styles.priorityValue}>{centralTarefas.prioridades.urgente}</span>
              </div>
              <div className={styles.priorityItem}>
                <span className={styles.priorityLabel}>Alta</span>
                <span className={styles.priorityValue}>{centralTarefas.prioridades.alta}</span>
              </div>
              <div className={styles.priorityItem}>
                <span className={styles.priorityLabel}>Média</span>
                <span className={styles.priorityValue}>{centralTarefas.prioridades.media}</span>
              </div>
              <div className={styles.priorityItem}>
                <span className={styles.priorityLabel}>Baixa</span>
                <span className={styles.priorityValue}>{centralTarefas.prioridades.baixa}</span>
              </div>
              <div className={styles.priorityItem}>
                <span className={styles.priorityLabel}>Não prio.</span>
                <span className={styles.priorityValue}>{centralTarefas.prioridades.semPrio}</span>
              </div>
            </div>

            <div className={styles.trendRow}>
              <div className={styles.trendCol}>
                <span className={styles.trendLabel}>Novos</span>
                <span className={styles.trendValue}>{centralTarefas.novos}</span>
              </div>
              <div className={styles.trendCenter}>
                <span className={styles.trendLabelCenter}>Tendência últimos 7 dias</span>
                <div className={styles.trendBar}>
                  <div 
                    className={styles.trendSegmentInfo} 
                    style={{ width: `${trendNewPct}%` }} 
                  />
                  <div 
                    className={styles.trendSegmentSuccess} 
                    style={{ width: `${trendDonePct}%` }} 
                  />
                </div>
              </div>
              <div className={styles.trendColRight}>
                <span className={styles.trendLabel}>Concluídos</span>
                <span className={styles.trendValue}>{centralTarefas.concluidos}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'executor' && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Executor</th>
                  <th className={styles.textRight}>Até hoje</th>
                  <th className={styles.textRight}>Atrasadas</th>
                  <th className={styles.textRight}>Hoje</th>
                </tr>
              </thead>
              <tbody>
                {memberStats.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className={styles.userCell}>
                        <Avatar className={styles.tinyAvatar}>
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {m.memberInitials || m.memberName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className={styles.truncate}>{m.memberName}</span>
                      </div>
                    </td>
                    <td className={styles.textRight}>{m.totalTasks}</td>
                    <td className={styles.textRight}>{m.overdueTasks}</td>
                    <td className={styles.textRight}>{m.todayTasks}</td>
                  </tr>
                ))}
                {memberStats.length === 0 && (
                  <tr>
                    <td colSpan={4} className={styles.emptyState}>Nenhum dado encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'etapa' && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Etapa</th>
                  <th className={styles.textRight}>Até hoje</th>
                  <th className={styles.textRight}>Atrasadas</th>
                  <th className={styles.textRight}>Hoje</th>
                </tr>
              </thead>
              <tbody>
                {stageStats.map(s => (
                  <tr key={s.name}>
                    <td className={styles.truncate}>▷ {s.name}</td>
                    <td className={styles.textRight}>{s.total}</td>
                    <td className={styles.textRight}>{s.overdue}</td>
                    <td className={styles.textRight}>{s.today}</td>
                  </tr>
                ))}
                {stageStats.length === 0 && (
                  <tr>
                    <td colSpan={4} className={styles.emptyState}>Nenhuma etapa encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};