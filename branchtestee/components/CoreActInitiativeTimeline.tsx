import React, { useMemo } from "react";
import { formatDate } from "../helpers/coreactInitiativesUtils";
import styles from "../pages/coreact.iniciativas.module.css";

export function CoreActInitiativeTimeline({ initiative }: { initiative: any }) {
  const projects = initiative.projects || [];
  
  const minDate = useMemo(() => {
    let min = initiative.startDate ? new Date(initiative.startDate).getTime() : Infinity;
    projects.forEach((p: any) => {
      if (p.startDate) min = Math.min(min, new Date(p.startDate).getTime());
    });
    return min === Infinity ? Date.now() : min;
  }, [initiative, projects]);

  const maxDate = useMemo(() => {
    let max = initiative.endDate ? new Date(initiative.endDate).getTime() : -Infinity;
    projects.forEach((p: any) => {
      if (p.endDate) max = Math.max(max, new Date(p.endDate).getTime());
      else if (p.startDate) max = Math.max(max, new Date(p.startDate).getTime() + 30 * 24 * 60 * 60 * 1000); // add 30 days if no end date
    });
    return max === -Infinity ? Date.now() + 30 * 24 * 60 * 60 * 1000 : max;
  }, [initiative, projects]);

  const totalDuration = Math.max(maxDate - minDate, 24 * 60 * 60 * 1000); // min 1 day to avoid div by zero

  const getStyleForDateRange = (start: string | null, end: string | null) => {
    const s = start ? new Date(start).getTime() : minDate;
    const e = end ? new Date(end).getTime() : (start ? new Date(start).getTime() + 30 * 24 * 60 * 60 * 1000 : maxDate);
    
    const left = Math.max(0, ((s - minDate) / totalDuration) * 100);
    const width = Math.min(100 - left, ((e - s) / totalDuration) * 100);
    
    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineHeader}>
        <div className={styles.timelineLabel}>Iniciativa: {initiative.name}</div>
        <div className={styles.timelineTrack}>
          <div 
            className={styles.timelineBarInitiative} 
            style={getStyleForDateRange(initiative.startDate, initiative.endDate)} 
          />
        </div>
      </div>
      
      <div className={styles.timelineProjects}>
        {projects.map((p: any) => (
          <div key={p.id} className={styles.timelineRow}>
            <div className={styles.timelineLabel}>{p.name}</div>
            <div className={styles.timelineTrack}>
              <div 
                className={styles.timelineBarProject} 
                style={getStyleForDateRange(p.startDate, p.endDate)} 
              />
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className={styles.emptyStateCompact}>Nenhum projeto vinculado para exibir na timeline.</div>
        )}
      </div>
      
      <div className={styles.timelineAxis}>
        <span>{formatDate(new Date(minDate))}</span>
        <span>{formatDate(new Date(maxDate))}</span>
      </div>
    </div>
  );
}