import React from "react";
import styles from "./SectorBudgetGauge.module.css";

interface SectorBudgetGaugeProps {
  totalBudget: number;
  actualCost: number;
  formatCurrency: (value: number) => string;
  className?: string;
}

export const SectorBudgetGauge: React.FC<SectorBudgetGaugeProps> = ({
  totalBudget,
  actualCost,
  formatCurrency,
  className
}) => {
  // Safe percentage calculation to handle zero-budget scenarios gracefully
  const ratio = totalBudget > 0 ? actualCost / totalBudget : 0;
  const percentage = Math.min(Math.max(ratio, 0), 1);
  const displayPercent = Math.round(ratio * 100);

  // Math for SVG overlay arc
  // Circle circumf: 2 * PI * r => 2 * 3.14159 * 80 ≈ 502.65
  // Half circumf: 251.32
  const maxDashOffset = 251.32;
  const currentDashOffset = maxDashOffset - (percentage * maxDashOffset);

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles.header}>
        <div className={styles.headerCol}>
          <span className={styles.subtitle}>Project Cost Performance</span>
          <span className={styles.totalValue}>{formatCurrency(totalBudget)}</span>
          <span className={styles.label}>Total Budget</span>
        </div>
        <div className={styles.headerColRight}>
          <span className={styles.subtitle}>Actual Cost</span>
        </div>
      </div>

      <div className={styles.gaugeWrapper}>
        <svg viewBox="0 0 200 120" className={styles.svg}>
          {/* Background Track Segments */}
          <path 
            d="M 20 100 A 80 80 0 0 1 60 30.72" 
            fill="none" 
            className={styles.backgroundArcLight} 
            strokeWidth="20" 
          />
          <path 
            d="M 60 30.72 A 80 80 0 0 1 140 30.72" 
            fill="none" 
            className={styles.backgroundArcMedium} 
            strokeWidth="20" 
          />
          <path 
            d="M 140 30.72 A 80 80 0 0 1 180 100" 
            fill="none" 
            className={styles.backgroundArcDark} 
            strokeWidth="20" 
          />

          {/* Indicator Fill Arc */}
          <circle 
            cx="100" 
            cy="100" 
            r="80" 
            fill="none" 
            className={styles.fillArc} 
            strokeWidth="20" 
            strokeDasharray={`${maxDashOffset} 502.65`} 
            strokeDashoffset={currentDashOffset} 
            transform="rotate(180 100 100)" 
            strokeLinecap="round"
          />
        </svg>

        <div className={styles.centerValue}>
          <span className={styles.percentValue}>{displayPercent}%</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerValue}>{formatCurrency(actualCost)}</span>
        <span className={styles.label}>Actual Cost</span>
      </div>
    </div>
  );
};