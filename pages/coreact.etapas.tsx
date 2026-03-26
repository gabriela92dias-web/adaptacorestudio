import React, { useState, useRef, useMemo, useEffect } from "react";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";
import styles from "./coreact.etapas.module.css";
import { Plus } from "lucide-react";

// Mock Data Generator for Performance Testing (1000 items)
const generateMockMilestones = (count: number) => {
  const result = [];
  const healths = ["OnTrack", "Delayed", "AtRisk"];
  const projects = ["Brand Studio", "Mobile App", "SMM Masterclass", "Executive Auth"];
  
  for (let i = 0; i < count; i++) {
    result.push({
      id: `ms-${i}`,
      name: `Milestone Delivery #${i + 1}`,
      project: projects[Math.floor(Math.random() * projects.length)],
      dateRange: `Jan ${Math.floor(Math.random() * 30) + 1} - Feb ${Math.floor(Math.random() * 28) + 1}`,
      progress: Math.floor(Math.random() * 101),
      health: healths[Math.floor(Math.random() * healths.length)],
    });
  }
  return result;
};

const INITIAL_MOCK = generateMockMilestones(1500); // 1500 rows to prove virtualization

export default function CoreactEtapas() {
  const { hasPermission } = usePermissions();
  const [milestones] = useState(INITIAL_MOCK);
  
  // Virtualization State
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  // Constants for Virtualization
  const ROW_HEIGHT = 86; // Approximate height of .row from CSS module
  const CONTAINER_HEIGHT = 600; // Fixed scroll window

  useEffect(() => {
    const handleScroll = (e: Event) => {
      setScrollTop((e.target as HTMLElement).scrollTop);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

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

  // Virtualization calculations
  const totalHeight = milestones.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 2); // Buffer of 2 rows above
  const visibleItemCount = Math.ceil(CONTAINER_HEIGHT / ROW_HEIGHT) + 4; // Buffer of 4 rows below
  const endIndex = Math.min(milestones.length, startIndex + visibleItemCount);

  const visibleMilestones = useMemo(() => {
    return milestones.slice(startIndex, endIndex);
  }, [milestones, startIndex, endIndex]);

  const offsetY = startIndex * ROW_HEIGHT;

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
          <Plus size={16} /> Nova Etapa (Virtualizada)
        </button>
      </header>

      <div className={styles.listContainer}>
        <div className={styles.listHeader}>
          <div>Milestone (Total: {milestones.length})</div>
          <div>Ciclo (Período)</div>
          <div>Progresso</div>
          <div style={{ textAlign: "right" }}>Status</div>
        </div>

        {/* Scrollable Viewport */}
        <div 
          ref={containerRef}
          style={{ height: `${CONTAINER_HEIGHT}px`, overflowY: 'auto', position: 'relative' }}
        >
          {/* Inner container with total height to ensure scrollbar is correct size */}
          <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
            {/* Wrapper that translates the visible rows down to the current scroll position */}
            <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', top: 0, left: 0, width: '100%' }}>
              {visibleMilestones.map((ms) => (
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
      </div>
    </div>
  );
}
