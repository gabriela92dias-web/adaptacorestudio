import React from "react";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";
import styles from "./coreact.etapas.module.css";
import { Plus } from "lucide-react";

const MOCK_MILESTONES = [
  {
    id: "ms-1",
    name: "Design System Architecture",
    project: "Brand Studio Expansion",
    dateRange: "Jan 10 - Jan 24",
    progress: 100,
    health: "OnTrack", // OnTrack, Delayed, AtRisk
  },
  {
    id: "ms-2",
    name: "Database Migration",
    project: "Executive Dashboard",
    dateRange: "Jan 15 - Feb 02",
    progress: 45,
    health: "AtRisk",
  },
  {
    id: "ms-3",
    name: "User Interviews",
    project: "SMM Masterclass",
    dateRange: "Jan 05 - Jan 12",
    progress: 80,
    health: "Delayed",
  },
  {
    id: "ms-4",
    name: "Component Library Implementation",
    project: "Mobile App Wireframe",
    dateRange: "Feb 01 - Feb 28",
    progress: 0,
    health: "OnTrack",
  }
];

export default function CoreactEtapas() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("coreactEtapas")) {
    return <PermissionWall moduleName="Etapas" />;
  }

  const getHealthLabel = (code: string) => {
    switch (code) {
      case "OnTrack": return "On Track";
      case "Delayed": return "Delayed";
      case "AtRisk": return "At Risk";
      default: return code;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Etapas</h1>
        <button style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.75rem 1.5rem", background: "var(--text-primary)", 
          color: "var(--bg-primary)", borderRadius: "999px",
          border: "none", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer"
        }}>
          <Plus size={16} /> Nova Etapa
        </button>
      </header>

      <div className={styles.listContainer}>
        <div className={styles.listHeader}>
          <div>Milestone</div>
          <div>Ciclo (Período)</div>
          <div>Progresso</div>
          <div style={{ textAlign: "right" }}>Status</div>
        </div>

        <div className={styles.listBody}>
          {MOCK_MILESTONES.map((ms) => (
            <div key={ms.id} className={styles.row}>
              <div className={styles.colName}>
                <span className={styles.milestoneName}>{ms.name}</span>
                <span className={styles.milestoneProject}>{ms.project}</span>
              </div>
              <div className={styles.colDate}>
                {ms.dateRange}
              </div>
              <div className={styles.colProgress}>
                <div className={styles.progressTrack}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${ms.progress}%` }} 
                  />
                </div>
                <div className={styles.progressText}>{ms.progress}%</div>
              </div>
              <div className={styles.colHealth}>
                <div className={`${styles.healthBadge} ${styles[`health_${ms.health}`]}`}>
                  <span className={styles.statusDot} />
                  {getHealthLabel(ms.health)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
